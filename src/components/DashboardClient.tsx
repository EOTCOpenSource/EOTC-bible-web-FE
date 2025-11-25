'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/types/api'
import { ENV } from '@/lib/env'
import axios from 'axios'
import LogoutButton from './LogoutButton'
import DeleteAccountButton from './DeleteAccountButton'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {  Moon, Settings } from 'lucide-react'
import { LanguageSelector } from '../components/shared/language-selector'
import DashboardSidebar from './layout/DashboardSidebar'
import DashboardWidget from './layout/DashboardWidget'
import DashboardHome from './layout/DashboardHome'

interface DashboardClientProps {
  initialUser: UserProfile | null
}

export default function DashboardClient() {
  const t = useTranslations('Dashboard')
  const translate = useTranslations('Navigation')
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'home' | 'highlight' | 'notes' | 'plans' | 'bookmarks'>('home')
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/auth/profile`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          validateStatus: () => true,
          withCredentials: true,
        })

        if (res.status !== 200 || !res.data?.user) {
          console.error('Profile fetch failed:', res.status, res.data)
          throw new Error(res.data?.error || 'Unauthorized')
        }
        console.log('Fetched user profile:', res.data)
        setUser(res.data.user)
      } catch (err: any) {
        setError(err.message || t('errors.fetchProfile'))
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [t])

  if (loading)
    return (
      <main className="p-6">
        <p>{t('loading')}</p>
      </main>
    )

  if (error) {
    return (
      <main className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h1 className="mb-2 text-xl font-semibold text-red-800">❌ {t('errors.title')}</h1>
          <p className="text-red-700">{error}</p>
        </div>
      </main>
    )
  }
  const displayUser: UserProfile = user || {
    id: 'mock-id',
    name: 'Guest',
    email: 'guest@example.com',
    settings: {
      theme: 'dark',
      fontSize: 'medium',
      lastRead: {
        bookId: "bookId",
        chapter: 4
      }
    },
    streak: {
      current: 3,
      longest: 7,
      lastDate: "string"
    }
}

  if (!displayUser) {
    return (
      <main className="p-6">
        <div className="text-center">
          <p className="text-gray-600">{t('unauthorized.message')}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {t('unauthorized.loginButton')}
          </button>
          <button
            onClick={() => {
              // Clear the auth cookie
              document.cookie = `${ENV.jwtCookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
              // Redirect to login page
              window.location.href = '/register'
            }}
            className="m-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {t('unauthorized.registerButton')}
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="EOTCBible Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">{translate('siteName')}</span>
            </Link>
          <p className="text-base text-gray-500">
            {t('welcome', { name: displayUser.name })}
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
      </div>

      {/* Tabs navigation */}

      <div className='flex justify-between items-start gap-6'>
        <DashboardSidebar activeTab= {activeTab} setActiveTab={setActiveTab}/>

        <div className='w-full'>
          {activeTab === 'home' && (
            <DashboardHome/>
          )}

          {activeTab === 'bookmarks' && (
            <section className="space-y-4 rounded-lg bg-black p-6">
              <h2 className="text-lg font-medium">Bookmarks</h2>
              <p className="text-sm text-gray-400">
                Here you can show a list of bookmarked verses later.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• John 3:16</li>
                <li>• Psalm 23:1</li>
                <li>• Romans 8:28</li>
              </ul>
            </section>
          )}

          {activeTab === 'notes' && (
            <section className="space-y-4 rounded-lg bg-black p-6">
              <h2 className="text-lg font-medium">notes</h2>
              <p className="text-sm text-gray-400">
                Adjust your reading preferences.
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-gray-400">
                    Current: {displayUser.settings?.theme || 'dark'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Font size</p>
                  <p className="text-gray-400">
                    Current: {displayUser.settings?.fontSize || 'medium'}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
