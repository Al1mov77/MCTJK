'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, HelpCircle, ShieldCheck } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function VipAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVip, setIsVip] = useState(false)
  const [message, setMessage] = useState('Welcome back. How may we assist your journey today?')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const user = JSON.parse(stored)
      if (user.isVip || user.role === 'ADMIN') setIsVip(true)
    }
  }, [])

  if (!isVip) return null

  const tips = [
    "You currently enjoy a 30% privilege rate on all bookings.",
    "Your dedicated support line is active 24/7.",
    "New seasonal retreats have been added to the Collection.",
    "Your loyalty points are available for suite upgrades.",
    "As an Elite member, your requests are always prioritized."
  ]

  const getRandomTip = () => {
    const tip = tips[Math.floor(Math.random() * tips.length)]
    setMessage(tip)
  }

  return (
    <div className="fixed bottom-12 right-12 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-24 right-0 w-80 bg-background border border-border rounded-lg p-8 shadow-2xl backdrop-blur-xl"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-foreground/40 hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-semibold text-foreground uppercase tracking-[0.2em]">Concierge</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                  <span className="text-[8px] font-semibold text-accent uppercase tracking-widest">Elite Status</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-foreground/60 leading-relaxed mb-8 font-normal">
              {message}
            </p>

            <button 
              onClick={getRandomTip}
              className="w-full py-4 border border-border rounded-md text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground hover:bg-surface transition-all flex items-center justify-center gap-3"
            >
              <HelpCircle className="w-3.5 h-3.5 opacity-40" /> Request Insight
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-foreground text-background rounded-full flex items-center justify-center shadow-2xl relative group transition-all hover:bg-foreground/90"
      >
        <MessageCircle className="w-7 h-7" />
        <div className="absolute -top-1 -right-1 bg-accent text-background px-2 py-0.5 rounded-full text-[8px] font-semibold tracking-tighter">
          VIP
        </div>
      </motion.button>
    </div>
  )
}
