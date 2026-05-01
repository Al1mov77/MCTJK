import { LanguageProvider } from '../../lib/LanguageContext'
import { ThemeProvider } from '../../lib/ThemeContext'
import { SmoothScrollProvider } from '../../lib/SmoothScrollProvider'

export default function ScrollDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}
