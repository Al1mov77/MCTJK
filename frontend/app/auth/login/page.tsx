'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, ArrowRight, LogIn, ShieldCheck, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { HotelIcon } from '../../../components/HotelIcons'

import { useToast } from '../../../lib/ToastContext'

function LoginContent() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const e = searchParams.get('email')
    const p = searchParams.get('password')
    if (e) setEmail(e)
    if (p) setPassword(p)
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await res.json()
      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        toast(`Welcome back, ${data.user.name}`, 'success')
        router.push('/hotels')
      } else {
        const msg = data.message || 'Authentication failed'
        setError(msg)
        toast(msg, 'error')
      }
    } catch (err) {
      const msg = 'Connection refused. Please check if the server is running.'
      setError(msg)
      toast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* ── Luxury Atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#d4af3715_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="glass-premium p-10 md:p-12 rounded-[2.5rem] border-white/5 relative overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <Link href="/" className="inline-block text-2xl font-bold tracking-tighter text-cream mb-8">MCTJK</Link>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase italic leading-none text-white">
               Access <br/> <span className="text-[#d4af37]">Portal</span>
            </h1>
            <div className="h-px w-12 bg-[#d4af37]/30 mx-auto mt-6" />
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-[10px] font-bold text-center tracking-widest uppercase"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase text-cream/20 ml-1 tracking-[0.3em]">Identification</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/10 group-focus-within:text-[#d4af37] transition-colors" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-cream focus:bg-white/[0.04] focus:border-[#d4af37]/30 transition-all outline-none text-sm font-medium placeholder:text-white/5"
                  placeholder="name@nexus.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] font-bold uppercase text-cream/20 tracking-[0.3em]">Secret Key</label>
                <button type="button" className="text-[8px] font-bold uppercase text-[#d4af37]/40 hover:text-[#d4af37] transition-colors tracking-widest">Recovery</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/10 group-focus-within:text-[#d4af37] transition-colors" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-cream focus:bg-white/[0.04] focus:border-[#d4af37]/30 transition-all outline-none text-sm font-medium placeholder:text-white/5"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-white text-black hover:bg-[#d4af37] hover:text-white rounded-2xl font-bold transition-all disabled:opacity-50 mt-8 flex items-center justify-center gap-3 shadow-xl group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="uppercase tracking-[0.2em] text-[10px] font-black">Initialize Session</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center space-y-6">
            <p className="text-cream/20 font-bold text-[9px] uppercase tracking-[0.2em]">
              New Subject? {' '}
              <Link href="/auth/register" className="text-[#d4af37] hover:text-white transition-colors">
                Apply for Access
              </Link>
            </p>
            
            <div className="flex items-center justify-center gap-3 text-[8px] font-bold text-white/10 uppercase tracking-[0.4em]">
               <div className="w-1 h-1 bg-green-500/40 rounded-full animate-pulse" />
               <span>Sovereign Security Protocol</span>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
