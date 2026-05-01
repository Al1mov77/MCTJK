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
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="relative group">
          {/* Card Border Glow */}
          <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-[2.5rem] pointer-events-none" />
          
          <div className="bg-[#0A0A0A]/80 backdrop-blur-3xl p-10 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
            
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-black mx-auto mb-8 shadow-[0_0_30px_rgba(245,158,11,0.3)] relative group-hover:scale-110 transition-transform duration-500"
              >
                <ShieldCheck size={32} strokeWidth={2.5} />
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
              
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 rounded-full border border-amber-200/50 dark:border-amber-700/50 mb-6">
                 <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                 <span className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">Premium Member Access</span>
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white tracking-tight mb-3">
                 <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">Elite Access</span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]">Secure Luxury Member Portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs font-bold text-center mb-4"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1 tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:bg-white/[0.06] focus:border-amber-500/50 transition-all outline-none text-sm font-medium placeholder:text-zinc-700"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Password</label>
                  <button type="button" className="text-[9px] font-bold uppercase text-amber-500/70 hover:text-amber-500 transition-colors tracking-widest">Forgot?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:bg-white/[0.06] focus:border-amber-500/50 transition-all outline-none text-sm font-medium placeholder:text-zinc-700"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 group shadow-lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-xs">Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
              <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
                Don't have an account? {' '}
                <Link href="/auth/register" className="text-white hover:text-amber-500 transition-colors">
                  Register
                </Link>
              </p>
              
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                <HotelIcon width={12} height={12} className="text-amber-500" />
                <span>Luxury Hotels Await</span>
              </div>
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
