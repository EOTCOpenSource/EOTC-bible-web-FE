
'use client'

import { useEffect, useState, useRef } from 'react'
import { useUserStore } from '@/lib/stores/useUserStore'
import LogoutButton from '../LogoutButton'
import Link from 'next/link'
import { Moon, Sun, Settings, User, Menu, Book, Calendar, Home, NotebookPen, PenLine, Globe } from 'lucide-react'
import { LanguageSelector } from '../shared/language-selector'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { user, loadSession } = useUserStore()

  const t = useTranslations('Dashboard')
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    loadSession()
  }, [loadSession])

  return (
    <nav className="flex items-start justify-between px-4 py-4 md:px-6 md:py-6 bg-background gap-4 md:gap-10">
      {/* Left: Logo and Welcome */}
      <div className="flex flex-col items-start gap-1">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="EOTCBible Logo" className="h-10 w-10" width={40} height={40} />
          <div className="flex flex-row items-center gap-1">
            <span className="text-[13px] md:text-xl font-bold leading-none text-[#392D2D] dark:text-white tracking-tight">EOTC</span>
            <span className="text-[13px] md:text-xl font-bold leading-none text-[#392D2D] dark:text-white tracking-tight">Bible</span>
          </div>
        </Link>
        <p className="text-sm font-medium text-muted-foreground pl-1 whitespace-nowrap">
          {t('welcome', { name: user?.name ? user.name.split(' ')[0] : 'Guest' })}!
        </p>
      </div>

      {/* Right: Actions */}
      <div ref={menuRef} className={`flex items-end md:items-center gap-1 border border-border rounded-xl p-1.5 shadow-sm transition-all duration-300 ease-in-out overflow-hidden flex-col md:flex-row ${isMenuOpen ? 'absolute top-14 right-4 z-50 w-[max-content] max-w-[95vw] shadow-xl bg-gray-100 dark:bg-[#1A1A1A] md:relative md:top-auto md:right-auto md:z-auto md:w-auto md:bg-background/50 md:dark:bg-background/50 md:shadow-md' : 'relative max-w-none bg-background/50 backdrop-blur-sm shadow-sm'}`}>
        {!mounted ? null : !isMenuOpen ? (
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="rounded-full p-2 w-9 h-9 flex items-center justify-center hover:bg-accent text-foreground transition-colors"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        ) : (
          <div className="flex flex-col md:flex-row items-end md:items-center gap-1 animate-in fade-in slide-in-from-right-4 duration-300 w-full min-w-max">
            {/* Mobile Navigation Links (Hidden on Desktop) */}
            <div className="flex flex-wrap md:hidden items-center justify-start gap-1 w-full pb-2 border-b border-gray-300 dark:border-neutral-800 mb-1 px-1 mt-1">
              <Link href="/dashboard" className="rounded-xl p-2 w-10 h-10 flex flex-shrink-0 items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-800 text-foreground transition-colors">
                <Home size={20} strokeWidth={1.5} />
              </Link>
              <Link href="/dashboard/highlights" className="rounded-xl p-2 w-10 h-10 flex flex-shrink-0 items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-800 text-foreground transition-colors">
                <PenLine size={20} strokeWidth={1.5} />
              </Link>
              <Link href="/dashboard/notes" className="rounded-xl p-2 w-10 h-10 flex flex-shrink-0 items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-800 text-foreground transition-colors">
                <NotebookPen size={20} strokeWidth={1.5} />
              </Link>
              <Link href="/dashboard/plans" className="rounded-xl p-2 w-10 h-10 flex flex-shrink-0 items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-800 text-foreground transition-colors">
                <Calendar size={20} strokeWidth={1.5} />
              </Link>
              <Link href="/dashboard/bookmarks" className="rounded-xl p-2 w-10 h-10 flex flex-shrink-0 items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-800 text-foreground transition-colors">
                <Book size={20} strokeWidth={1.5} />
              </Link>
              <Link href="/dashboard/notes/public" className="rounded-xl p-2 w-10 h-10 flex flex-shrink-0 items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-800 text-foreground transition-colors">
                <Globe size={20} strokeWidth={1.5} />
              </Link>
            </div>

            {/* Standard Right Actions */}
            <div className="flex flex-wrap items-center gap-1 justify-end w-full px-1">
              <LanguageSelector />
              <button onClick={toggleTheme} className="rounded-xl p-2 w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-800 text-foreground transition-colors">
                {theme === 'dark' ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
              </button>
              <Link href="/profile" className="rounded-xl p-2 w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-800 text-foreground transition-colors">
                <User size={20} strokeWidth={1.5} />
              </Link>
              <div className="pl-1 border-l border-gray-300 dark:border-neutral-800 flex items-center h-full py-1">
                <LogoutButton />
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="rounded-xl p-2 ml-1 w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors text-red-500 hover:text-red-600 dark:hover:text-red-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
