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

export default function HotelsPage() {
  const { t, lang, setLang } = useLanguage()
  const { isDark } = useTheme()
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
    if (!token) return

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
      }
    } catch {}
  }

  const handleBook = (roomId: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert(t.nav.signin)
      return
    }
    // Перенаправляем на страницу оплаты
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
                 <div onClick={() => { setActive(hotel); setOpen(true); }} className="relative overflow-hidden bg-gradient-to-br from-background to-muted border border-border rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group cursor-pointer">
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

      {/* ── Responsive Modal ── */}
      <AnimatePresence>
        {open && active && (
          <div className="fixed inset-0 z-[500] flex items-end md:items-center justify-center p-0 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="absolute inset-0 bg-background/60 backdrop-blur-md" />
            
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="relative bg-gradient-to-br from-background to-muted border-t md:border border-amber-200/20 dark:border-amber-800/20 w-full max-w-5xl h-[92vh] md:h-[85vh] overflow-hidden rounded-t-[32px] md:rounded-2xl shadow-2xl flex flex-col md:flex-row">
              <div className="md:w-1/2 h-[25vh] sm:h-[35vh] md:h-auto relative bg-muted shrink-0">
                <SafeImage src={active.images?.[0]} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Luxury Badge */}
                <div className="absolute top-6 left-6 z-10">
                   <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      LUXURY COLLECTION
                   </div>
                </div>
                
                <button onClick={() => setOpen(false)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-background/80 backdrop-blur-lg border border-white/20 text-foreground flex items-center justify-center hover:bg-background hover:scale-110 transition-all shadow-lg">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 custom-scrollbar pb-32 md:pb-12">
                <div className="flex justify-between items-start">
                   <div className="space-y-4">
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 rounded-full border border-amber-200/50 dark:border-amber-700/50">
                         <LocationIcon width={12} height={12} className="text-amber-600 dark:text-amber-400" />
                         <span className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">Premium Location</span>
                      </motion.div>
                      <h2 className="text-2xl md:text-4xl font-black tracking-tighter">
                         <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">{active.title}</span>
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                         <LocationIcon width={14} height={14} className="text-amber-500" />
                         {active.address}, {active.city}
                      </div>
                   </div>
                </div>

                <div className="space-y-10">
                   <div className="space-y-6">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                         <div className="w-2 h-2 bg-amber-500 rounded-full" />
                         About This Luxury Property
                      </h4>
                      <p className="text-sm md:text-base text-foreground font-medium leading-relaxed bg-gradient-to-r from-amber-50/30 to-rose-50/30 dark:from-amber-950/10 dark:to-rose-950/10 p-6 rounded-xl border border-amber-200/20 dark:border-amber-800/20">{active.description}</p>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="p-6 bg-gradient-to-br from-amber-50/50 to-rose-50/50 dark:from-amber-950/20 dark:to-rose-950/20 rounded-xl space-y-4 border border-amber-200/30 dark:border-amber-800/30">
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <StarIcon width={12} height={12} className="text-amber-500" />
                            {t.hotels.reviews}
                         </h4>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                               {[1, 2, 3, 4, 5].map((s) => (
                                 <motion.button 
                                    key={s} 
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleRate(s)}
                                    className="transition-all"
                                 >
                                    <StarIcon 
                                       width={18} 
                                       height={18} 
                                       className={cn(
                                          "transition-colors", 
                                          s <= (userRating || active.rating) ? "text-amber-500" : "text-muted-foreground/30"
                                       )}
                                    />
                                 </motion.button>
                               ))}
                            </div>
                            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">{Number(active.rating || 5.0).toFixed(1)}</span>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full" />
                            {t.hotels.suites}
                         </h4>
                         <div className="space-y-3">
                            {/* Показываем только 1 номер если это запрошено или просто список */}
                            {active.rooms?.slice(0, 1).map((room: any, i: number) => (
                              <motion.div 
                                 key={room.id} 
                                 initial={{ opacity: 0, x: -20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: i * 0.1 }}
                                 className="p-4 border border-amber-200/30 dark:border-amber-800/30 rounded-xl bg-gradient-to-br from-background to-amber-50/20 dark:to-amber-950/20 flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300"
                              >
                                 <div>
                                    <h5 className="font-bold text-xs mb-1">{room.title}</h5>
                                    <div className="flex items-center gap-2">
                                       <span className="text-2xl font-black bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">${room.price}</span>
                                       <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">/ Night</span>
                                    </div>
                                 </div>
                                 <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleBook(room.id)} 
                                    className="h-10 px-5 text-[10px] font-black uppercase tracking-widest rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white border-0 shadow-lg shadow-amber-500/25"
                                 >
                                    Reserve
                                 </motion.button>
                              </motion.div>
                            ))}
                            {active.rooms?.length > 1 && (
                               <motion.p 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.3 }}
                                  className="text-[8px] text-amber-600 dark:text-amber-400 uppercase font-black tracking-widest text-center mt-2 flex items-center justify-center gap-2"
                               >
                                  <ConciergeIcon width={12} height={12} />
                                  More luxury suites available in concierge
                               </motion.p>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
