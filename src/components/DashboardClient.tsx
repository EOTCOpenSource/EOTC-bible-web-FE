'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/types/api'
import { ENV } from '@/lib/env'
import axios from 'axios'
import LogoutButton from './LogoutButton'
import DeleteAccountButton from './DeleteAccountButton'
import { useTranslations } from 'next-intl'

interface DashboardClientProps {
  initialUser: UserProfile | null
}

export default function DashboardClient() {
  const t = useTranslations('Dashboard')
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
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
  const displayUser = user 

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
    <main className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('welcome', { name: displayUser.name })}</h1>
        <div className="space-x-4">
          <LogoutButton />
          <DeleteAccountButton />
        </div>
      </div>

      <div className="space-y-4 rounded-lg bg-black p-6 shadow-sm">
        <h2 className="text-lg font-medium">{t('profile.title')}</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">{t('profile.email')}:</span> {displayUser.email}
          </p>
          {displayUser.settings && (
            <>
              <p>
                <span className="font-medium">{t('profile.theme')}:</span> {displayUser.settings.theme}
              </p>
              <p>
                <span className="font-medium">{t('profile.fontSize')}:</span> {displayUser.settings.fontSize}
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}