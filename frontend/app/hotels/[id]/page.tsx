'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '../../../lib/LanguageContext'
import { useTheme } from '../../../lib/ThemeContext'
import SafeImage from '../../../components/SafeImage'
import { ThemeToggle } from '../../../components/ui/theme-toggle'
import { cn } from '../../../lib/utils'
import { LocationIcon, StarIcon } from '../../../components/HotelIcons'
import RoomComments from '../../../components/RoomComments'
import { useToast } from '../../../lib/ToastContext'
import { ArrowRight, ChevronLeft, Star } from 'lucide-react'

export default function HotelDetailPage() {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  const [hotel, setHotel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [ratingHover, setRatingHover] = useState(0)
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    
    fetchHotel()
  }, [params.id])

  const fetchHotel = () => {
    if (params.id) {
      fetch(`http://localhost:4000/hotels/${params.id}`)
        .then(res => res.json())
        .then(data => setHotel(data))
        .finally(() => setLoading(false))
    }
  }

  const handleBook = (roomId: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast('Access denied. Authorization required.', 'error')
      router.push('/auth/login')
      return
    }
    router.push(`/checkout?roomId=${roomId}`)
  }

  const handleRate = async (stars: number) => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast('Authorization required to rate', 'error')
      return
    }

    setIsSubmittingRating(true)
    try {
      const res = await fetch(`http://localhost:4000/reviews/${hotel.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating: stars, comment: 'Rating via Sovereign Interface' })
      })

      if (res.ok) {
        toast('Sovereign Rating Synchronized', 'success')
        fetchHotel() // Refresh to see new average
      } else {
        toast('Rating failure', 'error')
      }
    } catch {
      toast('Network error', 'error')
    } finally {
      setIsSubmittingRating(false)
    }
  }

  if (!mounted || loading || !hotel) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-[2px] bg-gold/20 relative overflow-hidden">
           <div className="absolute inset-0 bg-gold animate-progress-fast shadow-[0_0_10px_#d4af37]" />
        </div>
      </div>
    )
  }

  const primaryRoom = hotel.rooms?.[0]

  return (
    <main className="min-h-screen bg-background text-foreground font-sans relative transition-colors duration-500 overflow-hidden">
      
      {/* ── Refined Compact Nav ── */}
      <nav className="fixed top-0 w-full z-[100] h-16 px-6 md:px-12 flex items-center justify-between bg-background/20 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-6">
           <Link href="/hotels" className="text-foreground/40 hover:text-gold transition-all">
              <ChevronLeft size={20} />
           </Link>
           <Link href="/" className="text-lg font-bold tracking-tighter text-foreground uppercase">
              MCTJK
           </Link>
        </div>
        <div className="flex items-center gap-8">
           <ThemeToggle />
           <Link href="/chat" className="text-[9px] font-bold uppercase tracking-[0.3em] text-foreground/40 hover:text-gold transition-all">Concierge</Link>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] pt-16">
        
        {/* LEFT: Balanced Visual Frame */}
        <div className="lg:w-1/2 lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 p-6 md:p-12 lg:p-16 flex items-center justify-center">
           <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-border group bg-muted"
           >
              <SafeImage src={hotel.images?.[0]} fill className="object-cover group-hover:scale-105 transition-transform duration-[5s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              <div className="absolute bottom-8 left-8">
                 <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold uppercase tracking-[0.4em] rounded-sm">
                    {hotel.city}
                 </div>
              </div>
           </motion.div>
        </div>

        {/* RIGHT: Elegant Scrolling Details */}
        <div className="lg:w-1/2 p-6 md:p-12 lg:p-16 space-y-20 flex flex-col justify-center">
           
           <header className="space-y-8">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3 text-gold text-[10px] font-bold uppercase tracking-[0.6em]">
                    <span className="w-8 h-px bg-gold/30" />
                    Archive Collection
                 </div>
                 
                 {/* INTERACTIVE STARS */}
                 <div className="flex items-center gap-1 bg-gold/5 px-3 py-1.5 rounded-full border border-gold/10">
                    {[1,2,3,4,5].map(star => (
                       <button
                          key={star}
                          onMouseEnter={() => setRatingHover(star)}
                          onMouseLeave={() => setRatingHover(0)}
                          onClick={() => handleRate(star)}
                          disabled={isSubmittingRating}
                          className="transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
                       >
                          <Star 
                             size={12} 
                             className={cn(
                                "transition-colors",
                                (ratingHover || Math.round(hotel.rating || 5)) >= star 
                                   ? "fill-gold text-gold" 
                                   : "text-gold/20"
                             )}
                          />
                       </button>
                    ))}
                    <span className="text-[10px] font-black text-gold ml-2 tracking-tighter">{Number(hotel.rating || 5.0).toFixed(1)}</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <h1 className="text-5xl md:text-7xl font-editorial font-medium leading-[1.1] text-foreground tracking-tighter uppercase italic">
                    {hotel.title}
                 </h1>
                 <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
                    <LocationIcon width={14} height={14} className="text-gold" />
                    {hotel.address}
                 </p>
              </div>
           </header>

           <section className="space-y-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground/30">The Context</h3>
              <p className="text-xl md:text-2xl font-editorial font-light leading-relaxed text-foreground/70 tracking-tight italic border-l border-gold/20 pl-8">
                 {hotel.description}
              </p>
           </section>

           <section className="space-y-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground/30">Allocation</h3>
              {primaryRoom ? (
                 <div className="p-10 bg-card border border-border rounded-[2.5rem] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-10 hover:border-gold/30 transition-all group">
                    <div className="space-y-2">
                       <h4 className="text-3xl font-editorial font-medium italic text-foreground tracking-tight">{primaryRoom.title}</h4>
                       <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Sovereign Protocol // Elite</div>
                    </div>
                    <div className="flex flex-col md:items-end gap-4 min-w-[200px]">
                       <div className="text-right">
                          <div className="text-3xl font-bold tracking-tighter text-foreground">${primaryRoom.price}</div>
                          <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">/ Rotation</div>
                       </div>
                       <button 
                          onClick={() => handleBook(primaryRoom.id)}
                          className="w-full h-14 bg-foreground text-background hover:bg-gold hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3"
                       >
                          Reserve
                          <ArrowRight size={14} />
                       </button>
                    </div>
                 </div>
              ) : (
                 <div className="p-12 border border-dashed border-border rounded-[2.5rem] text-center italic text-muted-foreground text-[10px] uppercase tracking-widest">
                    Buffer Locked
                 </div>
              )}
           </section>

           <div className="pt-20 border-t border-border">
              {/* IMPORTANT: Pass primaryRoom.id for correct 200 response on backend */}
              <RoomComments roomId={primaryRoom?.id || hotel.id} />
           </div>

           <footer className="py-24 border-t border-border bg-card/30 backdrop-blur-md text-center relative mt-20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <button 
                   onClick={() => {
                      const duration = 2500;
                      const start = window.scrollY;
                      const startTime = performance.now();
                      const animate = (time: number) => {
                        const elapsed = time - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const ease = 1 - Math.pow(1 - progress, 4); // Quartic ease out
                        window.scrollTo(0, start * (1 - ease));
                        if (progress < 1) requestAnimationFrame(animate);
                      };
                      requestAnimationFrame(animate);
                    }}
                   className="group flex flex-col items-center gap-4 transition-all duration-700 hover:-translate-y-2"
                 >
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-gold to-gold/20" />
                    <div className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center bg-background group-hover:border-gold group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    </div>
                    <span className="text-[6px] font-black uppercase tracking-[0.5em] text-gold opacity-40 group-hover:opacity-100 transition-opacity">Sovereign Ascent</span>
                 </button>
              </div>
              
              <div className="space-y-8 pt-8">
                 <span className="text-xl font-bold tracking-tighter text-foreground uppercase">MCTJK</span>
                 <div className="text-[7px] opacity-20 uppercase tracking-[0.4em]">Neural Luxury Protocol // Elite Archive</div>
              </div>
           </footer>
        </div>
      </div>
    </main>
  )
}
