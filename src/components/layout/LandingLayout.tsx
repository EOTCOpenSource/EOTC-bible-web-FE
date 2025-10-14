'use client'
import { useUIStore } from '@/stores/uiStore'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import DownloadApp from '@/components/landing/DownloadApp'

export function LandingLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore()
  
  return (
    <ThemeProvider>
      <div className={`min-h-screen bg-background text-foreground ${
        theme === 'dark' ? 'dark' : ''
      }`}>
        <Navbar />
        <main className="pt-20">
          {children}
        </main>
        <DownloadApp />
        <Footer />
      </div>
    </ThemeProvider>
  )
}
