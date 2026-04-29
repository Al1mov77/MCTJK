'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../lib/LanguageContext'
import { useTheme } from '../lib/ThemeContext'
import SafeImage from '../components/SafeImage'
import { ThemeToggle } from '../components/ui/theme-toggle'
import { cn } from '../lib/utils'
import { LocationIcon, StarIcon, WifiIcon, SpaIcon, PoolIcon, GymIcon } from '../components/HotelIcons'
import { Sparkles } from 'lucide-react'

export default function HomePage() {
  const { t, lang, setLang } = useLanguage()
  const { isDark } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [hotels, setHotels] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    
    fetch('http://localhost:4000/hotels').then(res => res.json()).then(data => {
      setHotels(Array.isArray(data) ? data : [])
    }).catch(() => setHotels([]))

    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-300 overflow-x-hidden">
      
      {/* ── Luxury Navigation ── */}
      <nav className={cn(
        "fixed top-0 w-full z-[250] transition-all duration-300 px-4 md:px-0",
        scrolled ? "h-14 md:h-16 bg-background/90 backdrop-blur-lg border-b border-amber-200/20 dark:border-amber-800/20 shadow-lg" : "h-16 md:h-20 bg-transparent"
      )}>
        <div className="container-tech h-full flex justify-between items-center">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-lg md:text-xl font-black tracking-tighter flex items-center gap-3 group">
              <div className={cn(
                "w-5 h-5 md:w-6 md:h-6 rounded-sm transition-transform group-hover:scale-110",
                isDark 
                  ? "bg-gradient-to-br from-amber-500 to-rose-500" 
                  : "bg-gradient-to-br from-amber-400 to-rose-400 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40"
              )} />
              <span className={cn(
                "bg-clip-text text-transparent transition-all duration-300",
                isDark 
                  ? "bg-gradient-to-r from-amber-600 to-rose-600" 
                  : "bg-gradient-to-r from-amber-500 to-rose-500"
              )}>MCTJK</span>
            </Link>
          </div>
          
          {/* Center Section - Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center gap-8 md:gap-12">
              {['hotels', 'chat', 'bookings'].map((item) => (
                <Link 
                  key={item} 
                  href={`/${item}`} 
                  className={cn(
                    "text-[10px] font-bold transition-colors uppercase tracking-widest px-3 py-2",
                    isDark 
                      ? "text-muted-foreground hover:text-foreground" 
                      : "text-amber-600/70 hover:text-amber-600 hover:bg-amber-50/50 rounded-full hover:shadow-md"
                  )}
                >
                  {t.nav[item] || item}
                </Link>
              ))}
              {user?.role === 'ADMIN' && (
                <Link 
                  href="/admin" 
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest transition-colors px-3 py-2",
                    isDark 
                      ? "text-brand hover:text-foreground" 
                      : "text-amber-600 hover:bg-gradient-to-r hover:from-amber-100 hover:to-rose-100 rounded-full hover:shadow-lg"
                  )}
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              {['EN', 'RU', 'TJ'].map(l => (
                 <button 
                   key={l} 
                   onClick={() => setLang(l.toLowerCase() as any)} 
                   className={cn(
                     "text-[9px] font-black tracking-tighter transition-colors px-2 py-1 rounded",
                     lang === l.toLowerCase() 
                       ? "text-foreground bg-amber-100 dark:bg-amber-900/30" 
                       : "text-muted-foreground hover:text-foreground hover:bg-amber-50 dark:hover:bg-amber-950/20"
                   )}
                 >
                    {l}
                 </button>
              ))}
            </div>
            <div className="w-px h-6 bg-border hidden sm:block" />
            <ThemeToggle />
            <Link 
              href={user ? '/bookings' : '/auth/login'} 
              className="apple-btn px-4 md:px-6 h-8 md:h-10 text-[10px] md:text-xs bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white border-0 shadow-lg whitespace-nowrap"
            >
               {user ? (t.nav.profile || 'PROFILE') : (t.nav.signin || 'SIGN IN')}
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="lg:hidden p-2 text-foreground hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-full transition-colors"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 50 }} 
            className="fixed inset-0 z-[300] bg-background lg:hidden p-6 md:p-8 flex flex-col"
          >
             {/* Header */}
             <div className="flex justify-between items-center pt-8 pb-12">
                <div className="w-12" />
                <div className="text-center">
                   <h2 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">Menu</h2>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-3 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-full transition-colors"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
             </div>
             
             {/* Navigation Links */}
             <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-8 md:space-y-12">
                   {['hotels', 'chat', 'bookings'].map((item, index) => (
                     <motion.div
                       key={item}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: index * 0.1 }}
                     >
                       <Link 
                         onClick={() => setIsMenuOpen(false)} 
                         href={`/${item}`} 
                         className="block text-3xl md:text-4xl font-black tracking-tighter hover:text-muted-foreground transition-colors px-4 py-3 text-center"
                       >
                         {t.nav[item] || item}
                       </Link>
                     </motion.div>
                   ))}
                   {user?.role === 'ADMIN' && (
                     <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.3 }}
                     >
                       <Link 
                         onClick={() => setIsMenuOpen(false)} 
                         href="/admin" 
                         className="block text-3xl md:text-4xl font-black tracking-tighter text-brand px-4 py-3 text-center"
                       >
                         Admin
                       </Link>
                     </motion.div>
                   )}
                </div>
             </div>
             
             {/* Footer */}
             <div className="py-8 border-t border-border">
                <div className="flex justify-center gap-8 mb-8">
                   {['EN', 'RU', 'TJ'].map(l => (
                      <motion.button 
                        key={l} 
                        onClick={() => { setLang(l.toLowerCase() as any); setIsMenuOpen(false); }} 
                        className={cn(
                          "text-lg font-black tracking-tighter px-4 py-2 rounded-lg transition-colors",
                          lang === l.toLowerCase() 
                            ? "text-foreground bg-amber-100 dark:bg-amber-900/30" 
                            : "text-muted-foreground hover:text-foreground hover:bg-amber-50 dark:hover:bg-amber-950/20"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                         {l}
                      </motion.button>
                   ))}
                </div>
                <div className="text-center">
                   <Link 
                     href={user ? '/bookings' : '/auth/login'} 
                     onClick={() => setIsMenuOpen(false)}
                     className="apple-btn px-8 py-4 text-sm bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white border-0 shadow-lg inline-block"
                   >
                      {user ? (t.nav.profile || 'PROFILE') : (t.nav.signin || 'SIGN IN')}
                   </Link>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Luxury Hero ── */}
      <section className="relative pt-32 md:pt-40 pb-12 md:pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-rose-50/20 dark:from-amber-900/10 dark:via-transparent dark:to-rose-900/10" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-rose-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container-tech text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Luxury Badge */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 rounded-full border border-amber-200/50 dark:border-amber-700/50 mb-6">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">Premium Collection</span>
            </motion.div>
            
             <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 md:mb-8 leading-[1.05] md:leading-[1.1]">
                <span className="bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">{t.hero.title1}</span> <br />
                <span className="text-muted-foreground">{t.hero.title2}</span>
             </h1>
             <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-12 font-medium px-4 leading-relaxed">
               {t.hero.desc}
             </p>
             
             {/* Luxury Stats */}
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-wrap justify-center gap-8 mb-12 px-4">
                <div className="text-center">
                   <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">50+</div>
                   <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Luxury Hotels</div>
                </div>
                <div className="text-center">
                   <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">5★</div>
                   <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Premium Service</div>
                </div>
                <div className="text-center">
                   <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">24/7</div>
                   <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Concierge</div>
                </div>
             </motion.div>
             
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6 sm:px-0">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="apple-btn h-12 md:h-14 px-8 md:px-10 text-sm md:text-base w-full sm:w-auto bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white border-0 shadow-lg">
                   {t.hero.explore}
                </motion.button>
                <Link href="/hotels" className="text-xs md:text-sm font-bold uppercase tracking-widest hover:underline flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                   {t.common.viewAll} 
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
             </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }} className="mt-12 md:mt-20 relative aspect-square sm:aspect-video rounded-2xl md:rounded-3xl overflow-hidden border border-border bg-muted shadow-2xl group">
             <SafeImage src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                <div className="flex items-center gap-2 mb-2">
                   <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                   <span className="text-xs font-black uppercase tracking-widest">Available Now</span>
                </div>
                <h3 className="text-2xl font-black mb-1">Experience Luxury</h3>
                <p className="text-sm opacity-90">Book your dream stay today</p>
             </div>
          </motion.div>
        </div>
      </section>

      {/* ── Premium Hotels Collection ── */}
      <section className="py-20 md:py-40 border-t border-border px-4 md:px-0 bg-gradient-to-b from-background via-background to-amber-50/30 dark:to-amber-950/20">
        <div className="container-tech">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 md:mb-20">
              <div>
                 <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">{t.hotels.title}</h2>
                 <p className="text-sm text-muted-foreground font-medium">Discover our handpicked selection of luxury accommodations</p>
              </div>
              <Link href="/hotels" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground flex items-center gap-2 group">
                 Browse all 
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {hotels.slice(0, 3).map((hotel, i) => (
                <motion.div key={hotel.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}>
                   <Link href="/hotels" className="block group">
                      <div className="relative overflow-hidden bg-gradient-to-br from-background to-muted border border-border rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
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
                   </Link>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* ── Premium Amenities ── */}
      <section className="py-20 md:py-40 border-t border-border px-4 md:px-0">
        <div className="container-tech">
           <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">Premium Amenities</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-medium">Experience world-class facilities and services designed for your comfort</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                 { icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', title: 'Luxury Spa', desc: 'Rejuvenate with world-class treatments' },
                 { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', title: 'Fine Dining', desc: 'Gourmet cuisine from master chefs' },
                 { icon: 'M17 65h-1.26a8 8 0 01-7.87-6.7l-1.52-8.36A8 8 0 0114.4 40h32.2a8 8 0 017.87 6.7l-1.52 8.36A8 8 0 0145.26 65H44m-17 0v-9h16v9m-17-9h18', title: 'Business Center', desc: 'Modern facilities for business travelers' },
                 { icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', title: 'Concierge Service', desc: '24/7 personalized assistance' }
              ].map((amenity, i) => (
                 <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} className="text-center group">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600 dark:text-amber-400">
                          <path d={amenity.icon} />
                       </svg>
                    </div>
                    <h3 className="text-lg font-black tracking-tighter mb-2 group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-rose-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                       {amenity.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">{amenity.desc}</p>
                 </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* ── Experience Section ── */}
      <section className="py-20 md:py-40 border-t border-border px-4 md:px-0 bg-gradient-to-b from-background to-amber-50/20 dark:to-amber-950/10">
        <div className="container-tech">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200/50 dark:border-blue-700/50">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-blue-700 dark:text-blue-300">Exclusive Experience</span>
                 </div>
                 <h2 className="text-3xl md:text-4xl font-black tracking-tighter">Unforgettable Luxury Stays</h2>
                 <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed">
                    Immerse yourself in unparalleled luxury where every detail is meticulously crafted to exceed your expectations. From personalized concierge services to world-class dining, your journey into extraordinary hospitality begins here.
                 </p>
                 <div className="space-y-4">
                    {[
                       'Personalized 24/7 concierge service',
                       'Exclusive access to premium facilities',
                       'Complimentary spa treatments',
                       'Priority reservations at fine dining restaurants'
                    ].map((feature, i) => (
                       <div key={i} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 11l3 3L22 4"/></svg>
                          </div>
                          <span className="text-sm font-medium">{feature}</span>
                       </div>
                    ))}
                 </div>
                 <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="apple-btn h-12 px-8 text-sm bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white border-0 shadow-lg">
                    Book Your Experience
                 </motion.button>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
                 <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                    <SafeImage src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop" fill className="object-cover" />
                 </div>
                 <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-amber-500 to-rose-500 rounded-2xl shadow-lg flex items-center justify-center text-white">
                    <Sparkles size={32} />
                 </div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 md:py-20 border-t border-border">
        <div className="container-tech text-center md:text-left">
           <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex items-center gap-2 font-black tracking-tighter text-xl">
                 <div className="w-5 h-5 bg-foreground rounded-sm" />
                 MCTJK
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-10">
                 {['Privacy', 'Legal', 'Contact'].map(item => (
                    <Link key={item} href="#" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">{item}</Link>
                 ))}
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">© 2026 MCTJK. All rights reserved.</p>
           </div>
        </div>
      </footer>
    </div>
  )
}
