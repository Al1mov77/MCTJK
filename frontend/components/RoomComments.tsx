'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../lib/LanguageContext'
import { cn } from '../lib/utils'
import { Shield, Trash2 } from 'lucide-react'
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
    <div className="space-y-4">
      <h6 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
        Comments
      </h6>

      <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-3 bg-muted/30 rounded-lg border border-border/50 group relative"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-[8px] font-black text-white overflow-hidden">
                    {comment.user.name.includes('MCTJK') ? (
                      <Shield size={10} strokeWidth={3} />
                    ) : comment.user.avatar ? (
                      <img src={comment.user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      comment.user.name?.[0] || 'U'
                    )}
                  </div>
                  <span className="text-[10px] font-bold">
                    {comment.user.name}
                    {comment.user.isVip && (
                      <span className="ml-1 text-[8px] px-1 bg-amber-500/20 text-amber-600 rounded uppercase">VIP</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[8px] text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                  {(user?.role === 'ADMIN' || user?.id === comment.user.id) && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-foreground/80 leading-snug">{comment.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {!loading && comments.length === 0 && (
          <p className="text-[10px] text-muted-foreground italic">No comments yet. Be the first to share your experience!</p>
        )}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-background border border-amber-200/50 dark:border-amber-800/50 rounded-full px-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
          >
            {submitting ? '...' : 'Send'}
          </button>
        </form>
      ) : (
        <p className="text-[8px] text-muted-foreground uppercase tracking-widest text-center">Sign in to leave a comment</p>
      )}
    </div>
  )
}
