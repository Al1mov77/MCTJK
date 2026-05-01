'use client'

import { LanguageProvider } from '../lib/LanguageContext'
import { ToastProvider } from '../lib/ToastContext'
import { ConfirmProvider } from '../lib/ConfirmContext'
import SmoothScroll from './SmoothScroll'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ConfirmProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ConfirmProvider>
    </LanguageProvider>
  )
}
