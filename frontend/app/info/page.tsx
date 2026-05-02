'use client'

import { motion } from 'framer-motion'
import { Info, ShieldCheck, Globe, Users, ArrowLeft, Sparkles, Map, Heart } from 'lucide-react'
import Link from 'next/link'

export default function InfoPage() {
  return (
    <main className="min-h-screen bg-matte-charcoal text-cream flex flex-col p-6 md:p-24 relative overflow-hidden font-sans">
      {/* Decorative Atmosphere */}
      <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[#d4af37]/5 blur-[200px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#d4af37]/5 blur-[200px] rounded-full" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <header className="mb-48">
          <Link href="/" className="inline-flex items-center gap-4 text-[#d4af37]/40 hover:text-[#d4af37] transition-all mb-32 text-[10px] font-bold uppercase tracking-[0.4em] group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Sovereign Home
          </Link>
          
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
            <div className="inline-flex items-center gap-4 bg-[#d4af37]/10 border border-[#d4af37]/20 px-6 py-2 rounded-full mb-16">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-[0.4em]">The MCTJK Manifesto</span>
            </div>
            <h1 className="text-8xl md:text-[14rem] font-black tracking-tighter uppercase leading-[0.75] mb-20 italic">
              AGENTIC<br />
              <span className="text-[#d4af37]">LUXURY</span>
            </h1>
            <p className="text-3xl md:text-6xl text-cream/30 font-light leading-tight tracking-tighter max-w-5xl">
              MCTJK is a digital ecosystem redefining high-end hospitality through <span className="text-cream font-medium">Sovereign Intelligence</span> and exclusive human experiences.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<Globe className="w-8 h-8" />} 
            title="Sovereign Standards" 
            desc="Establishing the definitive benchmark for 5-star hospitality in Central Asia." 
            delay={0.1}
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8" />} 
            title="Ironclad Trust" 
            desc="Military-grade encryption and personal privacy for our elite members." 
            delay={0.2}
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8" />} 
            title="The Guild" 
            desc="An ultra-exclusive network of global leaders and cultural icons." 
            delay={0.3}
          />
          <FeatureCard 
            icon={<Map className="w-8 h-8" />} 
            title="Unmapped Trails" 
            desc="Access to locations and experiences that exist on no other platform." 
            delay={0.4}
          />
          <FeatureCard 
            icon={<Sparkles className="w-8 h-8" />} 
            title="Agentic Concierge" 
            desc="AI that doesn't just respond, but anticipates your every desire." 
            delay={0.5}
          />
          <FeatureCard 
            icon={<Heart className="w-8 h-8" />} 
            title="Human Soul" 
            desc="Deeply personalized service that machines can't replicate." 
            delay={0.6}
          />
        </div>

        <section className="mt-80 mb-60 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#d4af37]/5 blur-[150px] pointer-events-none" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="glass-premium p-24 md:p-40 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-[0.03] mix-blend-overlay group-hover:scale-110 transition-transform duration-[4s]" />
            <h2 className="text-6xl md:text-[10rem] font-black tracking-tighter uppercase mb-16 relative z-10 italic leading-none">Initialize <br/><span className="text-[#d4af37]">Journey</span></h2>
            <Link href="/auth/register" className="btn-sand inline-block px-20 py-8 rounded-sm font-black text-xs uppercase tracking-[0.5em] hover:scale-105 transition-all relative z-10 shadow-2xl">
              Become a Member
            </Link>
          </motion.div>
        </section>

        <footer className="py-32 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-[#d4af37] rounded-sm flex items-center justify-center text-matte-charcoal font-black shadow-2xl">M</div>
            <span className="text-2xl font-black tracking-tighter uppercase text-[#d4af37]">MCTJK OFFICIAL</span>
          </div>
          <p className="text-white/10 text-[9px] font-bold uppercase tracking-[0.5em]">© 2026 MCTJK TECHNOLOGIES INC. SOVEREIGN DATA PROTECTION.</p>
        </footer>
      </div>
    </main>
  )
}

function FeatureCard({ icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      viewport={{ once: true }}
      className="p-16 glass-premium border-white/5 rounded-2xl space-y-12 hover:border-[#d4af37]/30 transition-all duration-700 group shadow-2xl"
    >
      <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center text-[#d4af37]/30 group-hover:text-[#d4af37] group-hover:border-[#d4af37]/30 transition-all duration-700 shadow-2xl">
        {icon}
      </div>
      <div className="space-y-6">
        <h3 className="text-3xl font-bold uppercase tracking-tight text-cream/80 group-hover:text-cream transition-colors">{title}</h3>
        <p className="text-cream/20 font-bold leading-relaxed uppercase text-[10px] tracking-[0.2em] group-hover:text-[#d4af37]/40 transition-colors">{desc}</p>
      </div>
    </motion.div>
  )
}
