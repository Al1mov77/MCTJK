'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, MapPin, Globe, Shield, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import SafeImage from '../../components/SafeImage'

export default function LuxuryConceptPage() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0B0B0C] font-sans selection:bg-[#0B0B0C] selection:text-[#FAFAFA]">
      
      {/* ── Navigation ── */}
      <nav className="fixed top-0 w-full z-[200] px-8 md:px-16 py-8 flex justify-between items-center mix-blend-difference text-[#FAFAFA]">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.5em] flex items-center gap-4">
          MCTJK <span className="opacity-40">Heritage</span>
        </Link>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-10 h-10 flex items-center justify-center">
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* ── Fullscreen Menu ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[150] bg-[#FAFAFA] flex flex-col items-center justify-center space-y-12"
          >
            {['Hotels', 'Philosophy', 'Experiences', 'Inquiry'].map((item, i) => (
              <motion.button 
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-4xl md:text-7xl font-semibold uppercase tracking-tighter hover:italic transition-all"
              >
                {item}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero: The Fold ── */}
      <section className="relative h-screen flex flex-col justify-end p-8 md:p-16">
        <div className="absolute inset-0 z-0">
          <SafeImage 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000" 
            fill 
            className="object-cover grayscale-[0.2]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAFAFA]/40" />
        </div>
        
        <div className="relative z-10 max-w-7xl w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[14vw] font-semibold uppercase leading-[0.8] tracking-tighter"
          >
            Private <br /> Sanctuaries
          </motion.h1>
          <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <p className="text-sm md:text-lg max-w-md font-normal leading-relaxed opacity-80">
              Curated architectural heritage across the Silk Road. A new paradigm of silence and luxury.
            </p>
            <div className="flex items-center gap-12 border-t border-[#0B0B0C]/10 pt-8 w-full md:w-auto">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest opacity-40">Current Location</span>
                <p className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} /> Dushanbe, Tajikistan
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest opacity-40">Availability</span>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0B0B0C]">
                  Selective Entry Only
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: The Philosophy ── */}
      <section className="py-64 px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.5em] opacity-40">01 / Philosophy</span>
              <h2 className="text-5xl md:text-7xl font-semibold uppercase tracking-tighter leading-none">
                The Art of <br /> Silence
              </h2>
            </div>
            <p className="text-lg md:text-2xl font-normal leading-relaxed opacity-70 italic">
              "We do not build rooms; we create thresholds between the noise of the world and the rhythm of the soul."
            </p>
          </div>
          <div className="lg:col-span-7 relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl">
            <SafeImage 
              src="https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=1200" 
              fill 
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Section: The Collection ── */}
      <section className="py-32 bg-[#F1F1F1]">
        <div className="px-8 md:px-16 space-y-24">
          <div className="flex justify-between items-end">
            <h2 className="text-4xl md:text-6xl font-semibold uppercase tracking-tighter">The Registry</h2>
            <button className="text-[10px] font-semibold uppercase tracking-[0.5em] border-b border-[#0B0B0C] pb-2 hover:opacity-50 transition-all">
              View Collection
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start">
            {[
              { title: "The High Alpine", loc: "Pamir Mountains", img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800", size: "aspect-[3/4]" },
              { title: "The River Suite", loc: "Khujand Heritage", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800", size: "aspect-square mt-24" },
              { title: "Silk Road Palace", loc: "Dushanbe Core", img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800", size: "aspect-[4/5]" }
            ].map((item, i) => (
              <div key={i} className={`space-y-8 group ${item.size}`}>
                <div className="relative w-full h-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                  <SafeImage src={item.img} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.4em] opacity-40">{item.loc}</p>
                  <h3 className="text-2xl font-semibold uppercase tracking-tight">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section: Large Narrative ── */}
      <section className="py-64 text-center px-8 md:px-16">
        <div className="max-w-4xl mx-auto space-y-24">
          <div className="flex justify-center">
            <Globe className="w-12 h-12 opacity-10" />
          </div>
          <h2 className="text-4xl md:text-8xl font-semibold uppercase tracking-tighter leading-[0.9]">
            A Heritage <br /> Preserved <br /> For the Few.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-[#0B0B0C]/10 pt-12">
             <div className="space-y-4">
               <span className="text-[10px] font-semibold uppercase tracking-widest opacity-40">Verification</span>
               <p className="text-xs font-semibold leading-relaxed">Mandatory ID registry for all sanctuary residents.</p>
             </div>
             <div className="space-y-4">
               <span className="text-[10px] font-semibold uppercase tracking-widest opacity-40">Privacy</span>
               <p className="text-xs font-semibold leading-relaxed">Encryption-first concierge for private narratives.</p>
             </div>
             <div className="space-y-4">
               <span className="text-[10px] font-semibold uppercase tracking-widest opacity-40">Heritage</span>
               <p className="text-xs font-semibold leading-relaxed">Preserving Silk Road architectural intelligence.</p>
             </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-32 px-8 md:px-16 border-t border-[#0B0B0C]/10 flex flex-col md:flex-row justify-between items-start gap-24">
        <div className="space-y-12">
          <div className="text-2xl font-semibold uppercase tracking-[0.5em]">MCTJK</div>
          <div className="space-y-4 text-xs font-semibold uppercase tracking-[0.3em] opacity-30">
            <p>Sanctuary Registry</p>
            <p>Digital Concierge Office</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16 md:gap-32">
          {['Hotels', 'Heritage', 'Privacy', 'Legal'].map(item => (
            <button key={item} className="text-xs font-semibold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">{item}</button>
          ))}
        </div>
        <div className="text-right space-y-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest opacity-20">© 2026 MCTJK HERITAGE COLLECTION</p>
          <div className="flex justify-end gap-6 opacity-20">
            <Shield size={16} />
          </div>
        </div>
      </footer>

    </div>
  )
}

