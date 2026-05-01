'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Mail, Shield, Crown, Calendar, Settings, LogOut, 
  ChevronRight, MapPin, CreditCard, Bell, Lock, ArrowLeft,
  RefreshCw, CheckCircle2, XCircle, Languages, Edit3, Save, Eye, EyeOff
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SafeImage from '../../components/SafeImage'
import { useLanguage } from '../../lib/LanguageContext'
import { cn } from '../../lib/utils'

export default function ProfilePage() {
  const { lang, setLang, t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [spinnerHistory, setSpinnerHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const router = useRouter()

  // Form states
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    const history = localStorage.getItem('spinner_history')
    
    if (history) setSpinnerHistory(JSON.parse(history))
    
    if (stored && token) {
      const u = JSON.parse(stored)
      setUser(u)
      setName(u.name || u.username)
      fetchBookings(token)
    } else {
      router.push('/auth/login')
    }
    setLoading(false)
  }, [router])

  const fetchBookings = async (token: string) => {
    try {
      const res = await fetch('http://localhost:4000/booking/my', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch (err) {
      console.error("Failed to fetch bookings")
    }
  }

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:4000/users/profile', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, password: password || undefined })
      })
      if (res.ok) {
        const updated = await res.json()
        setUser(updated)
        localStorage.setItem('user', JSON.stringify(updated))
        setEditing(false)
        setShowPasswordForm(false)
        setPassword('')
        setStatusMsg({ type: 'success', text: 'Profile updated successfully' })
        setTimeout(() => setStatusMsg(null), 3000)
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to update profile' })
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Connection error' })
    }
  }

  const cancelBooking = async (id: string) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:4000/booking/${id}/cancel`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: 'User cancelled via profile' })
      })
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b))
        setStatusMsg({ type: 'success', text: 'Booking cancelled' })
        setTimeout(() => setStatusMsg(null), 3000)
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to cancel booking' })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  if (loading || !user) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-outfit selection:bg-amber-500 overflow-x-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-20 pt-32 pb-40 px-6 max-w-6xl mx-auto">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8 md:mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 hover:text-amber-500 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-all" /> {lang === 'ru' ? 'Назад' : 'Back'}
          </Link>
          <div className="flex items-center gap-4 md:gap-6">
             <button onClick={() => setLang(lang === 'ru' ? 'en' : lang === 'en' ? 'tj' : 'ru')} className="bg-white/5 border border-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                <Languages size={12} /> {lang.toUpperCase()}
             </button>
             <button onClick={handleLogout} className="text-white/40 hover:text-red-500 transition-colors">
                <LogOut size={18} />
             </button>
          </div>
        </div>

        {statusMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`fixed top-10 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full border z-[500] text-[10px] font-bold uppercase tracking-widest shadow-2xl ${statusMsg.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'bg-red-500/20 border-red-500/50 text-red-500'}`}>
             {statusMsg.text}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* SIDEBAR: IDENTITY */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 space-y-8">
                 <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative w-full h-full rounded-full bg-black border-2 border-white/10 flex items-center justify-center text-4xl font-bold group-hover:border-amber-500/50 transition-colors">
                       {user.username?.[0].toUpperCase()}
                    </div>
                    {user.isVip && (
                       <div className="absolute -bottom-2 -right-2 bg-amber-500 text-black p-2 rounded-full shadow-2xl border-4 border-[#050505]">
                          <Crown size={16} />
                       </div>
                    )}
                 </div>

                 <div className="text-center space-y-2">
                    {editing ? (
                      <input 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-center text-xl font-bold w-full outline-none focus:border-amber-500 transition-all"
                      />
                    ) : (
                      <h2 className="text-3xl font-bold tracking-tight">{user.name || user.username}</h2>
                    )}
                    <div className="flex items-center justify-center gap-2">
                       {user.role === 'ADMIN' && (
                         <span className="px-3 py-1 bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-full text-[8px] font-black uppercase tracking-widest">Master Terminal</span>
                       )}
                       <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Protocol ID: {user.id.slice(-8)}</span>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/5 space-y-3">
                    {editing ? (
                       <button onClick={handleUpdateProfile} className="w-full py-4 bg-amber-500 text-black rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-600 transition-all">
                          <Save size={14} /> Update Identity
                       </button>
                    ) : (
                       <button onClick={() => setEditing(true)} className="w-full py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all">
                          <Edit3 size={14} /> Modify Protocol
                       </button>
                    )}
                    <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                       {showPasswordForm ? 'Hide Password Settings' : 'Security Clearance'}
                    </button>
                 </div>

                 <AnimatePresence>
                   {showPasswordForm && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4 pt-4 border-t border-white/5">
                        <div className="relative">
                           <input 
                              type={showPass ? "text" : "password"} 
                              placeholder="New Encryption Key" 
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-medium outline-none focus:border-amber-500 transition-all pr-12"
                           />
                           <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
                              {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                           </button>
                        </div>
                        {editing && <p className="text-[8px] uppercase tracking-widest text-white/30 text-center italic">Key will update on save</p>}
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </div>

            {/* STATUS CARDS */}
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] space-y-2">
                  <div className="text-[8px] font-black uppercase tracking-widest text-white/30">Member Status</div>
                  <div className={user.isVip ? "text-amber-500 font-bold" : "text-white font-bold"}>
                    {user.isVip ? 'SOVEREIGN' : 'GUEST'}
                  </div>
               </div>
               <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] space-y-2">
                  <div className="text-[8px] font-black uppercase tracking-widest text-white/30">Neural Points</div>
                  <div className="text-white font-bold">{user.points || 0} PTS</div>
               </div>
            </div>
          </div>

          {/* MAIN CONTENT: HISTORY & REWARDS */}
          <div className="lg:col-span-8 space-y-16">
             
             {/* 1. BOOKING HISTORY */}
             <section className="space-y-6 md:space-y-8">
                <div className="flex justify-between items-end">
                   <h3 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase italic opacity-10">Protocols.</h3>
                   <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-amber-500/60">Booking History</span>
                </div>

                <div className="grid gap-4">
                   {bookings.length === 0 ? (
                     <div className="py-16 md:py-20 text-center border border-white/5 rounded-[2.5rem] md:rounded-[3rem] bg-white/[0.02] text-white/20 uppercase text-[9px] md:text-[10px] font-bold tracking-widest">
                        No protocols initiated yet.
                     </div>
                   ) : (
                     bookings.map((b, i) => (
                       <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={b.id} className="group p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 hover:bg-white/[0.08] transition-all">
                          <div className="flex items-center gap-6 md:gap-8 flex-1 w-full">
                             <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                                <MapPin size={20} />
                             </div>
                             <div className="space-y-1">
                                <div className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-white/20">{b.room?.hotel?.city || 'Location Reserved'}</div>
                                <h4 className="text-lg md:text-xl font-bold tracking-tight">{b.room?.hotel?.title}</h4>
                                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-white/40 pt-1">
                                   <span className="flex items-center gap-1.5"><Calendar size={10}/> {new Date(b.startDate).toLocaleDateString()}</span>
                                   <span className="text-amber-500/80">3 Days</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-none border-white/5">
                             <div className={cn(
                               "px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border",
                               b.status === 'CONFIRMED' ? "bg-green-500/10 border-green-500/20 text-green-500" :
                               b.status === 'CANCELLED' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                               "bg-amber-500/10 border-amber-500/20 text-amber-500"
                             )}>
                                {b.status}
                             </div>
                             {b.status !== 'CANCELLED' && (
                               <button onClick={() => cancelBooking(b.id)} className="p-2.5 md:p-3 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all opacity-40 md:opacity-0 group-hover:opacity-100">
                                  <XCircle size={16} />
                               </button>
                             )}
                          </div>
                       </motion.div>
                     ))
                   )}
                </div>
             </section>

             {/* 2. SPINNER HISTORY (The Reward Section) */}
             <section className="space-y-8">
                <div className="flex justify-between items-end">
                   <h3 className="text-5xl font-bold tracking-tighter uppercase italic opacity-10">Rewards.</h3>
                   <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/60">Wheel History</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {spinnerHistory.length === 0 ? (
                     <div className="col-span-2 py-12 text-center border border-white/5 rounded-[3rem] text-white/10 uppercase text-[9px] font-bold tracking-widest">
                        Spin the wheel to earn sovereign rewards.
                     </div>
                   ) : (
                     spinnerHistory.slice(-4).reverse().map((reward, i) => (
                       <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-6 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="p-4 bg-amber-500 text-black rounded-2xl group-hover:rotate-12 transition-transform shadow-xl shadow-amber-500/20">
                             <RefreshCw size={20} />
                          </div>
                          <div className="space-y-1 relative z-10">
                             <div className="text-[8px] font-black uppercase tracking-widest text-white/30">{reward.date}</div>
                             <div className="text-sm font-bold uppercase tracking-tight">{reward.prize}</div>
                          </div>
                       </div>
                     ))
                   )}
                </div>
                {spinnerHistory.length > 0 && (
                   <p className="text-[8px] text-center uppercase tracking-[0.4em] text-white/20 italic">Rewards are applied automatically during checkout</p>
                )}
             </section>

          </div>
        </div>
      </main>

      <footer className="py-20 px-6 border-t border-white/5 text-center opacity-20">
         <div className="text-[8px] font-black uppercase tracking-[0.8em]">MCTJK // SOVEREIGN PLATFORM // EST-2026</div>
      </footer>
    </div>
  )
}
