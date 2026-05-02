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
import { LocationIcon, StarIcon } from '../../components/HotelIcons'
import { ArrowRight } from 'lucide-react'
import { useToast } from '../../lib/ToastContext'

export default function HotelsPage() {
  const { t, lang } = useLanguage()
  const { isDark } = useTheme()
  const { toast } = useToast()
  const router = useRouter()
  const [hotels, setHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
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

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden pb-40 transition-colors duration-500">
      
      {/* Editorial Nav */}
      <nav className="fixed top-0 w-full z-[100] h-20 px-6 md:px-16 flex items-center justify-between transition-all">
        <Link href="/" className="text-2xl font-black tracking-tighter text-foreground flex items-center gap-3">
          <div className="w-5 h-5 bg-gold rounded-sm shadow-[0_0_15px_#d4af3733]" />
          MCTJK
        </Link>
        <div className="flex items-center gap-10 bg-background/20 backdrop-blur-md px-6 py-2 rounded-full border border-border">
           <ThemeToggle />
           <Link href="/chat" className="text-[10px] font-bold uppercase tracking-[0.4em] hover:text-gold transition-all">Concierge</Link>
           {user?.role === 'ADMIN' && (
             <Link href="/admin" className="h-10 px-6 bg-gold text-black rounded-full text-[9px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-foreground hover:text-background transition-all">Command</Link>
           )}
        </div>
      </nav>

      <div className="pt-32 md:pt-48 container-tech px-6 md:px-16">
        
        <header className="mb-24 space-y-8">
           <div className="flex items-center gap-4 text-gold text-[10px] font-black uppercase tracking-[0.8em]">
              <span className="w-16 h-px bg-gold/20" />
              Sovereign Protocol
           </div>
           <h1 className="text-5xl md:text-9xl font-editorial font-bold leading-none text-foreground tracking-tighter uppercase italic">
              Portfolio <span className="text-gold">Index</span>
           </h1>
           <p className="max-w-xl text-[11px] font-bold uppercase tracking-[0.4em] text-muted-foreground leading-relaxed opacity-40">
              Access the world's most exclusive digital buffer estates. Encrypted, verified, and reserved for elite protocols within the Sovereign network.
           </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="aspect-[3/4] bg-muted border border-border rounded-[2.5rem] animate-pulse" />
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {hotels.map((hotel, i) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 1 }}
                className="group cursor-pointer"
                onClick={() => router.push(`/hotels/${hotel.id}`)}
              >
                <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden border border-border shadow-2xl transition-all duration-700 group-hover:border-gold/30">
                  <SafeImage src={hotel.images?.[0]} fill className="object-cover group-hover:scale-110 transition-transform duration-[4s]" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute top-10 left-10">
                     <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-sm">
                        {hotel.city}
                     </div>
                  </div>

                  <div className="absolute bottom-12 left-12 right-12 space-y-8">
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                          <h3 className="text-4xl font-editorial font-bold text-white leading-none tracking-tight uppercase italic">{hotel.title}</h3>
                          <div className="flex items-center gap-1.5">
                             <StarIcon width={12} height={12} className="text-gold" />
                             <span className="text-xs font-black text-gold">{Number(hotel.rating || 5.0).toFixed(1)}</span>
                          </div>
                       </div>
                       <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">{hotel.address}</p>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-white/10">
                       <div className="space-y-1">
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Starting Rate</span>
                          <div className="text-3xl font-bold text-white tracking-tighter">${hotel.rooms?.[0]?.price || 770}</div>
                       </div>
                       <div className="w-14 h-14 rounded-[1.5rem] border border-white/20 flex items-center justify-center text-white/40 group-hover:bg-gold group-hover:text-black group-hover:border-gold transition-all duration-700 shadow-2xl">
                          <ArrowRight size={20} />
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
