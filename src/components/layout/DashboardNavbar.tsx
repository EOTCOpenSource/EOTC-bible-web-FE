'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/lib/stores/useUserStore'
import LogoutButton from '../LogoutButton'
import Link from 'next/link'
import {  Moon, Settings } from 'lucide-react'
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
    <nav className="flex items-center justify-between p-6">
      <div>
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="EOTCBible Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">{translate('siteName')}</span>
          </Link>
          <p className="text-base text-gray-500">
            {t('welcome', { name: user?.name ?? 'Guest user' })}
          </p>
      </div>

      <div className="flex h-[42px] items-center space-x-2 rounded-md border p-1">
        <LanguageSelector />
        <button className="rounded-full p-2 hover:bg-gray-200">
          <Moon size={20} />
        </button>
        <button className="rounded-full p-2 hover:bg-gray-200">
          <Settings size={20} />
        </button>          
        <LogoutButton/>
      </div>
      
    </nav>
  )
}
