'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/types/api'
import { ENV } from '@/lib/env'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import { Award, Check, ChevronRight, Play, BookOpen } from 'lucide-react'
import { achievements } from '@/data/achievement'
import { useProgressStore } from '@/stores/progressStore'
import { useBookmarksStore } from '@/stores/bookmarksStore'

interface DashboardClientProps {
  initialUser: UserProfile | null
}

export default function DashboardClient() {
  const t = useTranslations('Dashboard')
  const translate = useTranslations('Navigation')
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { progress, loadProgress } = useProgressStore()
  const { bookmarks, loadBookmarks } = useBookmarksStore()

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
          throw new Error(res.data?.error || 'Unauthorized')
        }
        setUser(res.data.user)
      } catch (err: any) {
        setError(err.message || t('errors.fetchProfile'))
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
    loadProgress().catch(() => {})
    loadBookmarks().catch(() => {})
  }, [t, loadProgress, loadBookmarks])

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
  const displayUser: UserProfile = user

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
              document.cookie = `${ENV.jwtCookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
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

  const totalChaptersRead = Object.values(progress.chaptersRead || {}).reduce(
    (total, chapters) => total + chapters.length,
    0,
  )

  const recentlyRead = bookmarks.slice(0, 5)

  const handleReadBook = (bookId: string, chapter: number, verseStart: number) => {
    router.push(`/read-online/${bookId}/${chapter}#v${verseStart}`)
  }

  return (
    <div className="flex w-full flex-col gap-6 py-8">
      {recentlyRead.length > 0 && (
        <div className="rounded-xl border border-gray-400 p-2 sm:p-6">
          <div className="mb-4 flex items-center gap-1 p-2 text-[#4C0E0F] sm:p-0">
            <BookOpen size={20} />
            <h4 className="text-lg font-medium">Recently Read</h4>
          </div>
          <div className="flex flex-col gap-2">
            {recentlyRead.map((bookmark) => (
              <div
                key={bookmark._id}
                onClick={() =>
                  handleReadBook(bookmark.bookId, bookmark.chapter, bookmark.verseStart)
                }
                className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 p-1 hover:bg-gray-50 md:rounded-2xl md:px-6 md:py-2"
              >
                <div className="flex items-center justify-start gap-3">
                  <div className="flex flex-col gap-0">
                    <p className="text-sm md:text-lg">
                      {bookmark.bookId.replace(/-/g, ' ')} {bookmark.chapter}:{bookmark.verseStart}
                      {bookmark.verseCount > 1
                        ? `-${bookmark.verseStart + bookmark.verseCount - 1}`
                        : ''}
                    </p>
                    <span className="text-xs font-light text-gray-500 md:text-base">
                      Click to read
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="cursor-pointer" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-400 p-2 sm:p-6">
        <div className="flex items-center gap-1 p-2 text-[#4C0E0F] sm:p-0">
          <Award size={20} />
          <h4 className="text-lg font-medium">Achievement</h4>
        </div>
        {achievements.map((achievement, i) => (
          <div
            key={i}
            className={`mt-4 flex items-center justify-between rounded-lg border border-gray-300 p-1 md:rounded-2xl md:px-6 md:py-2 ${
              achievement.status === 'Completed'
                ? 'bg-[#4C0E0F] px-6 text-white'
                : 'border border-gray-400 px-3'
            }`}
          >
            <div className="flex items-center justify-start gap-3">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border md:h-6 md:w-6 ${
                  achievement.status === 'Completed'
                    ? 'bg-white text-[#4C0E0F]'
                    : 'border-[#4C0E0F]'
                }`}
              >
                {achievement.status === 'Completed' ? (
                  <div className="h-4 w-4 md:h-5 md:w-5">
                    <Check className="h-full w-full" />
                  </div>
                ) : (
                  ''
                )}
              </span>
              <div className="flex flex-col gap-0">
                <p className="text-sm md:text-lg">
                  {achievement.bookName} {achievement.chapter}
                </p>
                <span className="text-xs font-light md:text-base">
                  {achievement.status === 'Completed' ? 'Completed' : 'Not Started'}
                </span>
              </div>
            </div>
            <span className="cursor-pointer">
              {achievement.status === 'Completed' ? (
                <div className="h-4 w-4 md:h-5 md:w-5">
                  <ChevronRight className="h-full w-full" />
                </div>
              ) : (
                <div className="flex w-full cursor-pointer items-center justify-center rounded-sm bg-[#4C0E0F] p-1.5 text-white md:px-2 md:py-0.5">
                  <div className="h-4 w-4 md:h-4 md:w-4">
                    <Play className="h-full w-full" />
                  </div>
                  <p className="hidden px-2 text-sm md:block">Read</p>
                </div>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-400 px-8 pt-6 pb-3 text-center md:px-20 md:pb-10">
        <div className="flex flex-col items-center justify-center text-[#4C0E0F]">
          <div className="h-6 w-6 md:h-15 md:w-15">
            <Award className="h-full w-full" />
          </div>
          <h4 className="text-xs font-medium md:text-2xl">Great Progress!</h4>
        </div>
        <p className="text-[6px] font-light md:text-xs">
          {totalChaptersRead > 0
            ? `You've read ${totalChaptersRead} chapters. Keep going!`
            : 'Start reading to track your progress!'}
        </p>
        <div className="relative my-2 h-1 w-full rounded-xl bg-gray-300 sm:my-5 sm:h-2">
          <span
            className="absolute flex h-full rounded-xl bg-[#4C0E0F]"
            style={{
              width:
                totalChaptersRead > 0 ? `${Math.min((totalChaptersRead / 100) * 100, 100)}%` : '0%',
            }}
          ></span>
        </div>
      </div>
    </div>
  )
}
