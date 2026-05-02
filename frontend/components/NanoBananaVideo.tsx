'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface VideoProps {
  src?: string
  onProgress?: (progress: number) => void
  onReady?: () => void
}

export default function NanoBananaVideo({ 
  src = "/grok-video-0f172a7a-3924-44bb-b502-55ad63b8e2fe (4).mp4",
  onProgress,
  onReady
}: VideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isBuffering = useRef(false)
  const hasFinished = useRef(false)
  
  const onProgressRef = useRef(onProgress)
  const onReadyRef = useRef(onReady)

  useEffect(() => {
    onProgressRef.current = onProgress
    onReadyRef.current = onReady
  }, [onProgress, onReady])

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
    const imageCache: HTMLImageElement[] = []

    const startBuffering = async () => {
      if (isBuffering.current || hasFinished.current) return
      
      const duration = video.duration
      if (!duration || isNaN(duration)) return

      isBuffering.current = true
      
      // Calculate optimal frames (max 150 for performance/speed)
      const targetFrames = Math.min(150, Math.floor(duration * 15))
      const totalFrames = targetFrames

      canvas.width = video.videoWidth || 1280 // Slightly lower res for faster buffering
      canvas.height = video.videoHeight || 720

      try {
        for (let i = 0; i < totalFrames; i++) {
          const time = (i / totalFrames) * duration
          video.currentTime = time
          
          // Wait for seek with a shorter timeout but retry logic
          await new Promise((resolve) => {
            const timeout = setTimeout(() => resolve(true), 1000)
            const onSeeked = () => {
              clearTimeout(timeout)
              video.removeEventListener('seeked', onSeeked)
              resolve(true)
            }
            video.addEventListener('seeked', onSeeked)
          })

          if (ctx) {
             ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
             const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.5))
             if (blob) {
               const url = URL.createObjectURL(blob)
               const img = new Image() as HTMLImageElement
               img.src = url
               
               if ('decode' in img) {
                 await img.decode().catch(() => {})
               } else {
                 await new Promise(r => (img as any).onload = r)
               }
               imageCache.push(img)
             }
          }
          
          if (onProgressRef.current) {
            onProgressRef.current(Math.floor(((i + 1) / totalFrames) * 100))
          }
        }

        hasFinished.current = true
        if (onReadyRef.current) onReadyRef.current()

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
      } catch (err) {
        if (onReadyRef.current) onReadyRef.current()
      }
    }

    const checkInterval = setInterval(() => {
      if (!isBuffering.current && !hasFinished.current) {
         if (video.readyState >= 1) {
            startBuffering()
         } else {
            // Force load if stuck
            video.load()
         }
      }
    }, 1000)

    video.addEventListener('loadedmetadata', startBuffering)
    if (video.readyState >= 1) startBuffering()

    return () => {
      clearInterval(checkInterval)
      video.removeEventListener('loadedmetadata', startBuffering)
    }
  }, [src])

  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-black overflow-hidden pointer-events-none transform-gpu">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-110" />
      <video ref={videoRef} src={src} className="hidden" muted playsInline preload="auto" />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  )
}
