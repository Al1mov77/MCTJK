'use client'

import { useState, useEffect } from 'react'
import { Crown, Zap, Gift, XCircle, RotateCw, CheckCircle2 } from 'lucide-react'
import gsap from 'gsap'
import { useLanguage } from '../lib/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function DailySpinner() {
  const { t } = useLanguage()
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [hasSpunToday, setHasSpunToday] = useState(false)

  const prizes = [
    { name: '10% DISCOUNT', icon: <Zap />, color: 'from-amber-400 to-amber-600', value: 10 },
    { name: 'VIP STATUS', icon: <Crown />, color: 'from-yellow-400 to-amber-500', value: 'VIP' },
    { name: '50% DISCOUNT', icon: <Gift />, color: 'from-rose-400 to-rose-600', value: 50 },
    { name: 'TRY AGAIN', icon: <XCircle />, color: 'from-zinc-400 to-zinc-600', value: 0 },
    { name: '20% DISCOUNT', icon: <Zap />, color: 'from-amber-500 to-rose-500', value: 20 },
    { name: 'FREE BREAKFAST', icon: <Gift />, color: 'from-emerald-400 to-emerald-600', value: 'FB' }
  ]

  useEffect(() => {
    const lastSpin = localStorage.getItem('last_spin_date')
    const today = new Date().toDateString()
    if (lastSpin === today) {
      setHasSpunToday(true)
    }
  }, [])

  const saveWin = (prize: any) => {
    const history = JSON.parse(localStorage.getItem('spinner_history') || '[]')
    const newWin = {
      prize: prize.name,
      value: prize.value,
      date: new Date().toLocaleString(),
      used: false
    }
    history.push(newWin)
    localStorage.setItem('spinner_history', JSON.stringify(history))
  }

  const spin = () => {
    if (isSpinning || hasSpunToday) return
    
    setIsSpinning(true)
    const randomIndex = Math.floor(Math.random() * prizes.length)
    const rotation = 360 * 5 + (randomIndex * (360 / prizes.length))

    gsap.to('.spinner-wheel', {
      rotation: rotation,
      duration: 4,
      ease: 'power4.out',
      onComplete: () => {
        setIsSpinning(false)
        setResult(prizes[randomIndex].name)
        setHasSpunToday(true)
        localStorage.setItem('last_spin_date', new Date().toDateString())
        saveWin(prizes[randomIndex])
      }
    })
  }

  return (
    <div className="relative w-full max-w-md mx-auto text-center space-y-12">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold tracking-tighter uppercase italic">{t.home.spinnerTitle || 'Sovereign Wheel'}</h2>
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">{t.home.spinnerSub || 'Test your neural luck once per day'}</p>
      </div>

      <div className="relative aspect-square max-w-[280px] md:max-w-none mx-auto">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-[10px] md:border-[16px] border-white/5 rounded-full blur-xl" />
        <div className="absolute inset-2 md:inset-4 border border-white/10 rounded-full" />
        
        {/* The Wheel */}
        <div className="spinner-wheel relative w-full h-full rounded-full border border-white/20 overflow-hidden shadow-2xl bg-black/40 backdrop-blur-xl">
           {prizes.map((p, i) => (
             <div 
               key={i} 
               className="absolute top-0 left-1/2 w-1/2 h-full origin-left flex items-center justify-center border-l border-white/5"
               style={{ transform: `rotate(${i * (360 / prizes.length)}deg)` }}
             >
                <div className="flex flex-col items-center gap-1 md:gap-2 -rotate-90 translate-x-8 md:translate-x-12">
                   <div className="text-sm md:text-xl text-amber-500">{p.icon}</div>
                   <span className="text-[5px] md:text-[6px] font-black uppercase tracking-widest whitespace-nowrap opacity-40">{p.name}</span>
                </div>
             </div>
           ))}
        </div>

        {/* Indicator */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-amber-500 animate-bounce">
           <div className="w-1 h-6 md:h-8 bg-amber-500 rounded-full shadow-[0_0_15px_amber]" />
        </div>

        {/* Center Button */}
        <button 
          onClick={spin}
          disabled={isSpinning || hasSpunToday}
          className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 rounded-full bg-white text-black z-30 font-black uppercase text-[8px] md:text-[10px] tracking-widest shadow-2xl active:scale-95 disabled:opacity-50 disabled:bg-white/10 disabled:text-white/40 transition-all border-2 md:border-4 border-black"
        >
          {isSpinning ? '...' : hasSpunToday ? 'Used' : 'Spin'}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/50 rounded-[2.5rem] backdrop-blur-3xl"
          >
             <div className="flex items-center justify-center gap-4 text-amber-500 mb-4">
                <CheckCircle2 size={32} />
                <h3 className="text-3xl font-bold uppercase tracking-tighter">Winner</h3>
             </div>
             <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-white/60 mb-6">
                You have received: <span className="text-white">{result}</span>
             </p>
             <div className="text-[8px] uppercase tracking-widest text-amber-500/40">Reward stored in your neural profile</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
