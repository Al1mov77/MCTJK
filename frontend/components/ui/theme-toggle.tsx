'use client'

import * as React from "react"
import { useTheme } from "../../lib/ThemeContext"
import { Button } from "./button"
import { cn } from "../../lib/utils"

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "rounded-full w-10 h-10 transition-all duration-300",
        isDark 
          ? "border-amber-800/30 bg-amber-950/20 text-amber-400 hover:bg-amber-900/30" 
          : "border-amber-200/50 bg-gradient-to-br from-amber-50 to-rose-50 text-amber-600 hover:from-amber-100 hover:to-rose-100 shadow-md shadow-amber-500/20"
      )}
    >
      {!mounted ? (
        <span className="w-5 h-5" />
      ) : isDark ? (
        /* New Moon Icon for Dark Mode */
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="transition-all">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      ) : (
        /* New Sun Icon for Light Mode */
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
