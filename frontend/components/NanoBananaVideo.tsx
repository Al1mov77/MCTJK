'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface VideoProps {
  src?: string
  onProgress?: (progress: number) => void
  onReady?: () => void
}

export default function NanoBananaVideo({ 
  src = "/nano-video-intro.mp4",
  onProgress,
  onReady
}: VideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isBuffering = useRef(false)
  const hasFinished = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    const imageCache: HTMLImageElement[] = []

    const startBuffering = async () => {
      if (isBuffering.current || hasFinished.current) return
      if (!video.duration || video.duration === 0 || !video.videoWidth) return

      isBuffering.current = true
      
      const duration = video.duration
      const fps = 25 
      const totalFrames = Math.floor(duration * fps)

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      try {
        for (let i = 0; i < totalFrames; i++) {
          const time = (i / totalFrames) * duration
          video.currentTime = time
          
          await new Promise((resolve) => {
            const timeout = setTimeout(() => resolve(true), 1000)
            const onSeeked = () => {
              clearTimeout(timeout)
              video.removeEventListener('seeked', onSeeked)
              resolve(true)
            }
            video.addEventListener('seeked', onSeeked)
          })

          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
          const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.6))
          if (blob) {
            const url = URL.createObjectURL(blob)
            const img = new Image()
            img.src = url
            await new Promise(r => img.onload = r)
            imageCache.push(img)
          }
          
          if (onProgress) onProgress(Math.round(((i + 1) / totalFrames) * 100))
        }

        hasFinished.current = true
        if (onReady) onReady()

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
        if (onReady) onReady()
      }
    }

    const checkInterval = setInterval(() => {
      if (!isBuffering.current && !hasFinished.current) startBuffering()
    }, 300)

    video.addEventListener('loadedmetadata', startBuffering)
    video.addEventListener('canplaythrough', startBuffering)
    if (video.readyState >= 1) startBuffering()

    return () => {
      clearInterval(checkInterval)
      video.removeEventListener('loadedmetadata', startBuffering)
      video.removeEventListener('canplaythrough', startBuffering)
    }
  }, [src]) // Удалил onProgress и onReady из зависимостей, чтобы избежать перезапуска!

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] bg-black overflow-hidden pointer-events-none transform-gpu">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-100 brightness-110" />
      <video ref={videoRef} src={src} className="hidden" muted playsInline />
      <div className="absolute inset-0 bg-black/10" />
    </div>
  )
}
