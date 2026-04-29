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
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4 text-[10px] font-semibold uppercase tracking-[0.3em]">
            <ArrowLeft className="w-4 h-4" /> {t.common.back}
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-5xl md:text-8xl font-semibold tracking-tight uppercase ">{t.hero.deals.split(' ')[0]} <span className="text-blue-500">{t.hero.deals.split(' ')[1] || 'OFFERS'}</span></h1>
            <div className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-semibold animate-pulse uppercase ">{deals.length} ACTIVE</div>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-semibold mb-4 uppercase ">No Active Deals</h2>
            <p className="text-gray-500 font-medium uppercase  text-xs">Check back soon for exclusive offers!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal, i) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.08] transition-all"
              >
                <div className="relative aspect-[4/3]">
                  {deal.hotelImage && <Image src={deal.hotelImage} alt={deal.hotelTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> {deal.discount}% OFF
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase  block mb-1">{deal.hotelCity} · {deal.hotelTitle}</span>
                  <h3 className="text-xl font-semibold mb-4">{deal.description}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-semibold">${deal.discountedPrice}</span>
                      <span className="text-lg text-gray-600 line-through">${deal.originalPrice}</span>
                    </div>
                    <Link href={`/checkout?roomId=${deal.id}`} className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                      <Zap className="w-5 h-5" />
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
