'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function AntigravityCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  const frameCount = 147
  const currentFrame = (index: number) =>
    `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a4af72c/anim/sequence/large/01-hero-lightpass/${index.toString().padStart(4, '0')}.jpg`

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const context = canvas.getContext('2d')
    if (!context) return

    canvas.width = 1158
    canvas.height = 770

    const images: HTMLImageElement[] = []
    const airpods = { frame: 0 }

    const preloadImages = () => {
      let loadedCount = 0
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = currentFrame(i)
        img.onload = () => {
          loadedCount++
          setProgress(Math.round((loadedCount / frameCount) * 100))
          if (loadedCount === frameCount) {
            setIsLoaded(true)
            initAnimation()
          }
        }
        images.push(img)
      }
    }

    const render = () => {
      if (images[airpods.frame] && images[airpods.frame].complete) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(images[airpods.frame], 0, 0)
      }
    }

    const initAnimation = () => {
      // Direct Tracking Mode
      ScrollTrigger.create({
        trigger: container,
        pin: true,
        start: "top top",
        end: "+=500%", // Longer scroll for more precision
        scrub: true,   // ZERO delay. Follows mouse exactly.
        anticipatePin: 1,
        onUpdate: (self) => {
          const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(self.progress * frameCount)
          )
          if (airpods.frame !== frameIndex) {
            airpods.frame = frameIndex
            render()
          }
        }
      })
    }

    preloadImages()

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <div className="text-cyan-500 text-[10px] font-black uppercase tracking-[1em] mb-4">Neural Sync</div>
          <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-cyan-500 transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-[8px] text-white/20">{progress}%</div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />

      {/* Pinned Hero Text */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
         <h1 className="text-[14vw] font-black tracking-tighter uppercase italic text-white mix-blend-overlay opacity-40">
            ANTIGRAVITY
         </h1>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
    </div>
  )
}
