'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../lib/LanguageContext'
import { useTheme } from '../../lib/ThemeContext'
import { ThemeToggle } from '../../components/ui/theme-toggle'
import { cn } from '../../lib/utils'
import { Star } from 'lucide-react'

export default function ChatPage() {
  const { t, lang } = useLanguage()
  const { isDark } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [contacts, setContacts] = useState<any[]>([])
  const [active, setActive] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      loadContacts(token, u)
    }
  }, [])

  const loadContacts = async (token: string | null, currentUser: any) => {
    if (!token) return
    try {
      const res = await fetch('http://localhost:4000/chat/conversations', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        let data = await res.json()
        
        // Add VIP Members room if user is VIP
        if (currentUser.isVip) {
          data = [
            { id: 'VIP_MEMBERS', name: 'VIP Members', isRoom: true, isVip: true },
            ...data
          ]
        }
        
        setContacts(data)
      }
    } catch {}
  }

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const loadMessages = async (contact: any) => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const url = contact.isRoom 
        ? `http://localhost:4000/chat/messages/${contact.id}?isRoom=true`
        : `http://localhost:4000/chat/messages/${contact.id}`
      
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setMessages(await res.json())
    } catch {
      setMessages([])
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !active) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch('http://localhost:4000/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          receiverId: active.isRoom ? null : active.id, 
          roomId: active.isRoom ? active.id : null,
          text: input 
        }),
      })
      if (res.ok) {
        const msg = await res.json()
        setMessages(p => [...p, msg])
        setInput('')
      }
    } catch {}
  }

  if (!mounted) return null

  return (
    <main className="h-screen bg-matte-charcoal flex overflow-hidden font-sans transition-colors duration-300">
      
      {/* ── Sidebar ── */}
      <div className={cn(
        "flex flex-col border-r border-white/5 bg-[#0a0a0a] transition-all duration-300",
        active ? 'hidden md:flex w-[320px]' : 'w-full md:w-[320px]'
      )}>
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2 group">
               <div className="w-5 h-5 bg-[#d4af37] rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
               <span className="text-[#d4af37]">MCTJK</span>
            </Link>
            <ThemeToggle />
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="SEARCH CONTACTS..."
              className="w-full h-11 bg-white/[0.02] border border-white/5 rounded-xl pl-5 pr-4 text-[9px] font-black tracking-[0.3em] uppercase outline-none focus:border-[#d4af37]/30 transition-all placeholder:text-white/10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          <div className="px-8 mb-4">
             <h4 className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em]">Channels & Contacts</h4>
          </div>
          {contacts.map((c, i) => (
            <button 
              key={c.id} 
              onClick={() => { setActive(c); loadMessages(c); }}
              className={cn(
                "w-full px-8 py-5 flex items-center gap-4 text-left transition-all duration-300 relative group",
                active?.id === c.id ? 'bg-[#d4af37]/5' : 'hover:bg-white/[0.01]'
              )}
            >
              {active?.id === c.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 bg-[#d4af37] shadow-[0_0_15px_#d4af37]" />}
              
              <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-all duration-500 border", 
                c.isRoom ? 'bg-gold text-black border-gold' : 'bg-white/5 border-white/5 text-white/20'
              )}>
                {c.isRoom ? <Star size={16} fill="currentColor" /> : (c.name ? c.name[0].toUpperCase() : 'C')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={cn("text-[11px] font-black truncate uppercase tracking-widest transition-colors", 
                    active?.id === c.id ? 'text-[#d4af37]' : 'text-cream/80'
                  )}>
                    {c.name}
                  </span>
                  {c.isRoom && <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse shadow-[0_0_8px_#d4af37]" />}
                </div>
                <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/20">
                   {c.isRoom ? 'Exclusive Room' : (c.isVip ? 'VIP Member' : 'Member')}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className={cn("flex-1 flex flex-col bg-[#050505] relative transition-all duration-300", active ? 'flex' : 'hidden md:flex')}>
        {active ? (
          <>
            <header className="h-20 px-8 border-b border-white/5 flex justify-between items-center bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-10">
              <div className="flex items-center gap-6">
                <button onClick={() => setActive(null)} className="md:hidden p-2 -ml-2 text-[#d4af37]">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <div className="flex items-center gap-5">
                   <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", 
                      active.isRoom ? 'bg-gold text-black border-gold' : 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20'
                   )}>
                      {active.isRoom ? <Star size={16} fill="currentColor" /> : (active.name ? active.name[0].toUpperCase() : 'C')}
                   </div>
                   <div>
                     <h3 className="text-sm font-black tracking-[0.2em] uppercase text-cream">
                       {active.name}
                     </h3>
                     <div className="flex items-center gap-3 mt-1">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse shadow-[0_0_10px_#d4af37]" />
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em]">Direct Protocol Link</p>
                     </div>
                   </div>
                </div>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-16 space-y-10 custom-scrollbar pb-40">
              <div className="max-w-4xl mx-auto space-y-10">
                {messages.map((m: any) => (
                  <div key={m.id} className={cn("flex flex-col", m.senderId === user?.id ? 'items-end' : 'items-start')}>
                    {active.isRoom && m.senderId !== user?.id && (
                       <span className="text-[7px] font-black text-gold uppercase tracking-[0.4em] mb-2 ml-1">
                          {m.sender?.name || 'Sovereign'}
                       </span>
                    )}
                    <div className={cn(
                      "max-w-[80%] md:max-w-[60%] px-7 py-4 rounded-2xl text-[12px] font-medium transition-all duration-500 shadow-2xl",
                      m.senderId === user?.id 
                      ? 'bg-white text-black rounded-tr-none' 
                      : 'bg-white/[0.03] border border-white/5 text-cream rounded-tl-none'
                    )}>
                      {m.text}
                      <p className={cn("mt-3 text-[7px] font-bold opacity-20 text-right uppercase tracking-[0.3em]", 
                        m.senderId === user?.id ? 'text-black' : 'text-cream'
                      )}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-[#050505]/80 backdrop-blur-xl border-t border-white/5 absolute bottom-0 w-full">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSend} className="flex gap-4 items-center bg-white/[0.01] border border-white/5 rounded-2xl p-2 focus-within:border-gold/30 transition-all">
                  <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    className="flex-1 h-12 bg-transparent px-6 text-[11px] font-black tracking-widest uppercase text-cream outline-none placeholder:text-white/5" 
                    placeholder="ENTER TRANSMISSION..." 
                  />
                  <button 
                    type="submit" 
                    className="h-12 px-10 bg-white text-black hover:bg-gold hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95"
                  >
                    Transmit
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#050505]">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 max-w-sm">
              <div className="w-28 h-28 bg-gold/5 border border-gold/10 rounded-3xl flex items-center justify-center mx-auto relative group">
                 <Star size={40} className="text-gold opacity-40 group-hover:scale-110 transition-transform" />
                 <div className="absolute inset-0 rounded-3xl border border-gold/5 animate-pulse" />
              </div>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-gold/5 border border-gold/10 rounded-full">
                   <div className="w-2 h-2 bg-gold rounded-full animate-pulse shadow-[0_0_10px_#d4af37]" />
                   <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">Sovereign Authority</span>
                </div>
                <h3 className="text-4xl font-black tracking-tighter text-cream uppercase">
                   Protocol <span className="text-gold">Link</span>
                </h3>
                <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.4em] leading-relaxed max-w-xs mx-auto italic">
                  Select a secure channel to begin encrypted transmission. VIP Members have automatic access to the Sovereign Core room.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  )
}
