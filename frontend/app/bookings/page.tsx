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
    <main className="min-h-screen bg-background transition-colors duration-300 pb-20 font-sans overflow-x-hidden">
      
      {/* ── Luxury Navigation ── */}
      <nav className="fixed top-0 w-full z-[150] bg-background/90 backdrop-blur-lg border-b border-amber-200/20 dark:border-amber-800/20 shadow-lg h-14 md:h-16 flex items-center px-4 md:px-0">
        <div className="container-tech w-full flex justify-between items-center">
          <Link href="/" className="text-lg md:text-xl font-black tracking-tighter flex items-center gap-2 group">
             <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-amber-500 to-rose-500 rounded-sm transition-transform group-hover:scale-110" />
             <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">MCTJK</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button onClick={logout} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:opacity-80">
               {lang === 'ru' ? 'Выход' : (lang === 'tj' ? 'Хуруҷ' : 'Logout')}
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-24 md:pt-40 container-tech px-6 md:px-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-12 md:mb-20">
          <div className="space-y-4">
             <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 rounded-full border border-amber-200/50 dark:border-amber-700/50">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">{t.nav.profile}</span>
             </motion.div>
             <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                   {lang === 'ru' ? 'Ваши' : (lang === 'tj' ? 'Бронкунии' : 'Your')}
                </span> <br className="md:hidden" />
                <span className="text-muted-foreground">{t.nav.bookings}</span>
             </h1>
          </div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full md:w-auto p-6 bg-gradient-to-br from-muted to-background rounded-2xl flex items-center gap-6 border border-amber-200/20 dark:border-amber-800/20 shadow-lg">
             <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-rose-500 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg">
                {user?.name?.[0] || 'U'}
             </div>
             <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black tracking-tighter">{user?.name || 'Guest'}</h3>
                  {user?.isVip && (
                     <div className="px-2 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        VIP
                     </div>
                  )}
                </div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                  {user?.isVip ? 'Elite Member' : 'Member'} · {user?.points || 0} Pts
                </p>
             </div>
          </motion.div>
        </header>

        {loading ? (
          <div className="py-40 text-center flex flex-col items-center gap-4">
             <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 md:gap-10">
            {bookings.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-20 md:py-40 text-center bg-gradient-to-br from-muted/50 to-background rounded-3xl border border-dashed border-amber-200/30 dark:border-amber-800/30 space-y-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600 dark:text-amber-400">
                      <path d="M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path d="M3 9V7a2 2 0 012-2h14a2 2 0 012 2v2"/>
                      <path d="M8 9V4a2 2 0 012-2h4a2 2 0 012 2v5"/>
                   </svg>
                </div>
                <h3 className="text-2xl font-black tracking-tighter">{lang === 'ru' ? 'Нет бронирований' : 'No Luxury Journeys Found'}</h3>
                <p className="text-muted-foreground font-medium max-w-md mx-auto">Begin your journey into extraordinary hospitality with our exclusive collection</p>
                <Link href="/hotels" className="apple-btn px-10 h-12 inline-flex bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white border-0 shadow-lg">Explore Luxury Hotels</Link>
              </motion.div>
            ) : (
              bookings.map((b, i) => (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={b.id}>
                  <div className="relative overflow-hidden bg-gradient-to-br from-background to-muted border border-border rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col lg:flex-row items-stretch gap-6 md:gap-10 p-6 md:p-10">
                    {/* Luxury Badge */}
                    <div className="absolute top-6 left-6 z-10">
                       <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                          CONFIRMED
                       </div>
                    </div>
                    
                    <div className="relative w-full lg:w-[350px] h-[220px] rounded-xl overflow-hidden shrink-0 shadow-lg">
                      <SafeImage src={b.room?.hotel?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} fill className="object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-2">{b.room?.hotel?.title}</h2>
                            <div className="flex items-center gap-3">
                               <span className={cn(
                                 "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                                 b.status === 'CONFIRMED' ? 'border-green-500/20 bg-green-500/5 text-green-500' : 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500'
                               )}>
                                 {b.status}
                               </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-border">
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Check-in</p>
                            <p className="text-sm font-bold">{new Date(b.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Check-out</p>
                            <p className="text-sm font-bold">{new Date(b.endDate).toLocaleDateString()}</p>
                          </div>
                          <div className="hidden md:block">
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Nightly</p>
                            <p className="text-sm font-bold">${b.room?.price}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-8 md:pt-10">
                        <Link href="/chat" className="apple-btn h-10 px-8 text-[10px] w-full sm:w-auto bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white border-0 shadow-lg">Chat with concierge</Link>
                        <button className="h-10 px-8 text-[10px] font-black uppercase tracking-widest border border-amber-200/30 dark:border-amber-800/30 rounded-full hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all">View Details</button>
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
