'use client'

import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react'
import { useMotionValue, motion, MotionValue } from 'framer-motion'

// ─── Context ───
interface ScrollEngine {
  scrollY: MotionValue<number>       // absolute px scrolled (positive going down)
  progress: MotionValue<number>      // 0 → 1 over total height
  maxScroll: React.MutableRefObject<number>
}

const Ctx = createContext<ScrollEngine | null>(null)
export const useSmoothScroll = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useSmoothScroll: wrap tree in <SmoothScroll>')
  return c
}

// ─── Component ───
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const scrollY   = useMotionValue(0)
  const progress   = useMotionValue(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const target     = useRef(0)
  const current    = useRef(0)
  const maxScroll  = useRef(0)
  const rafId      = useRef(0)

  // Measure content
  const measure = useCallback(() => {
    if (!contentRef.current) return
    maxScroll.current = contentRef.current.scrollHeight - window.innerHeight
  }, [])

  useEffect(() => {
    // Lock native scroll
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.height = '100%'
    document.body.style.top = '0'
    document.body.style.left = '0'
    document.documentElement.style.overflow = 'hidden'

    measure()
    window.addEventListener('resize', measure)

    // ── Wheel ──
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      target.current = Math.max(0, Math.min(target.current + e.deltaY, maxScroll.current))
    }

    // ── Touch ──
    let touchY = 0
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault()
      const delta = touchY - e.touches[0].clientY
      touchY = e.touches[0].clientY
      target.current = Math.max(0, Math.min(target.current + delta, maxScroll.current))
    }

    // ── Keyboard ──
    const onKeyDown = (e: KeyboardEvent) => {
      const step = 120
      if (e.key === 'ArrowDown' || e.key === ' ') { target.current = Math.min(target.current + step, maxScroll.current); e.preventDefault() }
      if (e.key === 'ArrowUp')                     { target.current = Math.max(target.current - step, 0); e.preventDefault() }
      if (e.key === 'Home')                         { target.current = 0 }
      if (e.key === 'End')                          { target.current = maxScroll.current }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: false })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    // ── RAF Loop ──
    const tick = () => {
      // Lerp: buttery 0.08 factor
      current.current += (target.current - current.current) * 0.08
      // Snap when close enough (avoid sub-pixel jitter)
      if (Math.abs(target.current - current.current) < 0.5) current.current = target.current

      scrollY.set(current.current)
      progress.set(maxScroll.current > 0 ? current.current / maxScroll.current : 0)

      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.documentElement.style.overflow = ''
      window.removeEventListener('resize', measure)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
      cancelAnimationFrame(rafId.current)
    }
  }, [scrollY, progress, measure])

  // Re-measure after children render (fonts / images)
  useEffect(() => {
    const id = setTimeout(measure, 500)
    return () => clearTimeout(id)
  }, [measure])

  // Negative translateY to simulate scroll
  const translateY = useMotionValue(0)
  useEffect(() => {
    return scrollY.on('change', (v) => translateY.set(-v))
  }, [scrollY, translateY])

  return (
    <Ctx.Provider value={{ scrollY, progress, maxScroll }}>
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        <motion.div
          ref={contentRef}
          style={{ y: translateY }}
          className="will-change-transform"
        >
          {children}
        </motion.div>
      </div>
    </Ctx.Provider>
  )
}
