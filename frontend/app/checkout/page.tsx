'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '../../lib/LanguageContext'
import { useTheme } from '../../lib/ThemeContext'
import { ThemeToggle } from '../../components/ui/theme-toggle'
import SafeImage from '../../components/SafeImage'
import { useToast } from '../../lib/ToastContext'
import { cn } from '../../lib/utils'
import { 
  CreditCard, ShieldCheck, Lock, ChevronLeft, 
  Tag, Info, CheckCircle2, Calendar, MapPin 
} from 'lucide-react'

function CheckoutContent() {
  const { lang, t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')
  
  const [loading, setLoading] = useState(false)
  const [room, setRoom] = useState<any>(null)
  const [spinnerHistory, setSpinnerHistory] = useState<any[]>([])
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null)
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' })

  useEffect(() => {
    if (!roomId) router.push('/hotels')
    const token = localStorage.getItem('token')
    if (!token) router.push('/auth/login')

    // Fetch room details
    fetch(`http://localhost:4000/rooms/${roomId}`)
      .then(res => res.json())
      .then(data => setRoom(data))
      .catch(() => setRoom(null))

    // Get spinner discounts
    const history = JSON.parse(localStorage.getItem('spinner_history') || '[]')
    setSpinnerHistory(history.filter((h: any) => typeof h.value === 'number' && h.value > 0 && !h.used))
  }, [roomId, router])

  const totalPrice = room ? room.price * 3 : 0
  const discountAmount = selectedDiscount ? (totalPrice * selectedDiscount.value) / 100 : 0
  const finalPrice = totalPrice - discountAmount

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem('token')

    try {
      const res = await fetch('http://localhost:4000/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          roomId,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 86400000 * 3).toISOString()
        })
      })

      if (res.ok) {
        // Mark discount as used
        if (selectedDiscount) {
          const history = JSON.parse(localStorage.getItem('spinner_history') || '[]')
          const updatedHistory = history.map((h: any) => 
            (h.date === selectedDiscount.date && h.prize === selectedDiscount.prize) ? { ...h, used: true } : h
          )
          localStorage.setItem('spinner_history', JSON.stringify(updatedHistory))
        }

        toast(lang === 'ru' ? 'Платеж обработан! Ожидайте подтверждения админом.' : 'Payment processed! Awaiting admin approval.', 'success')
        router.push('/profile')
      } else {
        const errData = await res.json()
        toast(errData.message || 'Booking Failed', 'error')
      }
    } catch (e) {
      toast('Network error', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!room) return <div className="h-screen flex items-center justify-center font-black uppercase tracking-[1em] text-white/10">Synchronizing...</div>

  return (
    <div className="container-tech min-h-screen py-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      <div className="lg:col-span-7 space-y-8">
        <header className="space-y-4">
           <Link href={`/hotels`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
              <ChevronLeft size={14} /> {lang === 'ru' ? 'Назад' : 'Back'}
           </Link>
           <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase italic">Secure.</h1>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Protocol Authorization Required</p>
        </header>

        <form onSubmit={handlePay} className="p-6 md:p-12 bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] backdrop-blur-3xl space-y-6 md:space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
              <ShieldCheck size={120} />
           </div>

           <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Cardholder Name</label>
                 <input 
                   required
                   value={card.name} 
                   onChange={e => setCard({...card, name: e.target.value})}
                   className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold uppercase tracking-widest outline-none focus:border-amber-500 transition-all text-sm"
                   placeholder="IDENTITY NAME"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Card Number</label>
                 <div className="relative">
                    <input 
                      required
                      value={card.number} 
                      onChange={e => setCard({...card, number: e.target.value})}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-mono tracking-[0.3em] outline-none focus:border-amber-500 transition-all text-sm"
                      placeholder="•••• •••• •••• ••••"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20">
                       <CreditCard size={18} />
                    </div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Expiry</label>
                    <input 
                      required
                      value={card.expiry} 
                      onChange={e => setCard({...card, expiry: e.target.value})}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold outline-none focus:border-amber-500 transition-all text-sm"
                      placeholder="MM / YY"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">CVC</label>
                    <input 
                      required
                      value={card.cvc} 
                      onChange={e => setCard({...card, cvc: e.target.value})}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold outline-none focus:border-amber-500 transition-all text-sm pr-12"
                      placeholder="•••"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 group">
                       <Lock size={16} />
                    </div>
                 </div>
              </div>
           </div>

           <button 
             disabled={loading}
             type="submit" 
             className="w-full h-16 bg-white text-black rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-amber-500 hover:text-white transition-all disabled:opacity-50 active:scale-95"
           >
             {loading ? 'Processing Protocol...' : 'Finalize Payment'}
           </button>
        </form>
      </div>

      <div className="lg:col-span-5 space-y-8">
         <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-2xl space-y-8">
            <div className="space-y-6">
               <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10">
                  <SafeImage src={room.hotel?.images?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"} fill className="object-cover opacity-80" />
                  <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                     <span className="text-[8px] font-black uppercase tracking-widest text-amber-500">{room.hotel?.city}</span>
                  </div>
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight uppercase leading-none">{room.hotel?.title}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{room.title}</p>
               </div>
            </div>

            <div className="pt-8 border-t border-white/5 space-y-4">
               <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                  <span className="text-white/40">Duration</span>
                  <span className="text-white flex items-center gap-2"><Calendar size={12} className="text-amber-500" /> 3 Days</span>
               </div>
               <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                  <span className="text-white/40">Base Price</span>
                  <span className="text-white">${totalPrice}</span>
               </div>
            </div>

            {/* DISCOUNT SELECTOR */}
            <div className="pt-8 border-t border-white/5 space-y-4">
               <label className="text-[9px] font-black uppercase tracking-widest text-amber-500/60 block">Neural Rewards Available</label>
               {spinnerHistory.length === 0 ? (
                  <div className="text-[9px] uppercase tracking-widest text-white/20 italic">No discounts earned in spinner</div>
               ) : (
                  <div className="grid gap-2">
                     {spinnerHistory.map((h, i) => (
                        <button 
                          key={i}
                          onClick={() => setSelectedDiscount(selectedDiscount?.date === h.date ? null : h)}
                          className={cn(
                             "w-full p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all",
                             selectedDiscount?.date === h.date 
                                ? "bg-amber-500 text-black border-amber-500" 
                                : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                          )}
                        >
                           <span className="flex items-center gap-2"><Tag size={12} /> {h.prize}</span>
                           {selectedDiscount?.date === h.date && <CheckCircle2 size={14} />}
                        </button>
                     ))}
                  </div>
               )}
            </div>

            <div className="pt-8 border-t border-white/5">
               <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-black uppercase tracking-widest">Grand Total</span>
                  <div className="text-right">
                     {selectedDiscount && <div className="text-[10px] text-amber-500 line-through opacity-40">${totalPrice}</div>}
                     <div className="text-3xl font-bold tracking-tighter text-white">${finalPrice}</div>
                  </div>
               </div>
            </div>
         </div>

         <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2.5rem] flex items-start gap-4">
            <div className="p-2 bg-amber-500 text-black rounded-lg shrink-0">
               <Info size={16} />
            </div>
            <p className="text-[9px] font-medium uppercase leading-relaxed tracking-widest text-amber-500/80">
               All bookings are subject to admin approval. Cancellations are permanent and will release the neural slot to other guests immediately.
            </p>
         </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white transition-colors duration-300 overflow-x-hidden font-outfit">
      <Suspense fallback={<div className="h-screen flex items-center justify-center font-black uppercase tracking-widest">Loading Gateway...</div>}>
        <CheckoutContent />
      </Suspense>
    </main>
  )
}
