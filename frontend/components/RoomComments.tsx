'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../lib/LanguageContext'
import { cn } from '../lib/utils'
import { Trash2 } from 'lucide-react'
import { useToast } from '../lib/ToastContext'
import { useConfirm } from '../lib/ConfirmContext'

interface Comment {
  id: string
  text: string
  createdAt: string
  user: {
    id: string
    name: string
    avatar: string
    role: string
    isVip: boolean
  }
}

export default function RoomComments({ roomId }: { roomId: string }) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { confirm } = useConfirm()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    fetchComments()
  }, [roomId])

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:4000/room-comments/room/${roomId}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch (err) {
      console.error('Failed to fetch comments', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setSubmitting(true)
    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`http://localhost:4000/room-comments/${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: newComment })
      })

      if (res.ok) {
        const added = await res.json()
        setComments([added, ...comments])
        setNewComment('')
        toast('Comment posted successfully', 'success')
      } else {
        toast('Failed to post comment', 'error')
      }
    } catch (err) {
      toast('Network error', 'error')
      console.error('Failed to post comment', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: 'Delete Comment',
      message: 'Are you sure you want to permanently remove this comment?',
      confirmText: 'Delete',
      variant: 'danger'
    })

    if (!isConfirmed) return

    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:4000/room-comments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        setComments(comments.filter(c => c.id !== id))
        toast('Comment deleted', 'success')
      } else {
        toast('Failed to delete comment', 'error')
      }
    } catch (err) {
      toast('Connection error', 'error')
      console.error('Failed to delete comment', err)
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h6 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold italic font-sans">Guest Experiences</h6>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{comments.length} Logged Entries</span>
      </div>

      <div className="space-y-10 max-h-[500px] overflow-y-auto no-scrollbar pr-2">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="group relative"
            >
              <div className="flex gap-6">
                <div className="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center text-xs font-black text-gold shrink-0 transition-all group-hover:border-gold/40">
                  {comment.user.name?.[0].toUpperCase() || 'S'}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-foreground uppercase tracking-tight">
                          {comment.user.name}
                        </span>
                        {comment.user.isVip && (
                          <div className="w-1 h-1 bg-gold rounded-full shadow-[0_0_8px_#d4af37]" />
                        )}
                      </div>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest italic">{new Date(comment.createdAt).toLocaleDateString()}</p>
                    </div>
                    {(user?.role === 'ADMIN' || user?.id === comment.user.id) && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-500/20 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  <p className="text-[14px] text-foreground/70 leading-relaxed font-light italic font-editorial">{comment.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {!loading && comments.length === 0 && (
          <div className="py-20 text-center">
             <div className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.5em] italic">No experiences shared yet.</div>
          </div>
        )}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="relative pt-6 border-t border-border">
          <div className="relative flex items-center bg-muted/30 border border-border rounded-2xl overflow-hidden focus-within:border-gold/40 transition-all p-1.5 shadow-inner">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Post a guest experience..."
              className="flex-1 bg-transparent py-3 px-5 text-[12px] font-medium text-foreground placeholder:text-muted-foreground/30 outline-none"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="w-10 h-10 bg-foreground text-background hover:bg-gold hover:text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-0 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </form>
      ) : (
        <div className="py-8 bg-muted/20 border border-dashed border-border rounded-2xl text-center">
           <p className="text-[9px] text-muted-foreground uppercase tracking-[0.6em] font-black italic">Sovereign Authorization Required</p>
        </div>
      )}
    </div>
  )
}
