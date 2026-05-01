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
import { LocationIcon, StarIcon, WifiIcon, SpaIcon, PoolIcon, GymIcon, ConciergeIcon } from '../../components/HotelIcons'
import { useToast } from '../../lib/ToastContext'

export default function HotelsPage() {
  const { t, lang, setLang } = useLanguage()
  const { isDark } = useTheme()
  const { toast } = useToast()
  const router = useRouter()
  const [hotels, setHotels] = useState<any[]>([])
  const [active, setActive] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    fetch('http://localhost:4000/hotels')
      .then(res => res.json())
      .then(data => setHotels(Array.isArray(data) ? data : []))
      .catch(() => setHotels([]))
      .finally(() => setLoading(false))
  }, [])

  const handleRate = async (rating: number) => {
    if (!active) return
    const token = localStorage.getItem('token')
    if (!token) {
      toast(t.nav.signin, 'error')
      return
    }

    try {
      const res = await fetch(`http://localhost:4000/reviews/${active.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, comment: 'Clean Feedback' })
      })
      if (res.ok) {
        setUserRating(rating)
        const hRes = await fetch(`http://localhost:4000/hotels/${active.id}`)
        if (hRes.ok) setActive(await hRes.json())
        toast('Rating submitted successfully', 'success')
      }
    } catch {
      toast('Failed to submit rating', 'error')
    }
  }

  const handleBook = (roomId: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast(t.nav.signin, 'error')
      return
    }
    router.push(`/checkout?roomId=${roomId}`)
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
          <div className="flex items-center gap-3 md:gap-6">
            <ThemeToggle />
            <Link href="/bookings" className="hidden sm:block text-[10px] font-bold uppercase tracking-widest hover:underline">{t.nav.profile}</Link>
            {user?.role === 'ADMIN' && (
              <Link href="/admin" className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-brand hover:underline">Admin</Link>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="sm:hidden p-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-[200] bg-background p-8 flex flex-col pt-32 sm:hidden">
             <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
             </button>
             <div className="flex flex-col gap-10">
                {['hotels', 'chat', 'bookings'].map((item) => (
                  <Link key={item} onClick={() => setIsMenuOpen(false)} href={`/${item}`} className="text-4xl font-black tracking-tighter">
                    {t.nav[item] || item}
                  </Link>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-24 md:pt-32 container-tech px-6 md:px-0">
        <header className="mb-10 md:mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 rounded-full border border-amber-200/50 dark:border-amber-700/50 mb-6">
             <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
             <span className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">Exclusive Collection</span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
             <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">{t.hotels.title}</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium max-w-3xl leading-relaxed">{t.hotels.desc}</p>
        </header>

        {loading ? (
          <div className="py-40 text-center flex flex-col items-center gap-4">
             <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {hotels.map((hotel, i) => (
              <motion.div key={hotel.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}>
                 <div onClick={() => router.push(`/hotels/${hotel.id}`)} className="relative overflow-hidden bg-gradient-to-br from-background to-muted border border-border rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group cursor-pointer">
                    {/* Luxury Badge */}
                    <div className="absolute top-4 left-4 z-10">
                       <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                          LUXURY
                       </div>
                    </div>
                    
                    {/* Availability Badge */}
                    <div className="absolute top-4 right-4 z-10">
                       <div className="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          Available
                       </div>
                    </div>
                    
                    <div className="relative aspect-video overflow-hidden">
                       <SafeImage src={hotel.images?.[0]} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    <div className="p-6 space-y-4">
                       <div className="flex justify-between items-start">
                          <div>
                             <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                   <StarIcon key={star} width={12} height={12} className="text-amber-500" />
                                ))}
                                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 ml-1">{Number(hotel.rating || 5).toFixed(1)}</span>
                             </div>
                             <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                                <LocationIcon width={10} height={10} />
                                {hotel.city}
                             </span>
                          </div>
                       </div>
                       
                       <h3 className="text-xl md:text-2xl font-black tracking-tighter group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-rose-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          {hotel.title}
                       </h3>
                       
                       {/* Hotel Amenities */}
                       <div className="flex flex-wrap gap-2">
                          {[
                             { name: 'WiFi', icon: WifiIcon },
                             { name: 'Spa', icon: SpaIcon },
                             { name: 'Pool', icon: PoolIcon },
                             { name: 'Gym', icon: GymIcon }
                          ].slice(0, 3).map((amenity) => (
                             <span key={amenity.name} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                                <amenity.icon width={8} height={8} />
                                {amenity.name}
                             </span>
                          ))}
                       </div>
                       
                       <div className="flex justify-between items-center pt-4 border-t border-border">
                          <div>
                             <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">From</div>
                             <div className="text-2xl font-black bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">${hotel.rooms?.[0]?.price || 450}</div>
                             <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">per night</div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
