'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    setOptions(options)
    setIsOpen(true)
    return new Promise((resolve) => {
      setResolvePromise(() => resolve)
    })
  }

  const handleClose = (value: boolean) => {
    setIsOpen(false)
    if (resolvePromise) {
      resolvePromise(value)
    }
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {isOpen && options && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleClose(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    options.variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tighter uppercase">
                      {options.title || 'Confirm Action'}
                    </h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Security Verification
                    </p>
                  </div>
                </div>

                <p className="text-sm font-medium text-foreground/80 mb-8 leading-relaxed">
                  {options.message}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleClose(false)}
                    className="flex-1 h-12 rounded-xl border border-border text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all"
                  >
                    {options.cancelText || 'Cancel'}
                  </button>
                  <button
                    onClick={() => handleClose(true)}
                    className={`flex-[2] h-12 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg transition-all ${
                      options.variant === 'danger' 
                        ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-red-500/25' 
                        : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 shadow-amber-500/25'
                    }`}
                  >
                    {options.confirmText || 'Confirm'}
                  </button>
                </div>
              </div>
              
              {/* Luxury Detail */}
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <AlertTriangle size={80} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return context
}
