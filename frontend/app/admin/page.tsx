'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Calendar, User, Home, CreditCard, ArrowLeft, ShieldCheck, Crown, Plus, Edit, Trash, MapPin, Star, Sun, Moon, LayoutDashboard, MoreVertical, Search, Filter, Settings, Users, Building, TrendingUp, Award, Bell, Palette, Sparkles, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from '../../lib/ThemeContext'
import SafeImage from '../../components/SafeImage'
import { ThemeToggle } from '../../components/ui/theme-toggle'
import { cn } from '../../lib/utils'
import { HotelIcon, ConciergeIcon, StarIcon } from '../../components/HotelIcons'

import { useToast } from '../../lib/ToastContext'
import { useConfirm } from '../../lib/ConfirmContext'

export default function AdminDashboard() {
  const { isDark } = useTheme()
  const { toast } = useToast()
  const { confirm } = useConfirm()
  const [activeTab, setActiveTab] = useState<'bookings' | 'hotels' | 'users' | 'comments'>('bookings')
  const [bookings, setBookings] = useState<any[]>([])
  const [hotels, setHotels] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showHotelModal, setShowHotelModal] = useState(false)
  const [editingHotel, setEditingHotel] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  
  // Booking Action Modal
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingReason, setBookingReason] = useState('')
  const [bookingToUpdate, setBookingToUpdate] = useState<{ id: string, action: 'confirm' | 'cancel' } | null>(null)

  // Hotel form state
  const [hotelForm, setHotelForm] = useState({ title: '', city: '', address: '', description: '', images: '', skills: '' })

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (stored) setUser(JSON.parse(stored))
    
    if (token) {
      loadData(token)
    }
  }, [])

  const loadData = async (token: string) => {
    setLoading(true)
    try {
      const [bRes, hRes, uRes, cRes] = await Promise.all([
        fetch('http://localhost:4000/booking/all', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:4000/hotels'),
        fetch('http://localhost:4000/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:4000/room-comments', { headers: { Authorization: `Bearer ${token}` } })
      ])
      const bData = await bRes.json()
      const hData = await hRes.json()
      const uData = await uRes.json()
      const cData = await cRes.json()
      setBookings(Array.isArray(bData) ? bData : [])
      setHotels(Array.isArray(hData) ? hData : [])
      setUsers(Array.isArray(uData) ? uData : [])
      setComments(Array.isArray(cData) ? cData : [])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, action: 'confirm' | 'cancel', reason?: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    const booking = bookings.find(b => b.id === id)
    if (!booking) return

    try {
      const res = await fetch(`http://localhost:4000/booking/${id}/${action}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason })
      })
      if (res.ok) {
        setBookings(prev => prev.map(b => 
          b.id === id ? { ...b, status: action === 'confirm' ? 'CONFIRMED' : 'CANCELLED' } : b
        ))
        toast(`Booking ${action === 'confirm' ? 'Approved' : 'Cancelled'}`, 'success')
        setShowBookingModal(false)
        setBookingReason('')
        setBookingToUpdate(null)
      } else {
        toast('Failed to update booking', 'error')
      }
    } catch (err) {
      toast('Network error', 'error')
      console.error(err)
    }
  }

  const handleBookingActionClick = (id: string, action: 'confirm' | 'cancel') => {
    setBookingToUpdate({ id, action })
    setBookingReason('')
    setShowBookingModal(true)
  }

  const toggleVip = async (userId: string, currentVip: boolean) => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch(`http://localhost:4000/users/${userId}/vip`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isVip: !currentVip })
      })
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVip: !currentVip } : u))
        toast(`User VIP status updated`, 'success')
      } else {
        toast('Failed to update VIP status', 'error')
      }
    } catch {
      toast('Connection error', 'error')
    }
  }

  const handleHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) return

    const method = editingHotel ? 'PATCH' : 'POST'
    const url = editingHotel ? `http://localhost:4000/hotels/${editingHotel.id}` : 'http://localhost:4000/hotels'

    const payload = {
      ...hotelForm,
      images: hotelForm.images.split('\n').filter(i => i.trim()),
      skills: hotelForm.skills.split('\n').filter(s => s.trim())
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        toast(`Property ${editingHotel ? 'updated' : 'created'} successfully`, 'success')
        setShowHotelModal(false); setEditingHotel(null); loadData(token)
      } else {
        toast('Failed to save property', 'error')
      }
    } catch {
      toast('Connection error', 'error')
    }
  }

  const deleteHotel = async (id: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    const isConfirmed = await confirm({
      title: 'Delete Property',
      message: 'Are you sure you want to permanently delete this luxury property and all associated data?',
      confirmText: 'Delete',
      variant: 'danger'
    })

    if (!isConfirmed) return

    try {
      const res = await fetch(`http://localhost:4000/hotels/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        toast('Property deleted', 'success')
        loadData(token)
      } else {
        toast('Failed to delete property', 'error')
      }
    } catch {
      toast('Connection error', 'error')
    }
  }

  const deleteComment = async (id: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    const isConfirmed = await confirm({
      title: 'Delete Comment',
      message: 'Are you sure you want to remove this comment from the platform?',
      confirmText: 'Delete',
      variant: 'danger'
    })

    if (!isConfirmed) return

    try {
      const res = await fetch(`http://localhost:4000/room-comments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== id))
        toast('Comment deleted', 'success')
      } else {
        toast('Failed to delete comment', 'error')
      }
    } catch {
      toast('Connection error', 'error')
    }
  }

  if (!mounted) return null
  if (user?.role !== 'ADMIN') return (
    <div className="h-screen bg-background flex flex-col items-center justify-center text-center p-8">
      <ShieldCheck className="w-16 h-16 text-muted-foreground mb-6" />
      <h1 className="text-4xl font-black tracking-tighter mb-2">Restricted Access</h1>
      <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-8">Admin Authorization Required</p>
      <Link href="/" className="apple-btn px-10 h-12">Return Home</Link>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#050505] text-cream font-sans selection:bg-[#d4af37] selection:text-black relative">
      {/* Editorial Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#d4af37]/5 blur-[150px] rounded-full" />
      </div>

      <nav className="fixed top-0 w-full z-[100] h-20 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center px-8 md:px-16 justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-5 h-5 bg-[#d4af37] rounded-sm transition-transform group-hover:scale-110 shadow-[0_0_15px_#d4af37]" />
          <span className="text-xl font-bold tracking-tighter text-[#d4af37]">MCTJK</span>
        </Link>
        <div className="flex items-center gap-10">
          <ThemeToggle />
          <div className="hidden md:block text-[9px] font-bold uppercase tracking-[0.5em] text-cream/20">Sovereign Authority</div>
        </div>
      </nav>

      <div className="pt-40 md:pt-56 container-tech px-6 md:px-0 relative z-10">
        <header className="mb-20 space-y-10">
           <div className="flex items-center gap-6 text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.6em]">
              <span className="w-16 h-px bg-[#d4af37]/20" />
              Sovereign Terminal
           </div>
           <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter italic leading-none text-white drop-shadow-2xl">
              Admin <span className="text-[#d4af37]">Command</span>
           </h1>
           <p className="max-w-md text-[8px] md:text-[9px] font-bold uppercase tracking-[0.4em] text-cream/20 leading-relaxed italic">
              Centralized administrative protocol for portfolio management, guest verification, and real-time transaction oversight.
           </p>
        </header>
        
        {/* ── Premium Tabs ── */}
        <div className="flex items-center gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl w-max mb-20">
           {[
             { id: 'bookings', label: 'Bookings', count: bookings.length, icon: Calendar },
             { id: 'hotels', label: 'Properties', count: hotels.length, icon: Building },
             { id: 'users', label: 'Users', count: users.length, icon: Users },
             { id: 'comments', label: 'Feedback', count: comments.length, icon: Bell }
           ].map((tab) => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "px-6 h-11 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 relative overflow-hidden",
                 activeTab === tab.id 
                   ? "text-black" 
                   : "text-cream/30 hover:text-white"
               )}
             >
               {activeTab === tab.id && (
                 <motion.div layoutId="activeTab" className="absolute inset-0 bg-[#d4af37]" />
               )}
               <span className="relative z-10 flex items-center gap-3">
                 <tab.icon size={14} />
                 {tab.label}
                 <span className={cn("opacity-40 text-[8px]", activeTab === tab.id ? "text-black/60" : "")}>{tab.count}</span>
               </span>
             </button>
           ))}
        </div>

        <div className="space-y-12 pb-32">
          {loading ? (
            <div className="py-40 text-center flex flex-col items-center gap-6">
               <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]/40">Synchronizing Data...</span>
            </div>
          ) : activeTab === 'bookings' ? (
            <div className="grid gap-6">
               {bookings.length === 0 ? (
                 <div className="py-32 text-center glass-premium rounded-xl border border-dashed border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-cream/10 italic">No Active Bookings</p>
                 </div>
               ) : (
               bookings.map((b, i) => (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={b.id} className="glass-premium border-white/5 rounded-xl shadow-xl overflow-hidden hover:border-[#d4af37]/20 transition-all duration-500">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                       <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-lg flex items-center justify-center text-[#d4af37]/40 shrink-0">
                          <HotelIcon size={24} />
                       </div>
                       <div className="flex-1 text-center md:text-left space-y-2">
                          <h3 className="text-xl font-bold tracking-tight text-cream uppercase italic">{b.room?.hotel?.title}</h3>
                          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[9px] font-bold text-cream/30 uppercase tracking-widest">
                             <span className="flex items-center gap-2"><User size={12} /> {b.user?.name}</span>
                             <span className="flex items-center gap-2"><Calendar size={12} /> {new Date(b.startDate).toLocaleDateString()}</span>
                             <span className="text-[#d4af37]">${b.room?.price} Total</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className={cn(
                             "px-3 py-1 text-[8px] font-bold uppercase tracking-widest rounded-sm",
                             b.status === 'CONFIRMED' ? "bg-green-500/10 text-green-500" : 
                             b.status === 'CANCELLED' ? "bg-red-500/10 text-red-500" : 
                             "bg-[#d4af37]/10 text-[#d4af37]"
                          )}>
                             {b.status}
                          </div>
                          {b.status === 'PENDING' && (
                             <div className="flex gap-2">
                                <button onClick={() => handleBookingActionClick(b.id, 'confirm')} className="h-10 px-4 bg-green-500 text-matte-charcoal rounded-sm text-[9px] font-bold uppercase tracking-widest hover:bg-green-600 transition-all">Approve</button>
                                <button onClick={() => handleBookingActionClick(b.id, 'cancel')} className="h-10 px-4 bg-red-500 text-matte-charcoal rounded-sm text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all">Reject</button>
                             </div>
                          )}
                       </div>
                    </div>
                 </motion.div>
               ))
               )}
            </div>
          ) : activeTab === 'hotels' ? (
            <div className="space-y-8">
               <button onClick={() => { setEditingHotel(null); setHotelForm({ title: '', city: '', address: '', description: '', images: '', skills: '' }); setShowHotelModal(true); }} className="w-full h-24 border border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 text-cream/20 hover:text-[#d4af37] hover:border-[#d4af37]/20 transition-all">
                  <Plus size={24} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Add New Property</span>
               </button>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {hotels.map((h, i) => (
                    <div key={h.id} className="glass-premium border-white/5 rounded-xl overflow-hidden hover:border-[#d4af37]/20 transition-all duration-500 flex flex-col">
                       <div className="relative aspect-video overflow-hidden">
                          <SafeImage src={h.images?.[0]} fill className="object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
                       </div>
                       <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                          <div className="space-y-1">
                             <h3 className="text-lg font-bold tracking-tight text-cream uppercase italic">{h.title}</h3>
                             <div className="flex items-center gap-2 text-[8px] font-bold text-cream/20 uppercase tracking-widest">
                                <MapPin size={10} /> {h.city}
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => { setEditingHotel(h); setHotelForm({ title: h.title, city: h.city, address: h.address, description: h.description, images: h.images?.join('\n') || '', skills: h.skills?.join('\n') || '' }); setShowHotelModal(true); }} className="flex-1 h-9 bg-white/5 text-cream/60 rounded-sm text-[8px] font-bold uppercase tracking-widest hover:text-[#d4af37] transition-all">Edit</button>
                             <button onClick={() => deleteHotel(h.id)} className="w-9 h-9 border border-red-500/10 text-red-500/20 rounded-sm flex items-center justify-center hover:bg-red-500 hover:text-matte-charcoal transition-all"><Trash size={14} /></button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ) : activeTab === 'comments' ? (
            <div className="grid gap-4">
               {comments.length === 0 ? (
                 <div className="py-32 text-center text-cream/10 uppercase text-[9px] font-bold tracking-[0.4em] glass-premium rounded-xl border border-dashed border-white/5">No feedback entries</div>
               ) : (
                 comments.map((c, i) => (
                   <div key={c.id} className="p-6 glass-premium border-white/5 rounded-xl flex justify-between items-center group hover:border-[#d4af37]/20 transition-all duration-500">
                     <div className="flex items-center gap-6">
                       <div className="w-10 h-10 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] font-bold text-sm">
                         {c.user?.name?.[0] || 'S'}
                       </div>
                       <div className="space-y-1">
                         <div className="flex items-center gap-3">
                           <span className="text-xs font-bold text-cream uppercase">{c.user?.name}</span>
                           <span className="text-[7px] text-[#d4af37]/40 uppercase tracking-widest">@{c.room?.hotel?.title}</span>
                         </div>
                         <p className="text-sm text-cream/50 font-light">{c.text}</p>
                       </div>
                     </div>
                     <button onClick={() => deleteComment(c.id)} className="p-2 text-red-500/10 hover:text-red-500 transition-all"><Trash size={18} /></button>
                   </div>
                 ))
               )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {users.map((u, i) => (
                 <div key={u.id} className="glass-premium border-white/5 rounded-xl p-8 flex flex-col items-center text-center gap-6 hover:border-[#d4af37]/20 transition-all">
                    <div className={cn(
                       "w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border transition-all",
                       u.isVip ? "bg-[#d4af37] text-matte-charcoal border-[#d4af37]" : "bg-white/5 border-white/5 text-cream/20"
                    )}>
                       {u.name?.[0] || u.email?.[0]}
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-lg font-bold text-cream uppercase italic">{u.name || u.email.split('@')[0]}</h3>
                       <p className="text-[8px] font-bold text-cream/10 uppercase tracking-widest">{u.role} // {u.points} PTS</p>
                    </div>
                    <button onClick={() => toggleVip(u.id, u.isVip)} className={cn(
                       "w-full h-10 rounded-sm text-[8px] font-bold uppercase tracking-widest border transition-all",
                       u.isVip ? "bg-[#d4af37] text-matte-charcoal border-[#d4af37]" : "bg-white/5 border-white/5 text-cream/40 hover:text-[#d4af37]"
                    )}>
                       {u.isVip ? 'Revoke VIP Status' : 'Grant VIP Status'}
                    </button>
                 </div>
               ))}
            </div>
          )}

        </div>
      </div>

      {/* ── Modern Modal ── */}
      <AnimatePresence mode="wait">
        {showHotelModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHotelModal(false)} className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md" />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.95, y: 20 }} 
               className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
            >
               <div className="p-8 md:p-10 space-y-10">
                  <header className="flex justify-between items-center">
                     <div className="space-y-1">
                        <h2 className="text-xl font-bold tracking-tight uppercase italic text-[#d4af37]">
                           {editingHotel ? 'Edit Property' : 'New Property'}
                        </h2>
                        <div className="h-0.5 w-12 bg-[#d4af37]/30" />
                     </div>
                     <button onClick={() => setShowHotelModal(false)} className="p-2 text-cream/20 hover:text-white transition-colors"><XCircle size={24} /></button>
                  </header>

                  <form onSubmit={handleHotelSubmit} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[9px] font-bold uppercase tracking-widest text-cream/30 ml-1">Title</label>
                           <input value={hotelForm.title} onChange={e => setHotelForm({...hotelForm, title: e.target.value})} className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-4 py-3 text-xs font-medium text-cream outline-none focus:border-[#d4af37]/30 transition-all" placeholder="E.g. Royal Palace" required />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-bold uppercase tracking-widest text-cream/30 ml-1">City</label>
                           <input value={hotelForm.city} onChange={e => setHotelForm({...hotelForm, city: e.target.value})} className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-4 py-3 text-xs font-medium text-cream outline-none focus:border-[#d4af37]/30 transition-all" placeholder="E.g. Dubai" required />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-cream/30 ml-1">Description</label>
                        <textarea value={hotelForm.description} onChange={e => setHotelForm({...hotelForm, description: e.target.value})} className="w-full min-h-[100px] bg-white/[0.03] border border-white/5 rounded-lg p-4 text-xs font-medium text-cream outline-none focus:border-[#d4af37]/30 transition-all resize-none" placeholder="Property overview..." required />
                     </div>

                     <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-cream/30 ml-1">Image URLs (one per line)</label>
                        <textarea value={hotelForm.images} onChange={e => setHotelForm({...hotelForm, images: e.target.value})} className="w-full min-h-[100px] bg-white/[0.03] border border-white/5 rounded-lg p-4 text-xs font-mono text-cream/60 outline-none focus:border-[#d4af37]/30 transition-all resize-none" placeholder="https://..." required />
                     </div>

                     <button type="submit" className="w-full h-14 btn-sand rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-xl">
                        {editingHotel ? 'Save Changes' : 'Initialize Property'}
                     </button>
                  </form>
               </div>
            </motion.div>
          </div>
        )}

        {showBookingModal && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBookingModal(false)} className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md" />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} 
               animate={{ opacity: 1, scale: 1 }} 
               exit={{ opacity: 0, scale: 0.95 }} 
               className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
               <div className="p-8 md:p-10 space-y-8">
                  <header className="flex justify-between items-center">
                     <div className="flex items-center gap-4">
                        <div className={cn(
                           "p-3 rounded-lg",
                           bookingToUpdate?.action === 'confirm' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                           {bookingToUpdate?.action === 'confirm' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                        </div>
                        <h2 className="text-lg font-bold tracking-tight uppercase italic text-cream">
                           {bookingToUpdate?.action === 'confirm' ? 'Confirm Booking' : 'Reject Booking'}
                        </h2>
                     </div>
                     <button onClick={() => setShowBookingModal(false)} className="text-cream/20 hover:text-white transition-colors"><XCircle size={20} /></button>
                  </header>
                  
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-cream/30 ml-1">
                           {bookingToUpdate?.action === 'confirm' ? 'Note to Guest (Optional)' : 'Rejection Reason'}
                        </label>
                        <textarea 
                           value={bookingReason} 
                           onChange={e => setBookingReason(e.target.value)} 
                           className="w-full min-h-[120px] bg-white/[0.03] border border-white/5 rounded-lg p-4 text-xs font-medium text-cream outline-none focus:border-[#d4af37]/30 transition-all resize-none" 
                           placeholder={bookingToUpdate?.action === 'confirm' ? "e.g. Welcome to MCTJK." : "e.g. Room maintenance active."}
                           required={bookingToUpdate?.action === 'cancel'}
                        />
                     </div>
                     
                     <div className="flex gap-4">
                        <button onClick={() => setShowBookingModal(false)} className="flex-1 h-12 bg-white/5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-cream/40 hover:bg-white/10 transition-all">Cancel</button>
                        <button 
                           onClick={() => bookingToUpdate && updateStatus(bookingToUpdate.id, bookingToUpdate.action, bookingReason)} 
                           className={cn(
                              "flex-[2] h-12 rounded-lg text-[9px] font-bold uppercase tracking-widest text-matte-charcoal transition-all",
                              bookingToUpdate?.action === 'confirm' ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                           )}
                        >
                           {bookingToUpdate?.action === 'confirm' ? 'Confirm Access' : 'Reject Access'}
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
