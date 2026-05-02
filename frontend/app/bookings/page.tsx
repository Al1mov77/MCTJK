'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../lib/LanguageContext'
import { useTheme } from '../../lib/ThemeContext'
import SafeImage from '../../components/SafeImage'
import { ThemeToggle } from '../../components/ui/theme-toggle'
import { cn } from '../../lib/utils'
import { LocationIcon, StarIcon, WifiIcon, SpaIcon, PoolIcon, GymIcon } from '../../components/HotelIcons'

export default function BookingsPage() {
  const { t, lang } = useLanguage()
  const { isDark } = useTheme()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!stored || !token) {
      router.push('/auth/login')
      return
    }

    const u = JSON.parse(stored)
    setUser(u)
    loadBookings(token)
  }, [])

  const loadBookings = async (token: string) => {
    try {
      const res = await fetch('http://localhost:4000/booking/my', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setBookings(Array.isArray(data) ? data : [])
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-matte-charcoal transition-colors duration-300 pb-20 font-sans overflow-x-hidden">
      
      {/* ── Luxury Navigation ── */}
      <nav className="fixed top-0 w-full z-[150] bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#d4af37]/10 shadow-2xl h-14 md:h-16 flex items-center px-4 md:px-0">
        <div className="container-tech w-full flex justify-between items-center">
          <Link href="/" className="text-lg md:text-xl font-black tracking-tighter flex items-center gap-2 group">
             <div className="w-5 h-5 md:w-6 md:h-6 bg-[#d4af37] rounded-sm transition-transform group-hover:scale-110 shadow-[0_0_10px_rgba(212,175,55,0.3)]" />
             <span className="text-[#d4af37]">MCTJK</span>
          </Link>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <button onClick={logout} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]/60 hover:text-[#d4af37] transition-colors">
               {lang === 'ru' ? 'Terminate' : (lang === 'tj' ? 'Хуруҷ' : 'Logout')}
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-24 md:pt-40 container-tech px-6 md:px-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16 md:mb-24 halo-gold">
          <div className="space-y-6">
             <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-[#d4af37]/20 rounded-full">
                <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">{t.nav.profile}</span>
             </motion.div>
             <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-cream">
                <span className="text-[#d4af37]">
                   {lang === 'ru' ? 'Your' : (lang === 'tj' ? 'Бронкунии' : 'Your')}
                </span> <br className="md:hidden" />
                <span className="opacity-50"> {t.nav.bookings}</span>
             </h1>
          </div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full md:w-auto p-8 glass-premium rounded-2xl flex items-center gap-8 shadow-2xl">
             <div className="w-16 h-16 bg-[#d4af37] rounded-xl flex items-center justify-center text-matte-charcoal text-2xl font-black shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                {user?.name?.[0] || 'U'}
             </div>
             <div>
                <div className="flex items-center gap-4">
                   <h3 className="text-2xl font-bold tracking-tighter text-cream">{user?.name || 'Sovereign'}</h3>
                   {user?.isVip && (
                      <div className="px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[8px] font-bold uppercase tracking-[0.2em] rounded-full flex items-center gap-2">
                         <span className="w-1 h-1 bg-[#d4af37] rounded-full animate-pulse" />
                         ELITE
                      </div>
                   )}
                </div>
                <p className="text-[10px] font-bold text-[#d4af37]/40 uppercase tracking-[0.3em] mt-2">
                  {user?.isVip ? 'Elite Access Status' : 'Standard Access'} · {user?.points || 0} LUXE PTS
                </p>
             </div>
          </motion.div>
        </header>

        {loading ? (
          <div className="py-40 text-center flex flex-col items-center gap-4">
             <div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid gap-10 md:gap-14">
            {bookings.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-24 md:py-40 text-center glass-premium rounded-3xl border border-dashed border-[#d4af37]/10 space-y-10 halo-gold">
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#d4af37]/5 border border-[#d4af37]/10 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" className="opacity-50">
                      <path d="M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path d="M3 9V7a2 2 0 012-2h14a2 2 0 012 2v2"/>
                      <path d="M8 9V4a2 2 0 012-2h4a2 2 0 012 2v5"/>
                   </svg>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold tracking-tighter text-cream">{lang === 'ru' ? 'Empty Portfolio' : 'No Portfolio Entries'}</h3>
                  <p className="text-white/30 text-sm font-medium max-w-md mx-auto leading-relaxed">Begin your journey into extraordinary hospitality with our curated sovereign collection.</p>
                </div>
                <Link href="/hotels" className="btn-sand px-12 py-4 inline-flex rounded-lg shadow-2xl uppercase tracking-[0.3em] text-[10px] font-bold">Initialize Discovery</Link>
              </motion.div>
            ) : (
              bookings.map((b, i) => (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.8 }} key={b.id} className="halo-gold">
                  <div className="relative overflow-hidden glass-premium rounded-2xl transition-all duration-700 flex flex-col lg:flex-row items-stretch gap-10 p-8 md:p-12 group shadow-2xl hover:-translate-y-2">
                    {/* Status Badge */}
                    <div className="absolute top-8 left-8 z-10">
                       <div className={cn(
                          "px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.3em] rounded-sm backdrop-blur-md border shadow-2xl",
                          b.status === 'CONFIRMED' ? 'bg-white/5 border-[#d4af37]/30 text-[#d4af37]' : 'bg-white/5 border-white/20 text-cream/50'
                       )}>
                          {b.status}
                       </div>
                    </div>
                    
                    <div className="relative w-full lg:w-[400px] h-[260px] rounded-xl overflow-hidden shrink-0 shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                      <SafeImage src={b.room?.hotel?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-matte-charcoal via-transparent to-transparent opacity-60" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-cream mb-4 group-hover:text-[#d4af37] transition-colors duration-500">{b.room?.hotel?.title}</h2>
                          <div className="flex items-center gap-3 opacity-40">
                             <LocationIcon width={12} height={12} className="text-[#d4af37]" />
                             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream">{b.room?.hotel?.city}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 pt-8 border-t border-white/5">
                          <div className="space-y-2">
                            <p className="text-[9px] font-bold text-[#d4af37]/30 uppercase tracking-[0.3em]">Check-in</p>
                            <p className="text-base font-light text-cream tracking-tight">{new Date(b.startDate).toLocaleDateString(lang, { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[9px] font-bold text-[#d4af37]/30 uppercase tracking-[0.3em]">Check-out</p>
                            <p className="text-base font-light text-cream tracking-tight">{new Date(b.endDate).toLocaleDateString(lang, { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                          </div>
                          <div className="hidden md:block space-y-2">
                            <p className="text-[9px] font-bold text-[#d4af37]/30 uppercase tracking-[0.3em]">Rate</p>
                            <p className="text-xl font-bold text-[#d4af37] tracking-tight">${b.room?.price}<span className="text-[10px] opacity-30 font-medium ml-1">/ NIGHT</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6 pt-12">
                        <Link href="/chat" className="btn-sand h-12 px-10 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm flex items-center justify-center shadow-2xl">Concierge</Link>
                        <button className="h-12 px-10 text-[10px] font-bold uppercase tracking-[0.3em] border border-[#d4af37]/20 text-[#d4af37]/60 rounded-sm hover:border-[#d4af37] hover:text-[#d4af37] transition-all">Sovereign Data</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  )
}
