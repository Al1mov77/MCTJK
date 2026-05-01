'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, User, Lock, Save, CheckCircle2, ShieldCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../../lib/LanguageContext'
import { useToast } from '../../../lib/ToastContext'

export default function ProfileSettings() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      setName(u.name || '')
    }
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
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
        localStorage.setItem('user', JSON.stringify(updated))
        setUser(updated)
        setPassword('')
        setSuccess(true)
        toast('Profile updated successfully', 'success')
        setTimeout(() => setSuccess(false), 3000)
      } else {
        toast('Failed to update profile', 'error')
      }
    } catch {
      toast('Update failed: Connection error', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-20 flex justify-center items-center">
      <div className="w-full max-w-xl">
        <Link href="/bookings" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-all mb-12 text-[10px] font-semibold uppercase tracking-[0.3em]">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShieldCheck className="w-32 h-32 text-blue-500" />
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight uppercase  mb-10 leading-none">
            Account<br />
            <span className="text-blue-500">Settings</span>
          </h1>

          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase  text-gray-500 ml-4 flex items-center gap-2">
                <User className="w-3 h-3" /> Full Name
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-medium outline-none focus:border-blue-500 transition-all"
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase  text-gray-500 ml-4 flex items-center gap-2">
                <Lock className="w-3 h-3" /> New Password
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-medium outline-none focus:border-blue-500 transition-all"
                placeholder="Leave blank to keep current"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-semibold text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
            >
              {loading ? 'SAVING...' : success ? <><CheckCircle2 className="w-4 h-4" /> UPDATED</> : <><Save className="w-4 h-4" /> SAVE CHANGES</>}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  )
}
