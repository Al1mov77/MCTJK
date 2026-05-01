'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useLanguage } from '../lib/LanguageContext'
import SafeImage from '../components/SafeImage'
import NanoBananaVideo from '../components/NanoBananaVideo'
import DailySpinner from '../components/DailySpinner'
import { 
  ArrowRight, MapPin, Crown, ChevronDown, 
  User, ShieldCheck, Menu, X, Calendar, Users, ChevronRight,
  Radar, Cpu, Target
} from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function HomePage() {
  const { lang, t, setLang } = useLanguage()
  const [hotels, setHotels] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loadPercent, setLoadPercent] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setLoadPercent(prev => (prev < 40 ? prev + 1 : prev))
    }, 100)
    return () => clearInterval(interval)
  }, [loading])

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
      duration: 1.2,
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
          y: 40,
          opacity: 0,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
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
    }, 600)
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
      <div className="fixed inset-0 bg-[#050505] z-[1000] flex flex-col items-center justify-center font-outfit text-white p-6 text-center">
        <NanoBananaVideo onProgress={(p) => setLoadPercent(prev => Math.max(prev, p))} onReady={handleVideoReady} />
        <div className="text-amber-500 text-[10px] font-medium uppercase tracking-[1em] mb-8 animate-pulse">{t.common.loading}</div>
        <div className="relative w-full max-w-xs h-[1px] bg-white/10 overflow-hidden rounded-full mb-6">
          <div className="absolute inset-y-0 left-0 bg-amber-500 transition-all duration-500" style={{ width: `${loadPercent}%` }} />
        </div>
        <button onClick={skipLoading} className="group flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 group-hover:text-amber-500 transition-colors">{t.hero.initialize}</span>
          <ChevronRight size={12} className="text-white/20 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="bg-transparent text-white font-outfit selection:bg-amber-500 overflow-x-hidden min-h-screen">
      
      <NanoBananaVideo onProgress={() => {}} onReady={() => {}} />

      <div className="relative z-10">
        
        {/* TOP NAV */}
        <nav className="fixed top-0 w-full z-[150] px-6 py-4 md:px-12 md:py-6 flex justify-between items-center bg-black/10 backdrop-blur-md border-b border-white/5 md:bg-transparent md:backdrop-blur-none md:border-none">
           <Link href="/" className="text-xl font-bold tracking-tighter drop-shadow-2xl z-[160]">MCTJK</Link>
           
           {/* Desktop Nav */}
           <div className="hidden md:flex gap-6 text-[8px] uppercase tracking-[0.3em] font-bold items-center bg-black/20 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 shadow-2xl">
              <Link href="/hotels" className="hover:text-amber-500 transition-colors">{t.nav.hotels}</Link>
              <div className="w-px h-3 bg-white/10" />
              <button onClick={() => setLang(lang === 'ru' ? 'en' : lang === 'en' ? 'tj' : 'ru')} className="hover:text-amber-500">{lang.toUpperCase()}</button>
              <Link href={user ? "/profile" : "/auth/login"} className="text-amber-500 flex items-center gap-2">
                 {user ? <Crown size={12} /> : <User size={12} />}
                 <span className="uppercase">{user ? user.username : t.nav.signin}</span>
              </Link>
           </div>

           {/* Mobile Menu Trigger */}
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-white z-[160]">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </nav>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-[#050505] z-[155] transition-transform duration-500 flex flex-col items-center justify-center space-y-8 md:hidden ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
           <Link onClick={() => setIsMobileMenuOpen(false)} href="/hotels" className="text-4xl font-bold tracking-tighter uppercase italic">{t.nav.hotels}</Link>
           <Link onClick={() => setIsMobileMenuOpen(false)} href="/profile" className="text-4xl font-bold tracking-tighter uppercase italic text-amber-500">{user ? user.username : t.nav.signin}</Link>
           <button onClick={() => { setLang(lang === 'ru' ? 'en' : lang === 'en' ? 'tj' : 'ru'); setIsMobileMenuOpen(false); }} className="text-4xl font-bold tracking-tighter uppercase italic opacity-20">{lang.toUpperCase()}</button>
        </div>

        <main>
          {/* HERO */}
          <section className="min-h-screen w-full flex flex-col items-center justify-center px-6 pt-20 relative">
             <div className="max-w-4xl w-full space-y-12 text-center reveal">
                <div className="bg-black/20 backdrop-blur-md inline-block px-6 py-2 rounded-full border border-white/5 mb-4">
                  <span className="text-[9px] tracking-[0.5em] md:tracking-[1em] text-amber-500 uppercase font-bold">{t.home.searchSub}</span>
                </div>
                <h1 className="text-3xl md:text-7xl font-bold tracking-tight uppercase leading-none drop-shadow-2xl">
                   {t.home.searchTitle}
                </h1>

                <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-full p-2 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 shadow-2xl mt-12 max-w-sm md:max-w-none mx-auto">
                   <div className="flex items-center gap-4 px-6 py-4 border-b md:border-b-0 md:border-r border-white/5">
                      <MapPin size={18} className="text-amber-500/60" />
                      <input type="text" placeholder={lang === 'ru' ? 'Локация' : 'Location'} className="bg-transparent border-none outline-none text-[10px] uppercase tracking-widest placeholder:text-white/20 w-full" />
                   </div>
                   <div className="flex items-center gap-4 px-6 py-4 border-b md:border-b-0 md:border-r border-white/5">
                      <Calendar size={18} className="text-amber-500/60" />
                      <span className="text-[10px] uppercase tracking-widest text-white/60">3 Days Access</span>
                   </div>
                   <div className="flex items-center gap-4 px-6 py-4 border-b md:border-b-0 md:border-r border-white/5">
                      <Users size={18} className="text-amber-500/60" />
                      <span className="text-[10px] uppercase tracking-widest text-white/60">Sovereign Guests</span>
                   </div>
                   <button className="bg-white text-black hover:bg-amber-500 hover:text-white transition-all rounded-[1.5rem] md:rounded-full py-4 px-8 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                      {t.hero.initialize}
                   </button>
                </div>
             </div>
          </section>

          {/* ACTIVITY */}
          <section className="py-16 md:py-32 px-6 bg-black/30 backdrop-blur-xl border-y border-white/5 overflow-hidden">
             <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-4 space-y-4 text-center md:text-left">
                   <div className="flex items-center justify-center md:justify-start gap-3 text-amber-500">
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
                     <div key={i} className="flex-shrink-0 bg-white/5 border border-white/10 p-6 rounded-2xl min-w-[240px] md:min-w-[280px] space-y-3">
                        <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest opacity-40">
                           <span>{item.user}</span>
                           <span>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 bg-green-500 rounded-full" />
                           <span className="text-[10px] font-bold uppercase tracking-tight">{item.status}</span>
                        </div>
                        <div className="text-white/20 text-[8px] font-bold uppercase tracking-widest">{item.loc}</div>
                     </div>
                   ))}
                </div>
             </div>
          </section>

          {/* CATALOG */}
          <section className="gallery-section min-h-screen py-20 relative overflow-hidden flex items-center bg-black/10">
             <div className="absolute top-20 left-6 md:left-20 z-20">
                <h2 className="text-[15vw] md:text-[10vw] font-bold tracking-tighter uppercase opacity-5 select-none italic leading-none">{t.home.catalogTitle}</h2>
             </div>
             
             {/* Horizontal on Desktop, Vertical Scroll on Mobile */}
             <div className="horizontal-wrapper flex flex-col md:flex-row items-center md:h-full px-6 md:px-[10vw] gap-12 md:gap-16 w-full md:w-max">
                {(hotels.length > 0 ? hotels.slice(0, 6) : [0,1,2,3]).map((h: any, i: number) => {
                  const hotel = typeof h === 'object' ? h : { id: i, title: 'Elite Suite', city: 'Sovereign', price: '770' };
                  return (
                    <div key={i} className="relative w-full md:w-[25vw] aspect-[3/4.5] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden group border border-white/10 bg-zinc-950 shadow-2xl flex-shrink-0 transition-transform duration-700">
                      <SafeImage src={hotel.images?.[0] || fallbackPhotos[i % fallbackPhotos.length]} fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-95" />
                      <div className="absolute bottom-10 left-10 right-10 md:bottom-12 md:left-12 md:right-12 space-y-4">
                         <span className="text-white/20 text-[8px] font-bold uppercase tracking-[0.4em] mb-4 block">{hotel.city}</span>
                         <h3 className="text-2xl font-bold tracking-tight uppercase leading-none drop-shadow-lg text-white">{hotel.title}</h3>
                         <div className="flex justify-between items-center pt-6">
                            <span className="text-amber-500 font-bold text-sm">${hotel.price}/{lang === 'en' ? 'N' : 'Н'}</span>
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

          {/* SPINNER */}
          <section className="py-20 md:py-40 px-6 max-w-7xl mx-auto reveal relative">
             <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent" />
             <DailySpinner />
          </section>

          {/* BUFFER */}
          <section className="py-24 md:py-60 px-6 relative overflow-hidden bg-black/20 backdrop-blur-sm">
             <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
                <div className="reveal space-y-8 md:space-y-12 relative z-10 text-center md:text-left">
                   <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                      <Cpu size={14} className="text-amber-500" />
                      <span className="text-[8px] uppercase tracking-widest font-bold text-white">{t.home.bufferMetric}</span>
                   </div>
                   <h2 className="text-4xl md:text-8xl font-bold uppercase tracking-tight leading-[0.9] text-white drop-shadow-2xl">{t.home.bufferTitle}</h2>
                   <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] leading-loose opacity-60 max-w-md mx-auto md:mx-0 font-medium text-white drop-shadow-md">
                      {t.home.bufferDesc}
                   </p>
                </div>
                
                <div className="relative group max-w-sm mx-auto md:max-w-none">
                   <div className="absolute -inset-10 bg-amber-500/10 blur-[100px] rounded-full opacity-50" />
                   <div className="relative aspect-[4/5] rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl">
                      <SafeImage src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200" fill className="object-cover" />
                      <div className="absolute top-10 right-10 flex flex-col items-end gap-2 opacity-60 text-white">
                         <Target size={20} className="text-amber-500" />
                         <div className="text-[6px] font-mono uppercase tracking-widest">Buffer Lock</div>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          <footer className="py-24 px-6 border-t border-white/5 bg-black/40 backdrop-blur-md text-center">
             <div className="max-w-7xl mx-auto space-y-12">
                <span className="text-2xl font-bold tracking-tighter text-white">MCTJK</span>
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
