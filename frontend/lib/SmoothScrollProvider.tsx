'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { motionValue, useMotionValue, MotionValue } from 'framer-motion'

interface SmoothScrollContextType {
  scrollY: MotionValue<number>
  targetScroll: number
  currentScroll: number
  maxScroll: number
  isScrolling: boolean
}

const SmoothScrollContext = createContext<SmoothScrollContextType | undefined>(undefined)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollY = useMotionValue(0)
  const [targetScroll, setTargetScroll] = useState(0)
  const [currentScroll, setCurrentScroll] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const touchStartY = useRef(0)
  const lastTouchY = useRef(0)
  const velocityRef = useRef(0)
  const isTouchingRef = useRef(false)
  
  // Calculate max scroll
  const calculateMaxScroll = () => {
    if (!wrapperRef.current || !contentRef.current) return 0
    return Math.max(0, contentRef.current.offsetHeight - wrapperRef.current.offsetHeight)
  }
  
  // Lerp function for smooth animation
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }
  
  // Animation loop
  const animate = () => {
    setCurrentScroll(prev => {
      const newScroll = lerp(prev, targetScroll, 0.08)
      
      // Update motion value for Framer Motion
      scrollY.set(newScroll)
      
      // Update content transform
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(-${newScroll}px)`
        contentRef.current.style.willChange = 'transform'
      }
      
      // Check if still scrolling
      const diff = Math.abs(targetScroll - newScroll)
      if (diff > 0.01) {
        setIsScrolling(true)
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setIsScrolling(false)
      }
      
      return newScroll
    })
  }
  
  // Handle wheel event
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    
    if (isTouchingRef.current) return
    
    const delta = e.deltaY
    const multiplier = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? 800 : 1
    const normalizedDelta = delta * multiplier
    
    setTargetScroll(prev => {
      const newScroll = prev + normalizedDelta
      return Math.max(0, Math.min(newScroll, maxScroll))
    })
    
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }
  
  // Handle touch events
  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
    lastTouchY.current = e.touches[0].clientY
    velocityRef.current = 0
    isTouchingRef.current = true
  }
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!isTouchingRef.current) return
    
    const touchY = e.touches[0].clientY
    const deltaY = lastTouchY.current - touchY
    velocityRef.current = deltaY
    
    setTargetScroll(prev => {
      const newScroll = prev + deltaY
      return Math.max(0, Math.min(newScroll, maxScroll))
    })
    
    lastTouchY.current = touchY
    
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }
  
  const handleTouchEnd = () => {
    isTouchingRef.current = false
    
    // Add momentum based on velocity
    if (Math.abs(velocityRef.current) > 1) {
      const momentum = velocityRef.current * 10
      setTargetScroll(prev => {
        const newScroll = prev + momentum
        return Math.max(0, Math.min(newScroll, maxScroll))
      })
    }
  }
  
  // Handle resize
  const handleResize = () => {
    const newMaxScroll = calculateMaxScroll()
    setMaxScroll(newMaxScroll)
    
    // Adjust current scroll if needed
    setCurrentScroll(prev => Math.min(prev, newMaxScroll))
    setTargetScroll(prev => Math.min(prev, newMaxScroll))
  }
  
  // Handle content resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const newMaxScroll = calculateMaxScroll()
      setMaxScroll(newMaxScroll)
    })
    
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }
    
    return () => {
      resizeObserver.disconnect()
    }
  }, [])
  
  // Initialize
  useEffect(() => {
    const wrapper = wrapperRef.current
    const content = contentRef.current
    
    if (!wrapper || !content) return
    
    // Disable native scroll
    document.body.style.overflow = 'hidden'
    
    // Calculate initial max scroll
    const initialMaxScroll = calculateMaxScroll()
    setMaxScroll(initialMaxScroll)
    
    // Set initial scroll position
    scrollY.set(0)
    setCurrentScroll(0)
    setTargetScroll(0)
    
    // Add event listeners
    wrapper.addEventListener('wheel', handleWheel, { passive: false })
    wrapper.addEventListener('touchstart', handleTouchStart, { passive: false })
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false })
    wrapper.addEventListener('touchend', handleTouchEnd, { passive: false })
    window.addEventListener('resize', handleResize)
    
    // Start animation loop
    rafRef.current = requestAnimationFrame(animate)
    
    return () => {
      document.body.style.overflow = ''
      wrapper.removeEventListener('wheel', handleWheel)
      wrapper.removeEventListener('touchstart', handleTouchStart)
      wrapper.removeEventListener('touchmove', handleTouchMove)
      wrapper.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('resize', handleResize)
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])
  
  return (
    <SmoothScrollContext.Provider value={{
      scrollY,
      targetScroll,
      currentScroll,
      maxScroll,
      isScrolling
    }}>
      <div ref={wrapperRef} className="fixed inset-0 overflow-hidden">
        <div ref={contentRef} className="will-change-transform">
          {children}
        </div>
      </div>
    </SmoothScrollContext.Provider>
  )
}

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext)
  if (!context) {
    throw new Error('useSmoothScroll must be used within SmoothScrollProvider')
  }
  return context
}
