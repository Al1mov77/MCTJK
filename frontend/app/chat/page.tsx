'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '../../lib/LanguageContext'
import { useTheme } from '../../lib/ThemeContext'
import { ThemeToggle } from '../../components/ui/theme-toggle'
import { cn } from '../../lib/utils'
import { ConciergeIcon } from '../../components/HotelIcons'

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
      loadContacts(token)
    } else {
      setContacts([{ id: 'official', name: 'Concierge', verified: true, online: true, role: 'ADMIN' }])
    }
  }, [])

  const loadContacts = async (token: string | null) => {
    if (!token) return
    try {
      const res = await fetch('http://localhost:4000/chat/conversations', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setContacts(await res.json())
    } catch {}
  }

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const loadMessages = async (contactId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch(`http://localhost:4000/chat/messages/${contactId}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setMessages(await res.json())
    } catch {
      setMessages([])
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const token = localStorage.getItem('token')
    if (!token || !active) return

    try {
      const res = await fetch('http://localhost:4000/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ receiverId: active.id, text: input }),
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
    <main className="h-screen bg-background flex overflow-hidden font-sans transition-colors duration-300">
      
      {/* ── Modern Sidebar (Mobile Responsive) ── */}
      <div className={cn(
        "flex flex-col border-r border-border bg-muted/30 transition-all duration-300",
        active ? 'hidden md:flex w-[350px]' : 'w-full md:w-[350px]'
      )}>
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2 group">
               <div className="w-5 h-5 bg-gradient-to-br from-amber-500 to-rose-500 rounded-sm transition-transform group-hover:scale-110" />
               <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">MCTJK</span>
            </Link>
            <ThemeToggle />
          </div>
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
               <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full h-10 md:h-9 bg-muted border border-border rounded-lg pl-10 pr-4 text-xs font-medium outline-none focus:ring-1 focus:ring-foreground transition-all"
            />
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {contacts.map((c, i) => (
            <motion.button 
              key={c.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => { setActive(c); loadMessages(c.id); }}
              className={cn(
                "w-full px-4 py-4 md:py-3 flex items-center gap-3 text-left transition-all duration-300",
                active?.id === c.id ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg' : 'hover:bg-amber-50 dark:hover:bg-amber-950/20'
              )}
            >
              <div className={cn("w-12 h-12 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300", 
                active?.id === c.id ? 'bg-white text-amber-600 shadow-lg' : 'bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/50'
              )}>
                {c.role === 'ADMIN' ? <ConciergeIcon width={16} height={16} /> : (c.name ? c.name[0].toUpperCase() : (c.email ? c.email[0].toUpperCase() : 'C'))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={cn("text-xs font-bold truncate uppercase tracking-wider transition-colors", 
                    active?.id === c.id ? 'text-white' : 'text-foreground'
                  )}>
                    {c.role === 'ADMIN' ? 'Elite Concierge' : (c.name || c.email?.split('@')[0])}
                  </span>
                  {c.online && (
                    <div className={cn("w-2 h-2 rounded-full flex items-center justify-center", active?.id === c.id ? 'bg-white' : 'bg-green-500')}>
                      <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
                <p className={cn("text-[10px] truncate font-black uppercase tracking-widest transition-colors", 
                  active?.id === c.id ? 'text-white/90' : 'text-muted-foreground'
                )}>
                   {c.role === 'ADMIN' ? '24/7 Premium Support' : 'VIP Member'}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* ── Chat Area (Mobile Responsive) ── */}
      <div className={cn("flex-1 flex flex-col bg-background relative transition-all duration-300", active ? 'flex' : 'hidden md:flex')}>
        {active ? (
          <>
            <header className="h-14 md:h-[65px] px-4 md:px-6 border-b border-amber-200/20 dark:border-amber-800/20 flex justify-between items-center bg-background/90 backdrop-blur-lg sticky top-0 z-10 shadow-lg">
              <div className="flex items-center gap-3 md:gap-4">
                <button onClick={() => setActive(null)} className="md:hidden p-2 -ml-2">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                      {active.role === 'ADMIN' ? <ConciergeIcon width={14} height={14} /> : (active.name ? active.name[0].toUpperCase() : (active.email ? active.email[0].toUpperCase() : 'C'))}
                   </div>
                   <div>
                     <h3 className="text-xs md:text-sm font-black tracking-tighter">
                       <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                         {active.role === 'ADMIN' ? 'Elite Concierge' : (active.name || active.email?.split('@')[0])}
                       </span>
                     </h3>
                     <p className="text-[8px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]">Premium Live Support</p>
                   </div>
                </div>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar pb-32">
              <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
                {messages.map((m: any) => (
                  <div key={m.id} className={cn("flex", m.senderId === user?.id ? 'justify-end' : 'justify-start')}>
                    <div className={cn(
                      "max-w-[85%] md:max-w-[75%] px-4 py-3 md:py-2 rounded-2xl text-xs md:text-sm font-semibold shadow-sm transition-all duration-300",
                      m.senderId === user?.id 
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-tr-none shadow-lg' 
                      : 'bg-gradient-to-br from-muted to-amber-50 dark:from-muted dark:to-amber-950/20 border border-amber-200/30 dark:border-amber-800/30 text-foreground rounded-tl-none'
                    )}>
                      {m.text}
                      <p className={cn("mt-1.5 text-[8px] font-black opacity-40 text-right uppercase tracking-[0.15em]")}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border bg-background/80 backdrop-blur-md absolute bottom-0 w-full">
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSend} className="flex gap-2 items-center bg-muted border border-border rounded-xl p-1 shadow-inner">
                  <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    className="flex-1 h-11 md:h-10 bg-transparent px-4 text-xs font-semibold outline-none placeholder:text-muted-foreground/50" 
                    placeholder="Message..." 
                  />
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit" 
                    className="h-11 md:h-10 px-6 md:px-8 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg transition-all"
                  >
                    Send
                  </motion.button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-amber-50/20 to-rose-50/20 dark:from-amber-950/10 dark:to-rose-950/10">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 max-w-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-amber-200/50 dark:border-amber-700/50">
                 <ConciergeIcon width={32} height={32} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div className="space-y-4">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 rounded-full border border-amber-200/50 dark:border-amber-700/50">
                   <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                   <span className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">Premium Concierge</span>
                </motion.div>
                <h3 className="text-2xl font-black tracking-tighter">
                   <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">Elite Support Terminal</span>
                </h3>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-loose max-w-xs mx-auto">
                  Connect with our luxury concierge team for personalized assistance and exclusive services.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  )
}
