'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import AntigravityCanvas from '../../components/AntigravityCanvas'
import { ArrowRight, ChevronDown, Cpu, Globe, Layers, Zap } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function AntigravityPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
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
      // Staggered Floating Entrances
      gsap.from(".float-up", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".float-up",
          start: "top 90%",
        }
      })

      // Parallax Sections
      gsap.utils.toArray('.parallax-section').forEach((section: any) => {
        const content = section.querySelector('.parallax-content')
        if (content) {
          gsap.to(content, {
            y: -100,
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          })
        }
      })
    }, containerRef)

    return () => {
      lenis.destroy()
      ctx.revert()
    }
  }, [mounted])

  if (!mounted) return <div className="bg-black min-h-screen" />

  return (
    <div ref={containerRef} className="bg-black text-white font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden min-h-screen">
      
      {/* HEADER */}
      <nav className="fixed top-0 w-full z-[100] px-10 py-8 flex justify-between items-center mix-blend-difference">
        <div className="text-xl font-black tracking-tighter uppercase italic">Antigravity</div>
        <div className="flex gap-10 text-[9px] uppercase tracking-[0.5em] font-bold">
           <span className="hover:text-cyan-400 cursor-pointer transition-colors">OS 01</span>
           <span className="hover:text-cyan-400 cursor-pointer transition-colors">Manifesto</span>
           <span className="px-4 py-1 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all cursor-pointer">Launch</span>
        </div>
      </nav>

      <main>
        
        {/* THE PINNED CINEMATIC EXPERIENCE */}
        <AntigravityCanvas />

        {/* THE REST OF THE CONTENT */}
        <div className="relative z-20 bg-black">
          {/* FEATURES GRID */}
          <section className="py-40 px-10 border-y border-white/5">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
              {[
                { icon: <Cpu />, title: "Neural Sync", desc: "Direct interface with biological intent." },
                { icon: <Layers />, title: "Infinite Depth", desc: "Unbounded vertical spatiality." },
                { icon: <Zap />, title: "Zero Friction", desc: "Fluid dynamics at 120fps." },
                { icon: <Globe />, title: "Global Mesh", desc: "Decentralized physical presence." }
              ].map((item, i) => (
                <div key={i} className="float-up p-10 border border-white/5 rounded-3xl hover:bg-white/5 transition-all group">
                   <div className="text-cyan-500 mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                   <h3 className="text-xl font-bold mb-4 tracking-tighter">{item.title}</h3>
                   <p className="text-xs text-white/30 leading-relaxed tracking-wider font-light">{item.desc}</p>
                </div>
              ))}
           </div>
          </section>

          {/* PARALLAX IMPACT */}
          <section className="parallax-section h-[150vh] flex items-center justify-center overflow-hidden">
             <div className="parallax-content text-center px-6">
                <h2 className="text-6xl md:text-[8vw] font-black tracking-tighter uppercase leading-none italic mb-10 text-white">
                   The End of <br />
                   <span className="text-cyan-500">Resistance.</span>
                </h2>
                <div className="flex justify-center gap-6">
                   <button className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.5em] rounded-full hover:bg-cyan-500 hover:text-white transition-all shadow-2xl">
                      Get Access
                   </button>
                </div>
             </div>
          </section>

          {/* FOOTER */}
          <footer className="py-20 px-10 border-t border-white/5 text-center">
             <div className="flex flex-col md:flex-row justify-between items-center gap-10 opacity-30 text-[9px] uppercase tracking-[1em]">
                <span>System Status: Active</span>
                <div className="text-2xl font-black tracking-tighter italic">Antigravity</div>
                <span>© 2026 Protocol</span>
             </div>
          </footer>
        </div>
      </main>
    </div>
  )
}
