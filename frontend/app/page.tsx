'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useLanguage } from '../lib/LanguageContext'
import { useTheme } from '../lib/ThemeContext'
import SafeImage from '../components/SafeImage'
import NanoBananaVideo from '../components/NanoBananaVideo'
import DailySpinner from '../components/DailySpinner'
import { 
  ArrowRight, MapPin, Crown, User, Menu, X, Calendar, Users, ChevronRight,
  Radar, Cpu, Target
} from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function HomePage() {
  const { lang, t, setLang } = useLanguage()
  const { isDark } = useTheme()
  const [hotels, setHotels] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loadPercent, setLoadPercent] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))
    
    fetch('http://localhost:4000/hotels')
      .then(r => r.json())
      .then(d => setHotels(Array.isArray(d) ? d : []))
      .catch(() => setHotels([]))
  }, [])

  useEffect(() => {
    if (loading || !containerRef.current) return

    const lenis = new Lenis({
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    const ctx = gsap.context(() => {
      const horizontalWrapper = document.querySelector('.horizontal-wrapper')
      if (horizontalWrapper && window.innerWidth > 768) {
        gsap.to(horizontalWrapper, {
          x: () => -(horizontalWrapper.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: ".gallery-section",
            start: "top top",
            end: () => `+=${horizontalWrapper.scrollWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1
          }
        })
      }

      gsap.utils.toArray('.reveal').forEach((el: any) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none reverse"
          }
        })
      })
    }, containerRef)

    return () => {
      lenis.destroy()
      ctx.revert()
    }
  }, [loading, hotels, lang])

  const handleVideoReady = useCallback(() => {
    setLoadPercent(100)
    setTimeout(() => {
      setLoading(false)
      setTimeout(() => ScrollTrigger.refresh(), 500)
    }, 800)
  }, [])

  const skipLoading = () => {
    setLoading(false)
    setTimeout(() => ScrollTrigger.refresh(), 500)
  }

  const fallbackPhotos = [
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200"
  ]

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <NanoBananaVideo onProgress={(p) => setLoadPercent(prev => Math.max(prev, p))} onReady={handleVideoReady} />
        
        {/* Horizontal Loading System */}
        <div className="relative z-10 w-full max-w-2xl space-y-12">
           <div className="space-y-4">
              <div className="flex justify-between items-end px-1">
                 <div className="text-left">
                    <div className="text-gold text-[10px] font-black uppercase tracking-[0.5em] mb-1">MCTJK Protocol</div>
                    <div className="text-white/20 text-[7px] font-mono uppercase tracking-[0.3em]">Initializing Buffer Estate // Sovereign 770</div>
                 </div>
                 <div className="text-right">
                    <span className="text-4xl font-editorial font-bold italic text-white tracking-tighter">{loadPercent}%</span>
                 </div>
              </div>

              {/* High-End Progress Bar */}
              <div className="relative w-full h-[3px] bg-white/5 rounded-full overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${loadPercent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold/50 via-gold to-white shadow-[0_0_20px_#d4af37]"
                 />
                 {/* Scanning Glow */}
                 <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                 />
              </div>
           </div>

           <div className="flex flex-col items-center gap-8">
              <div className="flex gap-8 text-[7px] font-black uppercase tracking-[0.6em] text-white/20">
                 <span className={loadPercent > 20 ? "text-gold" : ""}>Auth</span>
                 <span className={loadPercent > 50 ? "text-gold" : ""}>Encrypt</span>
                 <span className={loadPercent > 80 ? "text-gold" : ""}>Buffer</span>
              </div>
              <button onClick={skipLoading} className="group flex items-center gap-4 px-12 py-5 bg-white/5 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-700 backdrop-blur-xl">
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">{t.hero.initialize}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>

        <div className="fixed bottom-12 left-12 right-12 flex justify-between items-center text-[7px] font-bold text-white/10 uppercase tracking-[0.5em]">
           <span>Neural Luxury Interface</span>
           <span>v4.0.770-Elite</span>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="bg-transparent text-foreground font-sans selection:bg-gold/20 overflow-x-hidden min-h-screen transition-colors duration-500">
      
      <NanoBananaVideo onProgress={() => {}} onReady={() => {}} />

      <div className="relative z-10">
        
        <nav className="fixed top-0 w-full z-[150] px-6 py-4 md:px-12 md:py-6 flex justify-between items-center transition-all">
           <Link href="/" className="text-xl font-bold tracking-tighter text-white md:text-foreground mix-blend-difference drop-shadow-2xl z-[160]">MCTJK</Link>
           
            <div className="hidden md:flex gap-6 text-[8px] uppercase tracking-[0.3em] font-bold items-center bg-background/20 backdrop-blur-md px-6 py-2.5 rounded-full border border-border shadow-2xl">
               <Link href="/hotels" className="hover:text-gold transition-colors">{t.nav.hotels}</Link>
               <Link href="/chat" className="hover:text-gold transition-colors">Concierge</Link>
               <div className="w-px h-3 bg-border" />
               <button onClick={() => setLang(lang === 'ru' ? 'en' : lang === 'en' ? 'tj' : 'ru')} className="hover:text-gold">{lang.toUpperCase()}</button>
               <Link href={user ? "/profile" : "/auth/login"} className="text-gold flex items-center gap-2">
                  {user ? <Crown size={12} /> : <User size={12} />}
                  <span className="uppercase">{user ? user.username : t.nav.signin}</span>
               </Link>
            </div>

           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-foreground z-[160] mix-blend-difference">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </nav>

         <div className={`fixed inset-0 bg-background z-[155] transition-transform duration-500 flex flex-col items-center justify-center space-y-8 md:hidden ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/hotels" className="text-4xl font-bold tracking-tighter uppercase italic">{t.nav.hotels}</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/chat" className="text-4xl font-bold tracking-tighter uppercase italic text-gold">Chat</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/profile" className="text-4xl font-bold tracking-tighter uppercase italic text-foreground/40">{user ? user.username : t.nav.signin}</Link>
         </div>

        <main>
          <section className="min-h-screen w-full flex flex-col items-center justify-center px-6 pt-20 relative">
             <div className="max-w-4xl w-full space-y-12 text-center reveal">
                <div className="bg-background/20 backdrop-blur-md inline-block px-6 py-2 rounded-full border border-border mb-4">
                  <span className="text-[9px] tracking-[0.5em] md:tracking-[1em] text-gold uppercase font-bold">{t.home.searchSub}</span>
                </div>
                <h1 className="text-3xl md:text-7xl font-bold tracking-tight uppercase leading-none drop-shadow-2xl text-white mix-blend-difference">
                   {t.home.searchTitle}
                </h1>

                <div className="bg-background/30 backdrop-blur-xl border border-border rounded-[2rem] md:rounded-full p-2 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 shadow-2xl mt-12 max-w-sm md:max-w-none mx-auto">
                   <div className="flex items-center gap-4 px-6 py-4 border-b md:border-b-0 md:border-r border-border">
                      <MapPin size={18} className="text-gold/60" />
                      <input type="text" placeholder={lang === 'ru' ? 'Локация' : 'Location'} className="bg-transparent border-none outline-none text-[10px] uppercase tracking-widest placeholder:text-foreground/20 w-full" />
                   </div>
                   <div className="flex items-center gap-4 px-6 py-4 border-b md:border-b-0 md:border-r border-border">
                      <Calendar size={18} className="text-gold/60" />
                      <span className="text-[10px] uppercase tracking-widest text-foreground/60">3 Days Access</span>
                   </div>
                   <div className="flex items-center gap-4 px-6 py-4 border-b md:border-b-0 md:border-r border-border">
                      <Users size={18} className="text-gold/60" />
                      <span className="text-[10px] uppercase tracking-widest text-foreground/60">Sovereign Guests</span>
                   </div>
                   <button className="bg-foreground text-background hover:bg-gold hover:text-white transition-all rounded-[1.5rem] md:rounded-full py-4 px-8 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                      {t.hero.initialize}
                   </button>
                </div>
             </div>
          </section>

          <section className="py-16 md:py-32 px-6 bg-background/40 backdrop-blur-xl border-y border-border overflow-hidden">
             <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-4 space-y-4 text-center md:text-left">
                   <div className="flex items-center justify-center md:justify-start gap-3 text-gold">
                      <Radar size={20} className="animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t.home.activityLive}</span>
                   </div>
                   <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter leading-tight">{t.home.activityTitle}</h2>
                </div>
                <div className="md:col-span-8 flex gap-4 md:gap-8 overflow-x-auto no-scrollbar relative pb-4 md:pb-0 scroll-smooth">
                   {[
                     { user: "User 7701", loc: "Dubai", time: "2m ago", status: "Accessing Buffer" },
                     { user: "User 1209", loc: "Tajikistan", time: "Just now", status: "Booking Confirmed" },
                     { user: "Sovereign 01", loc: "London", time: "5m ago", status: "VIP Protocol" }
                   ].map((item, i) => (
                     <div key={i} className="flex-shrink-0 bg-muted border border-border p-6 rounded-2xl min-w-[240px] md:min-w-[280px] space-y-3">
                        <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest opacity-40">
                           <span>{item.user}</span>
                           <span>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 bg-green-500 rounded-full" />
                           <span className="text-[10px] font-bold uppercase tracking-tight">{item.status}</span>
                        </div>
                        <div className="text-foreground/20 text-[8px] font-bold uppercase tracking-widest">{item.loc}</div>
                     </div>
                   ))}
                </div>
             </div>
          </section>

          <section className="gallery-section min-h-screen py-20 relative overflow-hidden flex items-center bg-background/20">
             <div className="absolute top-20 left-6 md:left-20 z-20">
                <h2 className="text-[15vw] md:text-[10vw] font-bold tracking-tighter uppercase opacity-5 select-none italic leading-none">{t.home.catalogTitle}</h2>
             </div>
             
             <div className="horizontal-wrapper flex flex-col md:flex-row items-center md:h-full px-6 md:px-[10vw] gap-12 md:gap-16 w-full md:w-max">
                {(hotels.length > 0 ? hotels.slice(0, 6) : [0,1,2,3]).map((h: any, i: number) => {
                  const hotel = typeof h === 'object' ? h : { id: i, title: 'Elite Suite', city: 'Sovereign', price: '770' };
                  return (
                    <div key={i} className="relative w-full md:w-[25vw] aspect-[3/4.5] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden group border border-border bg-muted shadow-2xl flex-shrink-0 transition-transform duration-700">
                      <SafeImage src={hotel.images?.[0] || fallbackPhotos[i % fallbackPhotos.length]} fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-95" />
                      <div className="absolute bottom-10 left-10 right-10 md:bottom-12 md:left-12 md:right-12 space-y-4">
                         <span className="text-white/20 text-[8px] font-bold uppercase tracking-[0.4em] mb-4 block">{hotel.city}</span>
                         <h3 className="text-2xl font-bold tracking-tight uppercase leading-none drop-shadow-lg text-white">{hotel.title}</h3>
                         <div className="flex justify-between items-center pt-6">
                            <span className="text-gold font-bold text-sm">${hotel.price}/{lang === 'en' ? 'N' : 'Н'}</span>
                            <Link href={`/hotels/${hotel.id}`} className="text-[8px] font-bold uppercase tracking-[0.5em] text-white/40 flex items-center gap-2 group-hover:text-white transition-colors">
                               {t.common.reserve} <ArrowRight size={10} />
                            </Link>
                         </div>
                      </div>
                    </div>
                  )
                })}
             </div>
          </section>

          <section className="py-20 md:py-40 px-6 max-w-7xl mx-auto reveal relative">
             <DailySpinner />
          </section>

          <section className="py-24 md:py-60 px-6 relative overflow-hidden bg-background/20 backdrop-blur-sm">
             <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
                <div className="reveal space-y-8 md:space-y-12 relative z-10 text-center md:text-left">
                   <div className="inline-flex items-center gap-3 px-6 py-3 bg-muted border border-border rounded-full backdrop-blur-md">
                      <Cpu size={14} className="text-gold" />
                      <span className="text-[8px] uppercase tracking-widest font-bold text-foreground">{t.home.bufferMetric}</span>
                   </div>
                   <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tight leading-[1] text-foreground drop-shadow-2xl">{t.home.bufferTitle}</h2>
                   <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] leading-loose opacity-60 max-w-md mx-auto md:mx-0 font-medium">
                      {t.home.bufferDesc}
                   </p>
                </div>
                
                <div className="relative group max-w-sm mx-auto md:max-w-none">
                   <div className="absolute -inset-10 bg-gold/10 blur-[100px] rounded-full opacity-50" />
                   <div className="relative aspect-[4/5] rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-border shadow-2xl bg-muted">
                      <SafeImage src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200" fill className="object-cover" />
                      <div className="absolute top-10 right-10 flex flex-col items-end gap-2 opacity-60">
                         <Target size={20} className="text-gold" />
                         <div className="text-[6px] font-mono uppercase tracking-widest">Buffer Lock</div>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          <footer className="py-24 px-6 border-t border-border bg-card backdrop-blur-md text-center relative overflow-hidden">
             {/* Sovereign Ascent (Back to Top) */}
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
                   <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold to-gold/20" />
                   <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center bg-background group-hover:border-gold group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                   </div>
                   <span className="text-[7px] font-black uppercase tracking-[0.6em] text-gold opacity-40 group-hover:opacity-100 transition-opacity">Sovereign Ascent</span>
                </button>
             </div>

             <div className="max-w-7xl mx-auto space-y-12 pt-12">
                <span className="text-2xl font-bold tracking-tighter text-foreground">MCTJK</span>
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[8px] font-medium uppercase tracking-[0.4em] opacity-30">
                   <span>Destinations</span>
                   <span>Experience</span>
                   <span>Sovereign</span>
                   <span>Legal</span>
                </div>
                <div className="text-[8px] opacity-20 uppercase tracking-widest">© 2026 // NEURAL LUXURY PROTOCOL</div>
             </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
