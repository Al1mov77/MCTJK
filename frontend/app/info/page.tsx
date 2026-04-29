'use client'

import { motion } from 'framer-motion'
import { Info, ShieldCheck, Globe, Users, ArrowLeft, Sparkles, Map, Heart } from 'lucide-react'
import Link from 'next/link'

export default function InfoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col p-6 md:p-20 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <header className="mb-40">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-all mb-24 text-[10px] font-semibold uppercase tracking-[0.3em] group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="inline-flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 px-6 py-2 rounded-full mb-12">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-[0.2em]">The MCTJK Manifesto</span>
            </div>
            <h1 className="text-8xl md:text-[12rem] font-semibold tracking-tight uppercase  leading-[0.8] mb-16">
              AGENTIC<br />
              <span className="text-blue-500">LUXURY</span>
            </h1>
            <p className="text-3xl md:text-5xl text-gray-400 font-medium leading-[1.1] tracking-tight max-w-4xl">
              MCTJK is an ecosystem redefining high-end travel through <span className="text-white ">AI-driven intelligence</span> and exclusive human experiences.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        <section className="mt-60 mb-40 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 p-20 md:p-32 rounded-[4rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            <h2 className="text-6xl md:text-8xl font-semibold tracking-tight uppercase  mb-10 relative z-10">Start Your Journey</h2>
            <Link href="/auth/register" className="inline-block bg-white text-black px-16 py-6 rounded-[2rem] font-semibold text-sm uppercase tracking-[0.2em] hover:scale-105 transition-transform relative z-10 shadow-2xl">
              Become a Member
            </Link>
          </motion.div>
        </section>

        <footer className="py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-sm font-semibold">M</div>
            <span className="text-xl font-semibold uppercase tracking-tight ">MCTJK OFFICIAL</span>
          </div>
          <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.3em]">© 2026 MCTJK TECHNOLOGIES INC. ALL RIGHTS RESERVED.</p>
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
      transition={{ delay }}
      viewport={{ once: true }}
      className="p-12 bg-white/5 border border-white/10 rounded-[3.5rem] space-y-10 hover:bg-white/[0.08] transition-all group"
    >
      <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all border border-blue-500/20 group-hover:border-blue-500">
        {icon}
      </div>
      <div>
        <h3 className="text-3xl font-semibold uppercase tracking-tight mb-6 group-hover:text-blue-500 transition-colors">{title}</h3>
        <p className="text-gray-500 font-medium leading-relaxed uppercase  text-[11px]">{desc}</p>
      </div>
    </motion.div>
  )
}
