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
    <div className='flex flex-col gap-6 w-full py-8'>
      {recentlyRead.length > 0 && (
        <div className='border border-gray-400 rounded-xl p-2 sm:p-6'>
          <div className='flex gap-1 items-center text-red-900 p-2 sm:p-0 mb-4'>
            <BookOpen size={20} />
            <h4 className='text-lg font-medium'>Recently Read</h4>
          </div>
          <div className='flex flex-col gap-2'>
            {recentlyRead.map((bookmark) => (
              <div
                key={bookmark._id}
                onClick={() =>
                  handleReadBook(bookmark.bookId, bookmark.chapter, bookmark.verseStart)
                }
                className='flex justify-between items-center md:px-6 md:py-2 p-1 border border-gray-300 rounded-lg md:rounded-2xl cursor-pointer hover:bg-gray-50'
              >
                <div className='flex justify-start gap-3 items-center'>
                  <div className='flex flex-col gap-0'>
                    <p className='text-sm md:text-lg'>
                      {bookmark.bookId.replace(/-/g, ' ')} {bookmark.chapter}:{bookmark.verseStart}
                      {bookmark.verseCount > 1 ? `-${bookmark.verseStart + bookmark.verseCount - 1}` : ''}
                    </p>
                    <span className='font-light text-xs md:text-base text-gray-500'>
                      Click to read
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className='cursor-pointer' />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='border border-gray-400 rounded-xl p-2 sm:p-6'>
        <div className='flex gap-1 items-center text-red-900 p-2 sm:p-0'>
          <Award size={20}/>
          <h4 className='text-lg font-medium'>Achievement</h4>
        </div>
        {achievements.map((achievement, i)=>(
        
          <div key={i} className={`flex justify-between items-center md:px-6 md:py-2 p-1 mt-4 border border-gray-300 rounded-lg md:rounded-2xl ${
            achievement.status === "Completed"
            ?'bg-red-900 text-white px-6'
            :'border border-gray-400 px-3'
          }`}>
              <div className='flex justify-start gap-3 items-center'>                               
                <span className={`flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full border ${
                    achievement.status === "Completed"
                    ? 'bg-white text-red-900'
                    : 'border-red-900'
                }`}>
                {achievement.status === "Completed" ? (
                  <div className="h-4 w-4 md:h-5 md:w-5">
                    <Check className="h-full w-full" />
                  </div>
                ) : ''}
                </span>
                <div className='flex flex-col gap-0'>
                  <p className='text-sm md:text-lg'>{achievement.bookName} {achievement.chapter}</p>
                  <span className='font-light text-xs md:text-base'>
                    {achievement.status === "Completed" ? 'Completed' : 'Not Started'}
                  </span>
                </div>
              </div>
              <span className='cursor-pointer'>{achievement.status === "Completed" ? (
                <div className="h-4 w-4 md:h-5 md:w-5">
                  <ChevronRight className="h-full w-full" />
                </div>
              ) : (
                <div className='cursor-pointer flex justify-center items-center w-full p-1.5 md:py-0.5  md:px-2 bg-red-900 text-white rounded-sm'>
                  <div className="h-4 w-4 md:h-4 md:w-4">
                    <Play className="h-full w-full" />
                  </div>                  
                  <p className='px-2 text-sm hidden md:block'>Read</p>
                </div>
              )}</span>
          </div>
        ))}
      </div>

      <div className='flex flex-col justify-center items-center text-center border border-gray-400 rounded-xl px-8 md:px-20 pt-6 pb-3 md:pb-10'>
        <div className='flex flex-col justify-center items-center text-red-900'>
          <div className="h-6 w-6 md:h-15 md:w-15">
            <Award className="h-full w-full" />
          </div>
          <h4 className='text-xs md:text-2xl font-medium'>Great Progress!</h4>
        </div>
        <p className='text-[6px] md:text-xs font-light'>
          {totalChaptersRead > 0
            ? `You've read ${totalChaptersRead} chapters. Keep going!`
            : 'Start reading to track your progress!'}
        </p>
        <div className='relative bg-gray-300 h-1 sm:h-2 my-2 sm:my-5 w-full rounded-xl'>
          <span
            className='absolute flex h-full bg-red-900 rounded-xl'
            style={{
              width: totalChaptersRead > 0 ? `${Math.min((totalChaptersRead / 100) * 100, 100)}%` : '0%',
            }}
          ></span>
        </div>
      </div>
    </div>
  )
}
