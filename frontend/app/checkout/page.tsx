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

    fetch(`http://localhost:4000/rooms/${roomId}`)
      .then(res => res.json())
      .then(data => setRoom(data))
      .catch(() => setRoom(null))

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
        if (selectedDiscount) {
          const history = JSON.parse(localStorage.getItem('spinner_history') || '[]')
          const updatedHistory = history.map((h: any) => 
            (h.date === selectedDiscount.date && h.prize === selectedDiscount.prize) ? { ...h, used: true } : h
          )
          localStorage.setItem('spinner_history', JSON.stringify(updatedHistory))
        }

        toast(lang === 'ru' ? 'Payment processed! Awaiting approval.' : 'Payment processed! Awaiting admin approval.', 'success')
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

  if (!room) return <div className="h-screen bg-matte-charcoal flex items-center justify-center font-bold uppercase tracking-[0.5em] text-[#d4af37]/20 animate-pulse">Initializing Gateway...</div>

  return (
    <div className="container-tech min-h-screen py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#d4af37]/5 blur-[120px] rounded-full" />
      </div>

      <div className="lg:col-span-7 space-y-12 relative z-10">
        <header className="space-y-6">
           <Link href={`/hotels`} className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]/40 hover:text-[#d4af37] transition-all">
              <ChevronLeft size={16} /> {lang === 'ru' ? 'Back to Collection' : 'Back to Collection'}
           </Link>
           <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-cream">
              Secure <span className="text-[#d4af37]">Protocol.</span>
           </h1>
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4af37]/20">Sovereign Authorization Required</p>
        </header>

        <form onSubmit={handlePay} className="glass-premium p-10 md:p-16 rounded-2xl shadow-2xl space-y-10">
           <div className="space-y-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]/40 ml-1">Cardholder Entity</label>
                 <input 
                   required
                   value={card.name} 
                   onChange={e => setCard({...card, name: e.target.value})}
                   className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-lg px-8 font-bold uppercase tracking-[0.1em] outline-none focus:border-[#d4af37]/30 transition-all text-cream text-sm placeholder:text-white/5"
                   placeholder="IDENTITY NAME"
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]/40 ml-1">Sovereign Card Number</label>
                 <div className="relative">
                    <input 
                      required
                      value={card.number} 
                      onChange={e => setCard({...card, number: e.target.value})}
                      className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-lg px-8 font-mono tracking-[0.4em] outline-none focus:border-[#d4af37]/30 transition-all text-cream text-sm placeholder:text-white/5"
                      placeholder="•••• •••• •••• ••••"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[#d4af37]/20">
                       <CreditCard size={20} />
                    </div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]/40 ml-1">Expiry</label>
                    <input 
                      required
                      value={card.expiry} 
                      onChange={e => setCard({...card, expiry: e.target.value})}
                      className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-lg px-8 font-bold outline-none focus:border-[#d4af37]/30 transition-all text-cream text-sm"
                      placeholder="MM / YY"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]/40 ml-1">Secret Key (CVC)</label>
                    <div className="relative">
                       <input 
                         required
                         value={card.cvc} 
                         onChange={e => setCard({...card, cvc: e.target.value})}
                         className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-lg px-8 font-bold outline-none focus:border-[#d4af37]/30 transition-all text-cream text-sm pr-16"
                         placeholder="•••"
                       />
                       <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[#d4af37]/10">
                          <Lock size={18} />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <button 
             disabled={loading}
             type="submit" 
             className="w-full h-18 btn-sand rounded-lg text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl transition-all disabled:opacity-50 active:scale-[0.98] mt-4"
           >
             {loading ? 'Authorizing Transmission...' : 'Finalize Authorization'}
           </button>
        </form>
      </div>

      <div className="lg:col-span-5 space-y-10 relative z-10">
         <div className="glass-premium p-10 md:p-12 rounded-2xl space-y-10 shadow-2xl">
            <div className="space-y-8">
               <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                  <SafeImage src={room.hotel?.images?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"} fill className="object-cover" />
                  <div className="absolute bottom-6 left-6 bg-matte-charcoal/80 backdrop-blur-md px-4 py-2 rounded-sm border border-white/10">
                     <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">{room.hotel?.city}</span>
                  </div>
               </div>
               <div className="space-y-3">
                  <h3 className="text-3xl font-bold tracking-tighter text-cream uppercase">{room.hotel?.title}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]/40">{room.title}</p>
               </div>
            </div>

            <div className="pt-10 border-t border-white/5 space-y-5">
               <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
                  <span className="text-white/30">Protocol Duration</span>
                  <span className="text-cream flex items-center gap-3"><Calendar size={14} className="text-[#d4af37]" /> 3 Sovereign Days</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
                  <span className="text-white/30">Base Access Rate</span>
                  <span className="text-cream">${totalPrice}</span>
               </div>
            </div>

            {/* DISCOUNT SELECTOR */}
            <div className="pt-10 border-t border-white/5 space-y-6">
               <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]/50 block">Neural Rewards Vault</label>
               {spinnerHistory.length === 0 ? (
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/10 font-medium italic">No verified rewards found in vault</div>
               ) : (
                  <div className="grid gap-3">
                     {spinnerHistory.map((h, i) => (
                        <button 
                          key={i}
                          onClick={() => setSelectedDiscount(selectedDiscount?.date === h.date ? null : h)}
                          className={cn(
                             "w-full p-5 rounded-lg border text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-between transition-all duration-500",
                             selectedDiscount?.date === h.date 
                                ? "bg-[#d4af37] text-matte-charcoal border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)]" 
                                : "bg-white/[0.02] border-white/5 text-white/30 hover:border-[#d4af37]/30"
                          )}
                        >
                           <span className="flex items-center gap-3"><Tag size={14} /> {h.prize}</span>
                           {selectedDiscount?.date === h.date && <CheckCircle2 size={16} />}
                        </button>
                     ))}
                  </div>
               )}
            </div>

            <div className="pt-10 border-t border-white/5">
               <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 pb-2">Grand Authorization Total</span>
                  <div className="text-right">
                     {selectedDiscount && <div className="text-[11px] text-[#d4af37] line-through opacity-40 mb-1">${totalPrice}</div>}
                     <div className="text-5xl font-bold tracking-tighter text-[#d4af37]">${finalPrice}</div>
                  </div>
               </div>
            </div>
         </div>

         <div className="p-8 bg-[#d4af37]/5 border border-[#d4af37]/10 rounded-2xl flex items-start gap-5">
            <div className="p-2.5 bg-[#d4af37] text-matte-charcoal rounded-md shrink-0 shadow-lg">
               <Info size={18} />
            </div>
            <p className="text-[9px] font-bold uppercase leading-relaxed tracking-[0.2em] text-[#d4af37]/60">
               All transmissions are subject to final sovereign approval. Encrypted booking confirmation will be issued post-authorization.
            </p>
         </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-matte-charcoal text-white transition-colors duration-300 overflow-x-hidden font-sans">
      <Suspense fallback={<div className="h-screen bg-matte-charcoal flex items-center justify-center font-bold uppercase tracking-[0.5em] text-[#d4af37]/20">Loading Protocol...</div>}>
        <CheckoutContent />
      </Suspense>
    </main>
  )
}
