'use client'
import { useUIStore } from '@/stores/uiStore'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

export function LandingLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore()
  
  return (
    <ThemeProvider>
      <div className={`min-h-screen bg-background text-foreground ${
        theme === 'dark' ? 'dark' : ''
      }`}>
        {children}
      </div>
    </ThemeProvider>
  )
}
