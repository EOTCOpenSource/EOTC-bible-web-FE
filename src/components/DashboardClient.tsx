'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/types/api'
import { ENV } from '@/lib/env'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import { Award, Check, ChevronRight, Play} from 'lucide-react'
import { achievements } from '@/data/achievement'

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
    <div className='flex flex-col gap-6 w-full py-8'>
      <div className='border border-gray-400 rounded-xl p-6'>
        <div className='flex gap-1 items-center text-red-900'>
          <Award size={20}/>
          <h4 className='text-lg font-medium'>Achievement</h4>
        </div>
        {achievements.map((achievement, i)=>(
        
          <div key={i} className={`flex justify-between items-center px-6 py-2 mt-4 border border-gray-300 rounded-2xl ${
            achievement.status === "Completed"
            ?'bg-red-900 text-white'
            :'border border-gray-400'
          }`}>
              <div className='flex justify-start gap-3 items-center'>                               
                <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    achievement.status === "Completed"
                    ? 'bg-white text-red-900'
                    : 'border-red-900'
                }`}>
                  {achievement.status === "Completed" ? (<Check size={20}/>) : ''}
                </span>
                <div className='flex flex-col gap-0'>
                  <p className='text-lg'>{achievement.bookName} {achievement.chapter}</p>
                  <span className='font-light'>
                    {achievement.status === "Completed" ? 'Completed' : 'Not Started'}
                  </span>
                </div>
              </div>
              <span className='cursor-pointer'>{achievement.status === "Completed" ? (
                <ChevronRight className='cursor-pointer'/>
              ) : (
                <div className='cursor-pointer flex justify-center items-center w-full py-0.5 px-2 bg-red-900 text-white rounded-sm'>
                  <Play size={18}/>
                  <p className='px-2 text-sm'>Read</p>
                </div>
              )}</span>
          </div>
        ))}
      </div>

      <div className='flex flex-col justify-center items-center text-center border border-gray-400 rounded-xl px-20 pt-6 pb-10'>
        <div className='flex flex-col justify-center items-center text-red-900'>
          <Award size={60}/>
          <h4 className='text-2xl font-medium'>Great Progress!</h4>
        </div>
        <p className='text-xs font-light'>You've completed 2 out of 4 chapters today. Keep going!</p>
        <div className='relative bg-gray-300 h-2 my-5 w-full rounded-xl'>
          <span className='absolute flex h-full bg-red-900 w-[50%] rounded-xl'></span>
        </div>
      </div>
    </div>
  )
}
