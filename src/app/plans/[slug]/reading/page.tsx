'use client'

import { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import Subscription from '@/components/landing/Subscription'
import { useReadingPlan } from '@/hooks/useReadingPlan'
import { PlanCalendar } from '@/components/plan/planCalander'
import { ReadingItemChecklist } from '@/components/plan/readingItemChecklist'
import { ReadingViewSkeleton } from '@/components/plan/planDetailSkeleton'
import { plansData } from '../plan-data'

interface ReadingPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ReadingPage({ params }: ReadingPageProps) {
  const { slug } = use(params)
  const t = useTranslations('PlanDetail')                                                                                                                                                    
  const [selectedDay, setSelectedDay] = useState(1)

  const { plan: readingPlan, markItemComplete, isLoading } = useReadingPlan(slug)
  const plan = plansData[slug]

  if (!plan) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-gray-900">{t('notFound.title')}</h1>
            <p className="mt-2 text-gray-600">{t('notFound.description')}</p>
            <Link 
              href="/"
              className="mt-6 inline-block rounded-lg bg-red-900 px-6 py-2 text-white hover:bg-red-800"
            >
              {t('notFound.goBack')}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!readingPlan) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <ReadingViewSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link 
            href={`/plans/${slug}`}
            className="text-sm text-red-900 hover:underline flex items-center gap-1 mb-6"
          >
            <ChevronLeft size={16} />
            Back to Plan
          </Link>

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <Image
                  src={readingPlan.image}
                  alt={readingPlan.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="font-bold text-gray-900">{readingPlan.title}</h3>
                <p className="text-sm text-gray-600">
                  Day {readingPlan.completedDays} of {readingPlan.totalDays}
                </p>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-red-900 transition-all"
                    style={{ width: `${readingPlan.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <PlanCalendar
                startDate={readingPlan.startDate || new Date()}
                totalDays={readingPlan.totalDays}
                currentDay={selectedDay}
                onDaySelect={setSelectedDay}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">Reading for Day {selectedDay}</h3>
                  {readingPlan.items.find(i => i.day === selectedDay) && (
                    <Link
                      href={`/read-online/${readingPlan.items.find(i => i.day === selectedDay)?.bookId}/${readingPlan.items.find(i => i.day === selectedDay)?.chapter}`}
                      className="rounded-lg bg-red-900 px-6 py-2 text-white hover:bg-red-800 transition-colors text-sm font-medium"
                    >
                      Start Reading
                    </Link>
                  )}
                </div>

                <ReadingItemChecklist
                  items={readingPlan.items.filter(item => item.day === selectedDay)}
                  onItemComplete={markItemComplete}
                  isLoading={isLoading}
                />

                {readingPlan.items.length > 1 && (
                  <div className="mt-6">
                    <h3 className="font-bold text-gray-900 mb-4">All Reading Items</h3>
                    <ReadingItemChecklist
                      items={readingPlan.items}
                      onItemComplete={markItemComplete}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <Subscription />
    </div>
  )
}
