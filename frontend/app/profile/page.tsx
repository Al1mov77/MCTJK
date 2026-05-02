'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Crown, Calendar, LogOut, 
  MapPin, ArrowLeft, Languages, Edit3, Save, Eye, EyeOff, XCircle, RefreshCw, Shield, Ticket
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../lib/LanguageContext'
import { useTheme } from '../../lib/ThemeContext'
import { cn } from '../../lib/utils'
import { ThemeToggle } from '../../components/ui/theme-toggle'

export default function ProfilePage() {
  const { lang, setLang, t } = useLanguage()
  const { isDark } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const router = useRouter()

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (stored && token) {
      fetchProfile(token)
      fetchBookings(token)
    } else {
      router.push('/auth/login')
    }
    setLoading(false)
  }, [router])

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch('http://localhost:4000/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        setName(data.name || data.username)
        localStorage.setItem('user', JSON.stringify(data))
      }
    } catch {}
  }

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
        setStatusMsg({ type: 'success', text: 'Profile updated' })
        setTimeout(() => setStatusMsg(null), 3000)
      } else {
        setStatusMsg({ type: 'error', text: 'Update failed' })
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Network error' })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  if (loading || !user) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-gold/20 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full" />
      </div>

      <nav className="fixed top-0 w-full z-[100] h-16 px-6 md:px-12 flex items-center justify-between bg-background/20 backdrop-blur-md border-b border-border">
        <Link href="/" className="text-lg font-bold tracking-tighter text-gold flex items-center gap-2.5">
          <div className="w-4 h-4 bg-gold rounded-sm shadow-[0_0_10px_#d4af37]" />
          MCTJK
        </Link>
        <div className="flex items-center gap-6">
           <ThemeToggle />
           <button onClick={() => setLang(lang === 'ru' ? 'en' : lang === 'en' ? 'tj' : 'ru')} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors">{lang.toUpperCase()}</button>
           <button onClick={handleLogout} className="text-muted-foreground hover:text-red-500 transition-colors">
              <LogOut size={18} />
           </button>
        </div>
      </nav>

      <main className="relative z-20 pt-28 pb-32 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          
          {/* Identity Column */}
          <div className="lg:col-span-4 space-y-10">
             <div className="bg-card border border-border p-10 rounded-2xl shadow-xl text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-3xl rounded-full" />
                
                <div className="relative w-32 h-32 mx-auto">
                   <div className="w-full h-full rounded-full bg-muted border border-border flex items-center justify-center text-4xl font-bold text-foreground overflow-hidden">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name?.[0].toUpperCase()}
                   </div>
                   {user.isVip && (
                      <div className="absolute -bottom-1 -right-1 bg-gold text-black p-2 rounded-full shadow-lg">
                         <Crown size={16} />
                      </div>
                   )}
                </div>

                <div className="space-y-4">
                   {editing ? (
                     <input 
                       value={name} 
                       onChange={e => setName(e.target.value)}
                       className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-center text-xl font-bold outline-none focus:border-gold/30"
                     />
                   ) : (
                     <h2 className="text-3xl font-bold tracking-tight text-foreground uppercase">{user.name || user.username}</h2>
                   )}
                   <div className="flex flex-col items-center gap-2">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Sovereign Protocol User</span>
                      <span className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] font-mono">#{user.id.slice(-8).toUpperCase()}</span>
                   </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col gap-3">
                   {editing ? (
                      <button onClick={handleUpdateProfile} className="h-11 bg-gold text-black rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all">
                         <Save size={14} /> Save Profile
                      </button>
                   ) : (
                      <button onClick={() => setEditing(true)} className="h-11 bg-muted border border-border text-foreground/60 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-gold/30 hover:text-gold transition-all">
                         <Edit3 size={14} /> Edit Identity
                      </button>
                   )}
                </div>
             </div>

             {/* VIP Perks */}
             {user.isVip && user.coupons?.length > 0 && (
                <div className="bg-gold/5 border border-gold/20 p-8 rounded-2xl space-y-6">
                   <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">VIP Rewards</h4>
                      <Ticket size={16} className="text-gold" />
                   </div>
                   <div className="space-y-4">
                      {user.coupons.map((coupon: any) => (
                         <div key={coupon.id} className="p-4 bg-background border border-gold/10 rounded-xl flex items-center justify-between group hover:border-gold/40 transition-all">
                            <div className="space-y-1">
                               <div className="text-lg font-black text-foreground">{coupon.discount}% <span className="text-[8px] text-gold uppercase">OFF</span></div>
                               <div className="text-[7px] text-muted-foreground uppercase tracking-widest">Buffer Discount Voucher</div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-[8px] font-black text-gold group-hover:bg-gold group-hover:text-black transition-all uppercase">
                               Active
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             <div className="grid grid-cols-1 gap-4">
                <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between group">
                   <div className="space-y-1">
                      <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Authority</div>
                      <div className={cn("text-sm font-bold uppercase", user.isVip ? "text-gold" : "text-muted-foreground/40")}>
                         {user.isVip ? 'Sovereign Elite' : 'Verified Guest'}
                      </div>
                   </div>
                   <Shield size={24} className="text-muted-foreground/10 group-hover:text-gold/20 transition-colors" />
                </div>
                <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between group">
                   <div className="space-y-1">
                      <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Neural Balance</div>
                      <div className="text-xl font-bold text-foreground">{(user.points || 0).toLocaleString()} <span className="text-[8px] text-gold">PTS</span></div>
                   </div>
                   <RefreshCw size={24} className="text-muted-foreground/10 group-hover:text-gold/20 transition-colors" />
                </div>
             </div>
          </div>

          {/* Activity Column */}
          <div className="lg:col-span-8 space-y-16">
             <section className="space-y-8">
                <div className="flex justify-between items-end pb-4 border-b border-border">
                   <h3 className="text-3xl font-bold tracking-tighter uppercase text-foreground/20 italic">Protocols</h3>
                   <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">Active transmissions</span>
                </div>

                <div className="grid gap-4">
                   {bookings.length === 0 ? (
                     <div className="py-20 text-center border border-dashed border-border rounded-2xl text-muted-foreground/20 uppercase text-[9px] font-bold tracking-widest">
                        No active protocol transmissions.
                     </div>
                   ) : (
                     bookings.map((b) => (
                       <div key={b.id} className="p-6 bg-card border border-border rounded-2xl flex items-center justify-between gap-6 hover:border-gold/20 transition-all shadow-sm">
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-muted-foreground/40 shrink-0">
                                <MapPin size={20} />
                             </div>
                             <div className="space-y-1">
                                <h4 className="text-lg font-bold text-foreground uppercase tracking-tight">{b.room?.hotel?.title}</h4>
                                <div className="flex items-center gap-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                   <span>{new Date(b.startDate).toLocaleDateString()}</span>
                                   <span className={cn(
                                      "px-2 py-0.5 rounded-full text-[7px] border",
                                      b.status === 'CONFIRMED' ? "bg-green-500/10 border-green-500/20 text-green-600" :
                                      b.status === 'CANCELLED' ? "bg-red-500/10 border-red-500/20 text-red-600" :
                                      "bg-gold/10 border-gold/20 text-gold"
                                   )}>
                                      {b.status}
                                   </span>
                                </div>
                             </div>
                          </div>
                          <Link href={`/hotels/${b.room?.hotel?.id}`} className="text-[8px] font-bold uppercase tracking-widest text-gold hover:underline">View</Link>
                       </div>
                     ))
                   )}
                </div>
             </section>
          </div>
        </div>
      </main>

      {statusMsg && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 px-8 py-3 bg-foreground text-background rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl z-[500]">
           {statusMsg.text}
        </motion.div>
      )}
    </div>
  )
}
