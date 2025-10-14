'use client'
import { useUIStore } from '@/stores/uiStore'
import { useEffect } from 'react'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useUIStore()
  
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])
  
  return <>{children}</>
}
