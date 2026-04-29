'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '../../lib/LanguageContext'
import { useTheme } from '../../lib/ThemeContext'
import { ThemeToggle } from '../../components/ui/theme-toggle'
import SafeImage from '../../components/SafeImage'

function CheckoutContent() {
  const { t, lang } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')
  const [loading, setLoading] = useState(false)
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' })

  useEffect(() => {
    if (!roomId) router.push('/hotels')
    const token = localStorage.getItem('token')
    if (!token) router.push('/auth/login')
  }, [roomId])

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem('token')

    try {
      // 1. Создаем бронирование (оно будет в статусе PENDING по умолчанию на бэкенде)
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
        alert(lang === 'ru' ? 'Платеж обработан! Ожидайте подтверждения админом.' : 'Payment processed! Awaiting admin approval.')
        router.push('/bookings')
      } else {
        const errData = await res.json()
        alert(`Booking Failed: ${errData.message || 'Unknown error'}`)
      }
    } catch (e) {
      alert('Network error or server is down')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-tech min-h-screen py-32 flex flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-black tracking-tighter mb-4">Secure Checkout</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Heritage Payment Gateway</p>
        </header>

        <form onSubmit={handlePay} className="vercel-card p-8 md:p-12 space-y-8 bg-card shadow-2xl">
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cardholder Name</label>
                <input 
                  required
                  value={card.name} 
                  onChange={e => setCard({...card, name: e.target.value})}
                  className="w-full h-12 bg-muted border border-border rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-foreground transition-all"
                  placeholder="JOHN DOE"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Card Number</label>
                <input 
                  required
                  value={card.number} 
                  onChange={e => setCard({...card, number: e.target.value})}
                  className="w-full h-12 bg-muted border border-border rounded-xl px-4 font-bold tracking-widest outline-none focus:ring-2 focus:ring-foreground transition-all"
                  placeholder="•••• •••• •••• ••••"
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expiry</label>
                   <input 
                     required
                     value={card.expiry} 
                     onChange={e => setCard({...card, expiry: e.target.value})}
                     className="w-full h-12 bg-muted border border-border rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-foreground transition-all"
                     placeholder="MM/YY"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">CVC</label>
                   <input 
                     required
                     value={card.cvc} 
                     onChange={e => setCard({...card, cvc: e.target.value})}
                     className="w-full h-12 bg-muted border border-border rounded-xl px-4 font-bold outline-none focus:ring-2 focus:ring-foreground transition-all"
                     placeholder="•••"
                   />
                </div>
             </div>
          </div>

          <div className="pt-8 border-t border-border">
             <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-bold text-muted-foreground">Processing Fee</span>
                <span className="text-sm font-black">$0.00</span>
             </div>
             <button 
               disabled={loading}
               type="submit" 
               className="apple-btn w-full h-14 text-base shadow-xl disabled:opacity-50"
             >
               {loading ? 'Authorizing...' : 'Complete Payment'}
             </button>
          </div>

          <p className="text-[9px] text-center text-muted-foreground font-medium uppercase tracking-[0.2em] pt-4">
             Your transaction is encrypted by Sovereign Security Protocols
          </p>
        </form>
      </motion.div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background transition-colors duration-300 overflow-x-hidden font-sans">
      <nav className="fixed top-0 w-full z-[150] bg-background/80 backdrop-blur-md border-b border-border h-16 flex items-center">
        <div className="container-tech w-full flex justify-between items-center">
          <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
             <div className="w-6 h-6 bg-foreground rounded-sm" />
             MCTJK
          </Link>
          <ThemeToggle />
        </div>
      </nav>
      
      <Suspense fallback={<div className="h-screen flex items-center justify-center font-black uppercase tracking-widest">Loading Gateway...</div>}>
        <CheckoutContent />
      </Suspense>
    </main>
  )
}
