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
    <div className='flex flex-col gap-8 md:gap-6 py-3 w-full '>
      <div className='border border-gray-400 rounded-xl p-6'>
        <div className='flex gap-1 items-center text-red-900'>
          <Award size={20} />
          <h4 className='text-lg font-medium'>Achievement</h4>
        </div>
        {progress.streak?.current ? (
          <div className='flex flex-col gap-2 justify-between items-center mt-4'>
            <div className='w-full flex justify-between items-center'>
              <div className='flex flex-col gap-0'>
                <p className='text-sm'>{progress.streak.current}-Day Streak</p>
                <span className='text-gray-400 text-[10px]'>
                  {progress.streak.lastDate ? 'Active' : 'Inactive'}
                </span>
              </div>
              <ChevronRight size={16} className='cursor-pointer' />
            </div>
            <hr className='bg-gray-300 h-[1.5px] w-full' />
          </div>
        ) : null}
        {totalChaptersRead > 0 ? (
          <div className='flex flex-col gap-2 justify-between items-center mt-4'>
            <div className='w-full flex justify-between items-center'>
              <div className='flex flex-col gap-0'>
                <p className='text-sm'>{totalChaptersRead} Chapters</p>
                <span className='text-gray-400 text-[10px]'>Total read</span>
              </div>
              <ChevronRight size={16} className='cursor-pointer' />
            </div>
            <hr className='bg-gray-300 h-[1.5px] w-full' />
          </div>
        ) : null}

        <div className='flex justify-center items-center pt-5'>
          <button className='flex justify-end items-center text-red-900 cursor-pointer'>
            <p>View More</p>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <button
        onClick={handleContinueReading}
        className='bg-red-900 text-white text-lg py-2 rounded-lg cursor-pointer hover:bg-red-800'
      >
        Continue Reading
      </button>

      <div className='border border-gray-400 rounded-xl p-6'>
        <div className='flex gap-1 items-center text-red-900'>
          <BookMarked size={20} />
          <h4 className='text-lg font-medium'>Daily Verse</h4>
        </div>
        {verseLoading ? (
          <div className='text-red-900 py-3'>Loading verse...</div>
        ) : verse ? (
          <>
            <div className='text-red-900'>
              <p className='text-sm py-3'>{verse.text}</p>
              <h4 className='text-right font-medium'>{verse.reference}</h4>
            </div>
            <div className='px-9'>
              <button
                onClick={handleShareVerse}
                className='w-full bg-red-900 text-white text-sm py-2 mt-3 rounded-lg cursor-pointer hover:bg-red-800'
              >
                Share Verse
              </button>
            </div>
          </>
        ) : (
          <div className='text-red-900 py-3'>Failed to load verse</div>
        )}
      </div>

      <Calendar
        mode="single"
        selected={undefined}
        onSelect={() => {}}
        month={month}
        onMonthChange={setMonth}
        className="rounded-xl w-full md:w-auto md:max-w-md md:mx-auto lg:w-full lg:max-w-none lg:mx-0 border border-gray-200 bg-background p-3"
        captionLayout="dropdown"
        classNames={{
          day: "w-full p-0 text-sm font-normal rounded-full hover:bg-background hover:text-foreground",
        }}
        modifiers={{
          streak: streakDates,
        }}
        modifiersClassNames={{
          streak: "bg-red-900 text-white rounded-full",
        }}
      />
    </div>
  )
}

export default RightSidebar
