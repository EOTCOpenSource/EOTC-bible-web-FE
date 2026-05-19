'use client'

import { useEffect, useState, useRef } from 'react'
import { useUserStore } from '@/lib/stores/useUserStore'
import LogoutButton from '../LogoutButton'
import Link from 'next/link'
import {
  Moon,
  Sun,
  Settings,
  User,
  Menu,
  Book,
  Calendar,
  Home,
  NotebookPen,
  PenLine,
  Globe,
  CloudOff,
} from 'lucide-react'
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
    <nav className="bg-background flex items-start justify-between gap-4 px-4 py-4 md:gap-10 md:px-6 md:py-6">
      {/* Left: Logo and Welcome */}
      <div className="flex flex-col items-start gap-1">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="EOTCBible Logo"
            className="h-10 w-10"
            width={40}
            height={40}
          />
          <div className="flex flex-row items-center gap-1">
            <span className="text-[13px] leading-none font-bold tracking-tight text-[#392D2D] md:text-xl dark:text-white">
              EOTC
            </span>
            <span className="text-[13px] leading-none font-bold tracking-tight text-[#392D2D] md:text-xl dark:text-white">
              Bible
            </span>
          </div>
        </Link>
        <p className="text-muted-foreground pl-1 text-sm font-medium whitespace-nowrap">
          {t('welcome', { name: user?.name ? user.name.split(' ')[0] : 'Guest' })}!
        </p>
      </div>

      {/* Right: Actions */}
      <div
        ref={menuRef}
        className={`border-border flex flex-col items-end gap-1 overflow-hidden rounded-xl border p-1.5 shadow-sm transition-all duration-300 ease-in-out md:flex-row md:items-center ${isMenuOpen ? 'md:bg-background/50 md:dark:bg-background/50 absolute top-14 right-4 z-50 w-[max-content] max-w-[95vw] bg-gray-100 shadow-xl md:relative md:top-auto md:right-auto md:z-auto md:w-auto md:shadow-md dark:bg-[#1A1A1A]' : 'bg-background/50 relative max-w-none shadow-sm backdrop-blur-sm'}`}
      >
        {!mounted ? null : !isMenuOpen ? (
          <button
            onClick={() => setIsMenuOpen(true)}
            className="hover:bg-accent text-foreground flex h-9 w-9 items-center justify-center rounded-full p-2 transition-colors"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 flex w-full min-w-max flex-col items-end gap-1 duration-300 md:flex-row md:items-center">
            {/* Mobile Navigation Links (Hidden on Desktop) */}
            <div className="mt-1 mb-1 flex w-full flex-wrap items-center justify-start gap-1 border-b border-gray-300 px-1 pb-2 md:hidden dark:border-neutral-800">
              <Link
                href="/dashboard"
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl p-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-800 ${pathname === '/dashboard' ? 'text-primary' : 'text-foreground'}`}
              >
                <Home size={20} strokeWidth={pathname === '/dashboard' ? 2.5 : 1.5} />
              </Link>
              <Link
                href="/dashboard/highlights"
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl p-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-800 ${pathname === '/dashboard/highlights' ? 'text-primary' : 'text-foreground'}`}
              >
                <PenLine size={20} strokeWidth={pathname === '/dashboard/highlights' ? 2.5 : 1.5} />
              </Link>
              <Link
                href="/dashboard/notes"
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl p-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-800 ${pathname === '/dashboard/notes' ? 'text-primary' : 'text-foreground'}`}
              >
                <NotebookPen size={20} strokeWidth={pathname === '/dashboard/notes' ? 2.5 : 1.5} />
              </Link>
              <Link
                href="/dashboard/plans"
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl p-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-800 ${pathname === '/dashboard/plans' ? 'text-primary' : 'text-foreground'}`}
              >
                <Calendar size={20} strokeWidth={pathname === '/dashboard/plans' ? 2.5 : 1.5} />
              </Link>
              <Link
                href="/dashboard/bookmarks"
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl p-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-800 ${pathname === '/dashboard/bookmarks' ? 'text-primary' : 'text-foreground'}`}
              >
                <Book size={20} strokeWidth={pathname === '/dashboard/bookmarks' ? 2.5 : 1.5} />
              </Link>
              <Link
                href="/dashboard/notes/public"
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl p-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-800 ${pathname === '/dashboard/notes/public' ? 'text-primary' : 'text-foreground'}`}
              >
                <Globe size={20} strokeWidth={pathname === '/dashboard/notes/public' ? 2.5 : 1.5} />
              </Link>
              <Link
                href="/dashboard/offline"
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl p-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-800 ${pathname === '/dashboard/offline' ? 'text-primary' : 'text-foreground'}`}
              >
                <CloudOff size={20} strokeWidth={pathname === '/dashboard/offline' ? 2.5 : 1.5} />
              </Link>
            </div>

            {/* Standard Right Actions */}
            <div className="flex w-full flex-wrap items-center justify-end gap-1 px-1">
              <LanguageSelector />
              <button
                onClick={toggleTheme}
                className="text-foreground flex h-10 w-10 items-center justify-center rounded-xl p-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-800"
              >
                {theme === 'dark' ? (
                  <Sun size={20} strokeWidth={1.5} />
                ) : (
                  <Moon size={20} strokeWidth={1.5} />
                )}
              </button>
              <Link
                href="/profile"
                className={`flex h-10 w-10 items-center justify-center rounded-xl p-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-800 ${pathname === '/profile' ? 'text-primary' : 'text-foreground'}`}
              >
                <User size={20} strokeWidth={1.5} />
              </Link>
              <div className="flex h-full items-center border-l border-gray-300 py-1 pl-1 dark:border-neutral-800">
                <LogoutButton />
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl p-2 text-red-500 transition-colors hover:bg-gray-200 hover:text-red-600 dark:hover:bg-neutral-800 dark:hover:text-red-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
