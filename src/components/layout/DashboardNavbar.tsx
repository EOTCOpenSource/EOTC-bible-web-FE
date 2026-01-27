
'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/lib/stores/useUserStore'
import LogoutButton from '../LogoutButton'
import Link from 'next/link'
import { Moon, Settings, User } from 'lucide-react'
import { LanguageSelector } from '../shared/language-selector'
import { useTranslations } from 'next-intl'


export default function Navbar() {
  const { user, loadSession } = useUserStore()

  const t = useTranslations('Dashboard')
  const translate = useTranslations('Navigation')

  useEffect(() => {
    loadSession()
  }, [loadSession])

  return (
    <nav className="flex items-start justify-between px-4 py-4 md:px-6 md:py-6 bg-background gap-4 md:gap-10">
      {/* Left: Logo and Welcome */}
      <div className="flex flex-col items-start gap-1">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="EOTCBible Logo" className="h-10 w-10" />
          <div className="flex flex-row items-center gap-1">
            <span className="text-[13px] md:text-xl font-bold leading-none text-[#392D2D] tracking-tight">EOTC</span>
            <span className="text-[13px] md:text-xl font-bold leading-none text-[#392D2D] tracking-tight">Bible</span>
          </div>
        </Link>
        <p className="text-sm font-medium text-muted-foreground pl-1 whitespace-nowrap">
          {t('welcome', { name: user?.name ? user.name.split(' ')[0] : 'Guest' })}!
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 border border-border rounded-xl p-1.5 shadow-sm bg-background/50 backdrop-blur-sm">
        <LanguageSelector />
        <button className="rounded-full p-2 hover:bg-accent text-foreground transition-colors">
          <Moon size={20} strokeWidth={1.5} />
        </button>
        <button className="rounded-full p-2 hover:bg-accent text-foreground transition-colors">
          <Settings size={20} strokeWidth={1.5} />
        </button>
        <Link href="/profile" className="rounded-full p-2 hover:bg-accent text-foreground transition-colors">
          <User size={20} strokeWidth={1.5} />
        </Link>
        <div className="pl-1 border-l">
          <LogoutButton />
        </div>
      </div>
    </nav>
  )
}
