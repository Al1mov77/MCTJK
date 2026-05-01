'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from './utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[1000] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="pointer-events-auto"
            >
              <div className={cn(
                "min-w-[300px] p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4 transition-all",
                t.type === 'success' && "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400 shadow-green-500/10",
                t.type === 'error' && "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 shadow-red-500/10",
                t.type === 'info' && "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 shadow-amber-500/10"
              )}>
                <div className="flex items-center gap-3">
                  {t.type === 'success' && <CheckCircle2 size={18} className="shrink-0" />}
                  {t.type === 'error' && <AlertCircle size={18} className="shrink-0" />}
                  {t.type === 'info' && <Info size={18} className="shrink-0" />}
                  <span className="text-xs font-black uppercase tracking-widest">{t.message}</span>
                </div>
                <button 
                  onClick={() => removeToast(t.id)}
                  className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
