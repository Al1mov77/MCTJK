'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function AntigravityVideo({ 
  src = "https://player.vimeo.com/external/494252666.hd.mp4?s=3468516088f1704948a37f90e599e0d196414f6b&profile_id=175" 
}: { src?: string } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [bufferProgress, setBufferProgress] = useState(0)
  const isBuffering = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    const imageCache: HTMLImageElement[] = []

    const startBuffering = async () => {
      if (!video.duration || !ctx || isBuffering.current) return
      isBuffering.current = true
      
      const duration = video.duration
      const fps = 24 
      const totalFrames = Math.floor(duration * fps)

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      for (let i = 0; i < totalFrames; i++) {
        const time = (i / totalFrames) * duration
        video.currentTime = time
        
        await new Promise((resolve) => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked)
            resolve(true)
          }
          video.addEventListener('seeked', onSeeked)
        })

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.7))
        if (blob) {
          const url = URL.createObjectURL(blob)
          const img = new Image()
          img.src = url
          await new Promise(r => img.onload = r)
          imageCache.push(img)
        }
        setBufferProgress(Math.round(((i + 1) / totalFrames) * 100))
      }

      setIsReady(true)

      const sync = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        if (maxScroll <= 0) return

        const progress = scrollY / maxScroll
        const frameIndex = Math.min(imageCache.length - 1, Math.floor(progress * imageCache.length))
        
        const img = imageCache[frameIndex]
        if (img && ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
      }

      gsap.ticker.add(sync)
      return () => {
        gsap.ticker.remove(sync)
        imageCache.forEach(img => URL.revokeObjectURL(img.src))
      }
    }

    video.addEventListener('loadedmetadata', startBuffering)
    video.crossOrigin = "anonymous" // Важно для внешних видео
    if (video.readyState >= 1) startBuffering()

    return () => {
      video.removeEventListener('loadedmetadata', startBuffering)
      isBuffering.current = false
    }
  }, [src])

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] bg-black overflow-hidden pointer-events-none">
      {!isReady && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
          <div className="text-[10px] text-cyan-500 font-bold tracking-[0.5em]">{bufferProgress}%</div>
        </div>
      )}

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-60 brightness-125 saturate-150" />
      <video ref={videoRef} src={src} className="hidden" muted playsInline crossOrigin="anonymous" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
    </div>
  )
}
