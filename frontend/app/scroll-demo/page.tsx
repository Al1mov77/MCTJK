'use client'

import { useRef, useEffect } from 'react'
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useSmoothScroll } from '../../lib/SmoothScrollProvider'
import { cn } from '../../lib/utils'

export default function ScrollDemoPage() {
  const { scrollY, maxScroll } = useSmoothScroll()
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Debug: Log scroll values
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (value) => {
      console.log('Scroll Y:', value)
    })
    return unsubscribe
  }, [scrollY])
  
  useEffect(() => {
    console.log('Max Scroll:', maxScroll)
  }, [maxScroll])
  
  // Hero animations
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.8])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroY = useTransform(scrollY, [0, 500], [0, -100])
  
  // Parallax effects
  const parallax1Y = useTransform(scrollY, [0, 1000], [0, -150])
  const parallax2Y = useTransform(scrollY, [0, 1000], [0, -300])
  const parallax3Y = useTransform(scrollY, [0, 1000], [0, -450])
  
  // Sticky section animations
  const stickyScale = useTransform(scrollY, [1000, 1500], [0.8, 1])
  const stickyRotate = useTransform(scrollY, [1000, 1500], [0, 360])
  const stickyOpacity = useTransform(scrollY, [1000, 1100], [0, 1])
  
  // Video scrubbing
  const videoProgress = useTransform(scrollY, [2000, 3000], [0, 1])
  
  // Horizontal scroll
  const horizontalX = useTransform(scrollY, [3000, 4000], [0, -1000])
  
  // Update video time based on scroll
  useEffect(() => {
    if (videoRef.current) {
      const progress = videoProgress.get()
      const duration = videoRef.current.duration || 10
      videoRef.current.currentTime = progress * duration
    }
  }, [videoProgress])
  
  return (
    <div className="relative bg-background text-foreground">
      
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900/20 dark:to-rose-900/20" />
        
        <motion.div
          style={{
            scale: heroScale,
            opacity: heroOpacity,
            y: heroY
          }}
          className="relative z-10 text-center px-8"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
            Smooth Scroll
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Custom scroll engine with Framer Motion integration
          </p>
        </motion.div>
        
        {/* Parallax layers */}
        <motion.div
          style={{ y: parallax1Y }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-500 to-rose-500 rounded-full opacity-20"
        />
        <motion.div
          style={{ y: parallax2Y }}
          className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20"
        />
        <motion.div
          style={{ y: parallax3Y }}
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-full opacity-20"
        />
      </section>
      
      {/* Parallax Section */}
      <section className="h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              style={{ y: useTransform(scrollY, [0, 1000], [0, -(i * 100)]) }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-rose-500 rounded-full mb-4" />
              <h3 className="text-2xl font-bold mb-4">Card {i}</h3>
              <p className="text-muted-foreground">
                Parallax layer moving at different speeds based on scroll position
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Sticky Section */}
      <section className="h-[300vh] relative">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <motion.div
            style={{
              scale: stickyScale,
              rotate: stickyRotate,
              opacity: stickyOpacity
            }}
            className="w-64 h-64 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl shadow-2xl flex items-center justify-center"
          >
            <span className="text-white text-4xl font-bold">Sticky</span>
          </motion.div>
        </div>
      </section>
      
      {/* Video Scrubbing Section */}
      <section className="h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20" />
        
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-8">Video Scrubbing</h2>
          <div className="relative w-full max-w-4xl mx-auto">
            <video
              ref={videoRef}
              className="w-full rounded-2xl shadow-2xl"
              muted
              loop
              playsInline
            >
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            </video>
            <div className="mt-4 text-sm text-muted-foreground">
              Scroll to control video playback
            </div>
          </div>
        </div>
      </section>
      
      {/* Horizontal Scroll Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20" />
        
        <motion.div
          style={{ x: horizontalX }}
          className="flex gap-8 px-8"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center flex-shrink-0"
            >
              <span className="text-4xl font-bold">Slide {i}</span>
            </div>
          ))}
        </motion.div>
      </section>
      
      {/* Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500 z-50"
        style={{ 
          scaleX: useTransform(scrollY, [0, maxScroll], [0, 1]),
          transformOrigin: "left"
        }}
      />
      
      {/* Scroll Position Display */}
      <div className="fixed bottom-8 right-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg z-50">
        <div className="text-sm font-mono">
          <div>Scroll: {Math.round(scrollY.get())}px</div>
          <div>Max: {Math.round(maxScroll)}px</div>
          <div>Progress: {Math.round((scrollY.get() / maxScroll) * 100)}%</div>
        </div>
      </div>
      
    </div>
  )
}
