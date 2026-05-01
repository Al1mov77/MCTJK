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
    <main className="min-h-screen bg-background transition-colors duration-300 font-sans">
      
      {/* ── Luxury Admin Header ── */}
      <header className="fixed top-0 w-full z-[100] bg-background/90 backdrop-blur-lg border-b border-amber-200/20 dark:border-amber-800/20 shadow-lg h-14 md:h-16 flex items-center px-4 md:px-6">
        <div className="container-tech flex justify-between items-center w-full">
           <div className="flex items-center gap-3 md:gap-4">
              <Link href="/" className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-full transition-colors group">
                 <ArrowLeft size={16} className="text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
              </Link>
              <h1 className="text-sm md:text-base font-black tracking-normal flex items-center gap-2">
                 <div className={cn(
                    "w-4 h-4 md:w-5 md:h-5 rounded-sm transition-all duration-300",
                    isDark 
                      ? "bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg" 
                      : "bg-gradient-to-br from-amber-400 to-rose-400 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40"
                 )} />
                 <span className={cn(
                    "bg-clip-text text-transparent transition-all duration-300",
                    isDark 
                      ? "bg-gradient-to-r from-amber-600 to-rose-600" 
                      : "bg-gradient-to-r from-amber-500 to-rose-500"
                 )}>ADMIN CONTROL</span>
              </h1>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={cn(
                 "hidden md:inline-flex items-center gap-1.5 px-3 py-1 ml-2 rounded-full border transition-all duration-300",
                 isDark 
                   ? "bg-gradient-to-r from-amber-900/30 to-rose-900/30 border-amber-700/50" 
                   : "bg-gradient-to-r from-amber-100 to-rose-100 border-amber-200/50 shadow-md shadow-amber-500/20"
              )}>
                 <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                 <span className={cn(
                    "text-[7px] font-black uppercase tracking-widest transition-all duration-300",
                    isDark 
                      ? "text-amber-300" 
                      : "text-amber-700"
                 )}>ELITE ACCESS</span>
              </motion.div>
           </div>
           <div className="flex items-center gap-3 md:gap-4">
              <ThemeToggle />
              <div className={cn(
                 "w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300",
                 isDark 
                   ? "bg-gradient-to-br from-amber-600 to-rose-600 text-white shadow-lg shadow-amber-500/25" 
                   : "bg-gradient-to-br from-amber-400 to-rose-400 text-white shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40"
              )}>
                 <Palette size={14} />
              </div>
           </div>
        </div>
      </header>

      <div className="pt-24 md:pt-32 container-tech px-6 md:px-0">
        
        {/* ── Premium Tabs ── */}
        <div className="flex gap-4 md:gap-8 mb-16 overflow-x-auto pb-4 no-scrollbar">
            {[
            { id: 'bookings', label: 'Bookings', count: bookings.length, icon: CreditCard },
            { id: 'hotels', label: 'Properties', count: hotels.length, icon: Building },
            { id: 'users', label: 'Members', count: users.length, icon: Users },
            { id: 'comments', label: 'Comments', count: comments.length, icon: Bell }
          ].map((tab, i) => (
            <motion.button 
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 h-12 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border shrink-0 flex items-center gap-2",
                activeTab === tab.id 
                  ? cn(
                      "text-white border shadow-lg",
                      isDark 
                        ? "bg-gradient-to-r from-amber-500 to-rose-500 border-amber-500 shadow-amber-500/25" 
                        : "bg-gradient-to-r from-amber-400 to-rose-400 border-amber-400 shadow-amber-400/30 shadow-xl"
                    ) 
                  : cn(
                      "text-muted-foreground hover:border hover:bg",
                      isDark 
                        ? "border-amber-800/30 hover:border-amber-700/50 hover:text-amber-400 hover:bg-amber-950/20" 
                        : "border-amber-200/50 hover:border-amber-300/70 hover:text-amber-600 hover:bg-amber-50/50 shadow-md hover:shadow-lg"
                    )
              )}
            >
              <tab.icon size={14} className={cn(
                "transition-colors",
                activeTab === tab.id 
                  ? "text-white" 
                  : isDark 
                    ? "text-amber-400" 
                    : "text-amber-500"
              )} />
              {tab.label} <span className={cn(
                "ml-2 transition-opacity",
                activeTab === tab.id 
                  ? "opacity-80" 
                  : "opacity-50"
              )}>({tab.count})</span>
            </motion.button>
          ))}
        </div>

        <div className="space-y-12 pb-20">
          {loading ? (
            <div className="py-40 text-center flex flex-col items-center gap-4">
               <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeTab === 'bookings' ? (
            <div className="grid gap-6">
               {bookings.length === 0 ? (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-40 text-center bg-gradient-to-br from-amber-50/20 to-rose-50/20 dark:from-amber-950/10 dark:to-rose-950/10 rounded-3xl border border-amber-200/30 dark:border-amber-800/30">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 flex items-center justify-center border border-amber-200/50 dark:border-amber-700/50">
                       <CreditCard size={32} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter mb-2">No Active Bookings</h3>
                    <p className="text-muted-foreground font-medium max-w-md mx-auto">All luxury bookings are currently managed</p>
                 </motion.div>
               ) : (
               bookings.map((b, i) => (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={b.id} className="relative overflow-hidden bg-gradient-to-br from-background to-muted border border-border rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
                    {/* Luxury Badge */}
                    <div className="absolute top-4 left-4 z-10">
                       <div className={cn(
                          "px-3 py-1 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg",
                          b.status === 'CONFIRMED' ? "bg-gradient-to-r from-green-500 to-emerald-500" : 
                          b.status === 'CANCELLED' ? "bg-gradient-to-r from-red-500 to-rose-500" : 
                          "bg-gradient-to-r from-amber-500 to-orange-500"
                       )}>
                          {b.status}
                       </div>
                    </div>
                    
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                       <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-700/50 group-hover:scale-110 transition-transform duration-300">
                          <HotelIcon size={24} />
                       </div>
                       <div className="flex-1 text-center md:text-left space-y-3">
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                             <h3 className="text-xl md:text-2xl font-black tracking-tighter group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-rose-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{b.room?.hotel?.title}</h3>
                          </div>
                          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                             <span className="flex items-center gap-2 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                                <User size={10} /> {b.user?.name || 'Guest'}
                             </span>
                             <span className="flex items-center gap-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                <Calendar size={10} /> {new Date(b.startDate).toLocaleDateString()}
                             </span>
                             <span className="flex items-center gap-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                                <span className="text-2xl font-black bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">${b.room?.price}</span>
                                <span className="text-[8px]">Session</span>
                             </span>
                          </div>
                       </div>
                       <div className="flex gap-2 w-full md:w-auto">
                          {b.status === 'PENDING' && (
                            <>
                               <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleBookingActionClick(b.id, 'confirm')} 
                                  className="flex-1 h-11 px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-green-500/25 transition-all"
                               >
                                  Approve
                               </motion.button>
                               <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleBookingActionClick(b.id, 'cancel')} 
                                  className="flex-1 h-11 px-6 border border-red-200/50 dark:border-red-800/50 text-red-600 dark:text-red-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                               >
                                  Reject
                               </motion.button>
                            </>
                          )}
                       </div>
                    </div>
                 </motion.div>
               ))
               )}
            </div>
          ) : activeTab === 'hotels' ? (
            <div className="space-y-8">
               <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setEditingHotel(null); setHotelForm({ title: '', city: '', address: '', description: '', images: '', skills: '' }); setShowHotelModal(true); }} 
                  className="w-full h-24 border-2 border-dashed border-amber-300/50 dark:border-amber-700/50 rounded-2xl flex items-center justify-center gap-4 text-amber-600 dark:text-amber-400 hover:border-amber-500 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-all uppercase text-[10px] font-black tracking-widest group"
               >
                  <Plus size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">Add Luxury Property</span>
               </motion.button>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((h, i) => (
                    <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.1 }}
                       key={h.id} 
                       className="relative overflow-hidden bg-gradient-to-br from-background to-muted border border-border rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group"
                    >
                       {/* Luxury Badge */}
                       <div className="absolute top-4 left-4 z-10">
                          <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                             LUXURY
                          </div>
                       </div>
                       
                       <div className="relative aspect-video rounded-t-2xl overflow-hidden">
                          <SafeImage src={h.images?.[0]} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                       </div>
                       
                       <div className="p-6 space-y-4">
                          <h3 className="text-xl font-black tracking-tighter group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-rose-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{h.title}</h3>
                          
                          <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                             <MapPin size={10} className="text-amber-500" />
                             {h.city}
                          </div>
                          
                          <div className="flex gap-2">
                             <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setEditingHotel(h); setHotelForm({ title: h.title, city: h.city, address: h.address, description: h.description, images: h.images?.join('\n') || '', skills: h.skills?.join('\n') || '' }); setShowHotelModal(true); }} 
                                className="flex-1 h-9 bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-[9px] font-black uppercase tracking-widest hover:from-amber-200 hover:to-rose-200 dark:hover:from-amber-800/50 dark:hover:to-rose-800/50 border border-amber-200/50 dark:border-amber-700/50 transition-all"
                             >
                                <Edit size={12} className="inline mr-1" />
                                Edit
                             </motion.button>
                             <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => deleteHotel(h.id)} 
                                className="w-9 h-9 border border-red-200/50 dark:border-red-800/50 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                             >
                                <Trash size={14} />
                             </motion.button>
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
          ) : activeTab === 'comments' ? (
            <div className="grid gap-4">
               {comments.length === 0 ? (
                 <div className="py-20 text-center text-muted-foreground uppercase text-[10px] font-black tracking-widest">No room comments found</div>
               ) : (
                 comments.map((c, i) => (
                   <motion.div 
                     key={c.id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.05 }}
                     className="p-6 bg-muted/30 border border-border rounded-xl flex justify-between items-center group"
                   >
                     <div className="flex items-center gap-6">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white font-black">
                         {c.user?.name?.[0] || 'U'}
                       </div>
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <span className="text-sm font-black">{c.user?.name || 'Anonymous'}</span>
                           <span className="text-[8px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full font-black uppercase tracking-widest">Room: {c.room?.title}</span>
                           <span className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">{c.room?.hotel?.title}</span>
                         </div>
                         <p className="text-xs text-foreground/80">{c.text}</p>
                         <span className="text-[8px] text-muted-foreground uppercase tracking-widest mt-2 block">{new Date(c.createdAt).toLocaleString()}</span>
                       </div>
                     </div>
                     <button 
                       onClick={() => deleteComment(c.id)}
                       className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
                     >
                       <Trash size={16} />
                     </button>
                   </motion.div>
                 ))
               )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {users.map((u, i) => (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={u.id} 
                    className="relative overflow-hidden bg-gradient-to-br from-background to-muted border border-border rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group p-8"
                 >
                    {/* VIP Badge */}
                    {u.isVip && (
                       <div className="absolute top-4 right-4 z-10">
                          <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1">
                             <Crown size={10} />
                             VIP
                          </div>
                       </div>
                    )}
                    
                    <div className="flex flex-col items-center text-center gap-6">
                       <div className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center text-xl font-black border-2 transition-all duration-300",
                          u.isVip 
                            ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white border-yellow-300 shadow-lg group-hover:scale-110" 
                            : "bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-700/50"
                       )}>
                          {u.name?.[0] || u.email?.[0]}
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-lg font-black tracking-tighter group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-rose-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                             {u.name || u.email.split('@')[0]}
                          </h3>
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                             {u.role} · {u.points} Pts
                          </p>
                       </div>
                       <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleVip(u.id, u.isVip)} 
                          className={cn(
                             "w-full h-10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border",
                             u.isVip 
                                ? "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white border-yellow-300 shadow-lg shadow-yellow-500/25" 
                                : "border-amber-200/50 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                          )}
                       >
                          {u.isVip ? (
                             <>
                                <Crown size={12} className="inline mr-1" />
                                VIP Elite Active
                             </>
                          ) : (
                             <>
                                <Award size={12} className="inline mr-1" />
                                Promote to VIP
                             </>
                          )}
                       </motion.button>
                    </div>
                 </motion.div>
               ))}
            </div>
          )}

        </div>
      </div>

      {/* ── Modern Modal ── */}
      <AnimatePresence>
        {showHotelModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHotelModal(false)} className="absolute inset-0 bg-background/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-card border border-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
               <div className="p-8 md:p-12">
                  <header className="flex justify-between items-center mb-10">
                     <h2 className="text-2xl font-black tracking-tighter uppercase">{editingHotel ? 'Edit Property' : 'New Property'}</h2>
                     <button onClick={() => setShowHotelModal(false)} className="p-2 hover:bg-muted rounded-full"><XCircle size={24} /></button>
                  </header>
                  <form onSubmit={handleHotelSubmit} className="space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Title</label>
                           <input value={hotelForm.title} onChange={e => setHotelForm({...hotelForm, title: e.target.value})} className="w-full h-11 bg-muted border border-border rounded-lg px-4 text-sm font-semibold outline-none" required />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">City</label>
                           <input value={hotelForm.city} onChange={e => setHotelForm({...hotelForm, city: e.target.value})} className="w-full h-11 bg-muted border border-border rounded-lg px-4 text-sm font-semibold outline-none" required />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
                        <textarea value={hotelForm.description} onChange={e => setHotelForm({...hotelForm, description: e.target.value})} className="w-full min-h-[100px] bg-muted border border-border rounded-lg p-4 text-sm font-semibold outline-none resize-none" required />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Image URLs (one per line)</label>
                        <textarea value={hotelForm.images} onChange={e => setHotelForm({...hotelForm, images: e.target.value})} className="w-full min-h-[100px] bg-muted border border-border rounded-lg p-4 text-sm font-semibold outline-none resize-none" required />
                     </div>
                     <button type="submit" className="apple-btn w-full h-14 mt-4 shadow-xl">Save Property</button>
                  </form>
               </div>
            </motion.div>
          </div>
        )}

        {/* ── Booking Action Modal ── */}
        {showBookingModal && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBookingModal(false)} className="absolute inset-0 bg-background/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-card border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
               <div className="p-8 md:p-10">
                  <header className="flex justify-between items-center mb-8">
                     <h2 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
                        {bookingToUpdate?.action === 'confirm' ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                        {bookingToUpdate?.action === 'confirm' ? 'Confirm Booking' : 'Reject Booking'}
                     </h2>
                     <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-muted rounded-full"><XCircle size={20} /></button>
                  </header>
                  
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                           {bookingToUpdate?.action === 'confirm' ? 'Personal Message (Optional)' : 'Reason for Rejection'}
                        </label>
                        <textarea 
                           value={bookingReason} 
                           onChange={e => setBookingReason(e.target.value)} 
                           className="w-full min-h-[120px] bg-muted border border-border rounded-xl p-4 text-sm font-semibold outline-none resize-none focus:border-foreground/20 transition-colors" 
                           placeholder={bookingToUpdate?.action === 'confirm' ? "e.g. We are looking forward to seeing you!" : "e.g. Sorry, the room is under maintenance."}
                           required={bookingToUpdate?.action === 'cancel'}
                        />
                     </div>
                     
                     <div className="flex gap-4">
                        <button onClick={() => setShowBookingModal(false)} className="flex-1 h-12 border border-border rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-colors">Cancel</button>
                        <button 
                           onClick={() => bookingToUpdate && updateStatus(bookingToUpdate.id, bookingToUpdate.action, bookingReason)} 
                           className={cn(
                              "flex-[2] h-12 rounded-lg text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-black/10",
                              bookingToUpdate?.action === 'confirm' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                           )}
                        >
                           {bookingToUpdate?.action === 'confirm' ? 'Approve' : 'Reject'}
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
