'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/types/api'
import { ENV } from '@/lib/env'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import { Award, ChevronRight, BookOpen } from 'lucide-react'
import { useProgressStore } from '@/stores/progressStore'
import { useBookmarksStore } from '@/stores/bookmarksStore'
import { useAchievementsStore } from '@/stores/achievementStore'
export default function DashboardClient() {
  const t = useTranslations('Dashboard')
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { progress, loadProgress, flushVerseQueue } = useProgressStore()
  const { bookmarks, loadBookmarks } = useBookmarksStore()
  const { achievements, loadAchievements } = useAchievementsStore()

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
    flushVerseQueue().catch(() => { })
    loadProgress().catch(() => { })
    loadBookmarks().catch(() => { })
    loadAchievements().catch(() => { })
  }, [t, flushVerseQueue, loadProgress, loadBookmarks, loadAchievements])

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

  const totalAchievements = achievements.length
  const achievementsUnlocked = achievements.filter((a: any) => a.unlocked).length
  const achievementPct = totalAchievements > 0 ? Math.round((achievementsUnlocked / totalAchievements) * 100) : 0

  const lastRead = progress.lastRead

  const recentlyReadItems: any[] = []
  if (lastRead) {
    recentlyReadItems.push({
      id: 'last-read',
      bookId: lastRead.book,
      chapter: lastRead.chapter,
      verseStart: lastRead.verseStart,
      subtitle: 'Click to continue reading'
    })
  } else if (progress.chaptersRead && Object.keys(progress.chaptersRead).length > 0) {
    // Fallback to recent chapters from tracking if lastRead is not explicitly set
    const books = Object.keys(progress.chaptersRead)
    for (const book of books) {
      const chapters = progress.chaptersRead[book]
      if (chapters && chapters.length > 0) {
        recentlyReadItems.push({
          id: `recent-${book}-${chapters[chapters.length - 1]}`,
          bookId: book,
          chapter: chapters[chapters.length - 1],
          verseStart: 1,
          subtitle: 'Click to read'
        })
      }
      if (recentlyReadItems.length >= 3) break
    }
  }

  // If absolutely no tracking data is found, fallback to their latest bookmarks so the UI doesn't disappear
  if (recentlyReadItems.length === 0 && bookmarks && bookmarks.length > 0) {
    bookmarks.slice(0, 5).forEach((bookmark) => {
      recentlyReadItems.push({
        id: bookmark._id,
        bookId: bookmark.bookId,
        chapter: bookmark.chapter,
        verseStart: bookmark.verseStart,
        subtitle: 'Click to read'
      })
    })
  }

  const handleReadBook = (bookId: string, chapter: number, verseStart?: number) => {
    router.push(`/read-online/${bookId}/${chapter}${verseStart ? `#v${verseStart}` : ''}`)
  }

  return (
    <div className="flex w-full flex-col gap-6 py-8">
      <div className="rounded-xl border border-gray-400 dark:border-neutral-800 p-2 sm:p-6">
        <div className="mb-4 flex items-center gap-1 p-2 text-[#4C0E0F] dark:text-red-400 sm:p-0">
          <BookOpen size={20} />
          <h4 className="text-lg font-medium text-black dark:text-white">Recently Read</h4>
        </div>
        <div className="flex flex-col gap-2">
          {recentlyReadItems.length > 0 ? (
            recentlyReadItems.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  handleReadBook(item.bookId, item.chapter, item.verseStart)
                }
                className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 dark:border-neutral-800 p-1 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors md:rounded-2xl md:px-6 md:py-2"
              >
                <div className="flex items-center justify-start gap-3">
                  <div className="flex flex-col gap-0">
                    <p className="text-sm md:text-lg text-black dark:text-white capitalize">
                      {item.bookId.replace(/-/g, ' ')} {item.chapter}{item.verseStart && item.id === 'last-read' ? `:${item.verseStart}` : ''}
                    </p>
                    <span className="text-xs font-light text-gray-500 md:text-base">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="cursor-pointer text-black dark:text-gray-400" />
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm md:text-base text-gray-500 dark:text-gray-400">
              You haven't read any chapters yet. Start your journey!
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-400 dark:border-neutral-800 px-8 pt-6 pb-3 text-center md:px-20 md:pb-10">
        <div className="flex flex-col items-center justify-center text-[#4C0E0F] dark:text-red-400">
          <div className="h-6 w-6 md:h-15 md:w-15">
            <Award className="h-full w-full" />
          </div>
          <h4 className="text-xs font-medium md:text-2xl text-black dark:text-white mt-2">Great Progress!</h4>
        </div>
        <p className="text-[10px] sm:text-[12px] font-light md:text-sm text-gray-600 dark:text-gray-400 mt-1">
          {achievementsUnlocked > 0
            ? `You've unlocked ${achievementsUnlocked} out of ${totalAchievements} achievements. Keep going!`
            : 'Start reading to track your progress and unlock achievements!'}
        </p>
        <div className="relative my-2 h-1 w-full rounded-xl bg-gray-300 dark:bg-neutral-800 sm:my-5 sm:h-2">
          <span
            className="absolute flex h-full rounded-xl bg-[#4C0E0F] dark:bg-red-500 transition-all duration-1000"
            style={{ width: `${achievementPct}%` }}
          ></span>
        </div>
      </div>
    </div>
  )
}
