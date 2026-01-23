'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Award, ChevronRight, ArrowRight, BookMarked } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { useDailyVerseStore } from '@/stores/dailyVerseStore'
import { useProgressStore } from '@/stores/progressStore'

const RightSidebar = () => {
  const router = useRouter()
  const { verse, isLoading: verseLoading, loadRandomVerse } = useDailyVerseStore()
  const { progress, loadProgress } = useProgressStore()
  const [month, setMonth] = React.useState<Date | undefined>(new Date())

  useEffect(() => {
    loadRandomVerse().catch(() => {})
    loadProgress().catch(() => {})
  }, [loadRandomVerse, loadProgress])

  const streakDates: Date[] = []
  if (progress.streak?.lastDate) {
    const lastDate = new Date(progress.streak.lastDate)
    for (let i = 0; i < Math.min(progress.streak.current || 0, 30); i++) {
      const date = new Date(lastDate)
      date.setDate(date.getDate() - i)
      streakDates.push(date)
    }
  }

  const handleContinueReading = () => {
    if (progress.lastRead) {
      router.push(
        `/read-online/${progress.lastRead.book}/${progress.lastRead.chapter}#v${progress.lastRead.verseStart}`,
      )
    } else {
      router.push('/read-online')
    }
  }

  const handleShareVerse = () => {
    if (verse && navigator.share) {
      navigator.share({
        title: 'Daily Verse',
        text: `${verse.text}\n\n${verse.reference}`,
      })
    } else if (verse) {
      navigator.clipboard.writeText(`${verse.text}\n\n${verse.reference}`)
    }
  }

  const totalChaptersRead = Object.values(progress.chaptersRead || {}).reduce(
    (total, chapters) => total + chapters.length,
    0,
  )

  return (
    <div className="flex w-full flex-col gap-8 py-3 md:gap-6">
      <div className="rounded-xl border border-gray-400 p-6">
        <div className="flex items-center gap-1 text-[#4C0E0F]">
          <Award size={20} />
          <h4 className="text-lg font-medium">Achievement</h4>
        </div>
        {progress.streak?.current ? (
          <div className="mt-4 flex flex-col items-center justify-between gap-2">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-0">
                <p className="text-sm">{progress.streak.current}-Day Streak</p>
                <span className="text-[10px] text-gray-400">
                  {progress.streak.lastDate ? 'Active' : 'Inactive'}
                </span>
              </div>
              <ChevronRight size={16} className="cursor-pointer" />
            </div>
            <hr className="h-[1.5px] w-full bg-gray-300" />
          </div>
        ) : null}
        {totalChaptersRead > 0 ? (
          <div className="mt-4 flex flex-col items-center justify-between gap-2">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-0">
                <p className="text-sm">{totalChaptersRead} Chapters</p>
                <span className="text-[10px] text-gray-400">Total read</span>
              </div>
              <ChevronRight size={16} className="cursor-pointer" />
            </div>
            <hr className="h-[1.5px] w-full bg-gray-300" />
          </div>
        ) : null}

        <div className="flex items-center justify-center pt-5">
          <button className="flex cursor-pointer items-center justify-end text-[#4C0E0F]">
            <p>View More</p>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <button
        onClick={handleContinueReading}
        className="cursor-pointer rounded-lg bg-[#4C0E0F] py-2 text-lg text-white hover:bg-red-800"
      >
        Continue Reading
      </button>

      <div className="rounded-xl border border-gray-400 p-6">
        <div className="flex items-center gap-1 text-[#4C0E0F]">
          <BookMarked size={20} />
          <h4 className="text-lg font-medium">Daily Verse</h4>
        </div>
        {verseLoading ? (
          <div className="py-3 text-[#4C0E0F]">Loading verse...</div>
        ) : verse ? (
          <>
            <div className="text-[#4C0E0F]">
              <p className="py-3 text-sm">{verse.text}</p>
              <h4 className="text-right font-medium">{verse.reference}</h4>
            </div>
            <div className="px-9">
              <button
                onClick={handleShareVerse}
                className="mt-3 w-full cursor-pointer rounded-lg bg-[#4C0E0F] py-2 text-sm text-white hover:bg-red-800"
              >
                Share Verse
              </button>
            </div>
          </>
        ) : (
          <div className="py-3 text-[#4C0E0F]">Failed to load verse</div>
        )}
      </div>

      <Calendar
        mode="single"
        selected={undefined}
        onSelect={() => {}}
        month={month}
        onMonthChange={setMonth}
        className="bg-background w-full rounded-xl border border-gray-200 p-3 md:mx-auto md:w-auto md:max-w-md lg:mx-0 lg:w-full lg:max-w-none"
        captionLayout="dropdown"
        classNames={{
          day: 'w-full p-0 text-sm font-normal rounded-full hover:bg-background hover:text-foreground',
        }}
        modifiers={{
          streak: streakDates,
        }}
        modifiersClassNames={{
          streak: 'bg-[#4C0E0F] text-white rounded-full',
        }}
      />
    </div>
  )
}

export default RightSidebar
