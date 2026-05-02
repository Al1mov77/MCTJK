'use client'

import { motion } from 'framer-motion'
import { Tag, ArrowLeft, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '../../lib/LanguageContext'

export default function DealsPage() {
  const { t } = useLanguage()
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:4000/hotels')
      .then(r => r.json())
      .then(hotels => {
        // Find rooms with discounts
        const discountedRooms: any[] = []
        for (const hotel of hotels) {
          for (const room of (hotel.rooms || [])) {
            if (room.discount > 0) {
              discountedRooms.push({
                ...room,
                hotelTitle: hotel.title,
                hotelCity: hotel.city,
                hotelImage: typeof hotel.images === 'string' ? JSON.parse(hotel.images)[0] : hotel.images?.[0],
                originalPrice: room.price,
                discountedPrice: Math.floor(room.price * (1 - room.discount / 100)),
              })
            }
          }
        }
        setDeals(discountedRooms)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-matte-charcoal text-cream p-6 md:p-24 relative overflow-hidden font-sans">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#d4af37]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#d4af37]/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20 space-y-8">
          <Link href="/" className="inline-flex items-center gap-4 text-[#d4af37]/40 hover:text-[#d4af37] transition-all text-[10px] font-bold uppercase tracking-[0.4em]">
            <ArrowLeft className="w-4 h-4" /> Sovereign Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-[#d4af37]/20 rounded-full">
                 <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse" />
                 <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Limited Opportunities</span>
              </motion.div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none italic">
                {t.hero.deals.split(' ')[0]} <span className="text-[#d4af37]">{t.hero.deals.split(' ')[1] || 'OFFERS'}</span>
              </h1>
            </div>
            <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-6 py-2 rounded-sm text-[9px] font-bold tracking-[0.3em] uppercase backdrop-blur-md">
              {deals.length} SELECTIONS ACTIVE
            </div>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-40">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full mx-auto shadow-[0_0_15px_rgba(212,175,55,0.2)]" />
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-40 glass-premium rounded-3xl border border-dashed border-[#d4af37]/10 space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter uppercase text-cream/20 italic">No Active Deals</h2>
            <p className="text-[#d4af37]/40 font-bold uppercase text-[9px] tracking-[0.4em]">The collection is currently at peak exclusivity.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {deals.map((deal, i) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group glass-premium border-white/5 rounded-2xl overflow-hidden hover:border-[#d4af37]/30 transition-all duration-700 shadow-2xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {deal.hotelImage && <Image src={deal.hotelImage} alt={deal.hotelTitle} fill className="object-cover group-hover:scale-110 transition-transform duration-[2s]" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-matte-charcoal/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-6 left-6 bg-[#d4af37] text-matte-charcoal px-4 py-2 rounded-sm font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl">
                    <Tag className="w-3 h-3" /> {deal.discount}% PRIVILEGE
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <span className="text-[9px] font-bold text-[#d4af37]/40 uppercase tracking-[0.3em] block mb-2">{deal.hotelCity} · {deal.hotelTitle}</span>
                    <h3 className="text-xl font-bold tracking-tight text-cream uppercase">{deal.description}</h3>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-baseline gap-4">
                      <span className="text-4xl font-black tracking-tighter text-[#d4af37]">${deal.discountedPrice}</span>
                      <span className="text-base text-cream/20 line-through font-medium tracking-tighter">${deal.originalPrice}</span>
                    </div>
                    <Link href={`/checkout?roomId=${deal.id}`} className="w-14 h-14 btn-sand rounded-full flex items-center justify-center shadow-2xl transition-all">
                      <Zap className="w-6 h-6 fill-current" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
