'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '../../../lib/LanguageContext'
import { useTheme } from '../../../lib/ThemeContext'
import SafeImage from '../../../components/SafeImage'
import { ThemeToggle } from '../../../components/ui/theme-toggle'
import { cn } from '../../../lib/utils'
import { LocationIcon, StarIcon, WifiIcon, SpaIcon, PoolIcon, GymIcon, ConciergeIcon } from '../../../components/HotelIcons'
import RoomComments from '../../../components/RoomComments'
import { useToast } from '../../../lib/ToastContext'

export default function HotelInfoPage() {
  const { id } = useParams()
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [hotel, setHotel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    
    fetch(`http://localhost:4000/hotels/${id}`)
      .then(res => res.json())
      .then(data => setHotel(data))
      .catch(() => setHotel(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleRate = async (rating: number) => {
    if (!hotel) return
    const token = localStorage.getItem('token')
    if (!token) {
      toast(t.nav.signin, 'error')
      return
    }

    try {
      const res = await fetch(`http://localhost:4000/reviews/${hotel.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, comment: 'Clean Feedback' })
      })
      if (res.ok) {
        setUserRating(rating)
        const hRes = await fetch(`http://localhost:4000/hotels/${hotel.id}`)
        if (hRes.ok) setHotel(await hRes.json())
        toast('Review submitted successfully', 'success')
      }
    } catch {
      toast('Failed to submit review', 'error')
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

  const isRoomBooked = (room: any) => {
    if (!room.bookings || room.bookings.length === 0) return false;
    const now = new Date();
    return room.bookings.some((b: any) => {
      return (b.status === 'APPROVED' || b.status === 'PENDING') && new Date(b.endDate) >= now;
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (!hotel) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-black tracking-tighter text-foreground">Hotel Not Found</h1>
        <button onClick={() => router.push('/hotels')} className="px-6 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold rounded-full">
          Back to Hotels
        </button>
      </main>
    )
  }

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
          </div>
        </div>
      </nav>

      <div className="pt-24 md:pt-32 container-tech px-6 md:px-0">
        
        {/* Back button */}
        <button 
          onClick={() => router.push('/hotels')} 
          className="mb-8 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          Back to Collection
        </button>

        <div className="bg-gradient-to-br from-background to-muted border border-amber-200/20 dark:border-amber-800/20 w-full overflow-hidden rounded-[32px] shadow-2xl flex flex-col md:flex-row">
          
          <div className="md:w-1/2 h-[40vh] md:h-auto relative bg-muted shrink-0">
            <SafeImage src={hotel.images?.[0]} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Luxury Badge */}
            <div className="absolute top-6 left-6 z-10">
               <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  LUXURY COLLECTION
               </div>
            </div>
          </div>

          <div className="flex-1 p-6 md:p-12 space-y-10 custom-scrollbar">
            <div className="flex justify-between items-start">
               <div className="space-y-4">
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 rounded-full border border-amber-200/50 dark:border-amber-700/50">
                     <LocationIcon width={12} height={12} className="text-amber-600 dark:text-amber-400" />
                     <span className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">Premium Location</span>
                  </motion.div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
                     <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">{hotel.title}</span>
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                     <LocationIcon width={14} height={14} className="text-amber-500" />
                     {hotel.address}, {hotel.city}
                  </div>
               </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  About This Luxury Property
                </h4>
                <p className="text-sm md:text-base text-foreground font-medium leading-relaxed bg-gradient-to-r from-amber-50/30 to-rose-50/30 dark:from-amber-950/10 dark:to-rose-950/10 p-6 rounded-xl border border-amber-200/20 dark:border-amber-800/20">{hotel.description}</p>
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
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRate(s)}
                              className="transition-all"
                           >
                              <StarIcon 
                                 width={18} 
                                 height={18} 
                                 className={cn(
                                    "transition-colors", 
                                    s <= (userRating || hotel.rating) ? "text-amber-500" : "text-muted-foreground/30"
                                 )}
                              />
                           </motion.button>
                         ))}
                      </div>
                      <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">{Number(hotel.rating || 5.0).toFixed(1)}</span>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      {t.hotels.suites}
                   </h4>
                   <div className="space-y-3">
                      {hotel.rooms?.slice(0, 1).map((room: any, i: number) => {
                        const booked = isRoomBooked(room);

                        return (
                        <motion.div 
                           key={room.id} 
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.1 }}
                           className={cn(
                             "p-4 border rounded-xl flex justify-between items-center shadow-sm transition-all duration-300",
                             booked 
                              ? "bg-muted/50 border-border opacity-70 grayscale-[30%]" 
                              : "bg-gradient-to-br from-background to-amber-50/20 dark:to-amber-950/20 border-amber-200/30 dark:border-amber-800/30 hover:shadow-md"
                           )}
                        >
                           <div>
                              <h5 className="font-bold text-sm mb-1">{room.title}</h5>
                              <div className="flex items-center gap-2">
                                 <span className={cn("text-2xl font-black", booked ? "text-muted-foreground" : "bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent")}>${room.price}</span>
                                 <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">/ Night</span>
                              </div>
                           </div>
                           
                           {booked ? (
                             <div className="px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 shadow-inner flex items-center gap-2">
                               <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                               Unavailable
                             </div>
                           ) : (
                             <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleBook(room.id)} 
                                className="h-10 px-5 text-[10px] font-black uppercase tracking-widest rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white border-0 shadow-lg shadow-amber-500/25 flex items-center gap-2"
                             >
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                Available
                             </motion.button>
                           )}
                        </motion.div>
                      )})}
                   </div>
                </div>
              </div>

              {hotel.rooms?.[0] && (
                <div className="mt-4 pt-8 border-t border-amber-200/20 dark:border-amber-800/20">
                   <RoomComments roomId={hotel.rooms[0].id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
