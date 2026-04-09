'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Award, ChevronRight, BookMarked, BookOpen, Flame } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { useDailyVerseStore } from '@/stores/dailyVerseStore'
import { useProgressStore } from '@/stores/progressStore'
import { useAchievementsStore } from '@/stores/achievementStore'

const RightSidebar = () => {
  const router = useRouter()
  const { verse, isLoading: verseLoading, loadDailyVerse } = useDailyVerseStore()
  const { progress, loadProgress } = useProgressStore()
  const { achievements, loadAchievements } = useAchievementsStore()
  const [month, setMonth] = React.useState<Date | undefined>(new Date())

  useEffect(() => {
    loadDailyVerse().catch(() => {})
    loadProgress().catch(() => {})
    loadAchievements().catch(() => {})
  }, [loadDailyVerse, loadProgress, loadAchievements])

  const streakDates: Date[] = []
  if (progress.streak?.lastDate) {
    const lastDate = new Date(progress.streak.lastDate)
    for (let i = 0; i < Math.min(progress.streak.current || 0, 30); i++) {
      const date = new Date(lastDate)
      date.setDate(date.getDate() - i)
      streakDates.push(date)
    }
  }

  // Build a Set of date keys for O(1) lookup when computing chain connectors
  const streakKeySet = React.useMemo(() => {
    const s = new Set<string>()
    for (const d of streakDates) {
      s.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
    }
    return s
  }, [streakDates])

  // Compute chain connector dates:
  // - chainLeft: streak day whose PREVIOUS day is also a streak day AND same week row (not Sunday)
  // - chainRight: streak day whose NEXT day is also a streak day AND same week row (not Saturday)
  const { chainLeft, chainRight } = React.useMemo(() => {
    const left: Date[] = []
    const right: Date[] = []

    for (const d of streakDates) {
      const dayOfWeek = d.getDay()

      // Check previous day (connect left) — skip if Sunday (start of row)
      if (dayOfWeek !== 0) {
        const prev = new Date(d)
        prev.setDate(prev.getDate() - 1)
        if (streakKeySet.has(`${prev.getFullYear()}-${prev.getMonth()}-${prev.getDate()}`)) {
          left.push(d)
        }
      }

      // Check next day (connect right) — skip if Saturday (end of row)
      if (dayOfWeek !== 6) {
        const next = new Date(d)
        next.setDate(next.getDate() + 1)
        if (streakKeySet.has(`${next.getFullYear()}-${next.getMonth()}-${next.getDate()}`)) {
          right.push(d)
        }
      }
    }

    return { chainLeft: left, chainRight: right }
  }, [streakDates, streakKeySet])

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
  const totalAchievements = achievements.length
  const achievementsUnlocked = achievements.filter(a => a.unlocked).length
  const achievementPct = totalAchievements > 0 ? Math.round((achievementsUnlocked / totalAchievements) * 100) : 0

  return (
    <div className="flex w-full flex-col gap-8 py-3 md:gap-6">
      <div className="rounded-xl border border-transparent bg-gradient-to-r from-[#4C0E0F]/20 to-red-900/10 p-5 dark:border-neutral-800 dark:from-red-900/20 dark:to-[#4C0E0F]/20">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#4C0E0F] dark:text-red-400">
            <Award size={20} />
            <h4 className="text-lg font-bold text-black dark:text-white">Achievements</h4>
          </div>
          <span className="rounded-full bg-[#4C0E0F] px-2.5 py-0.5 text-[10px] font-bold text-white dark:bg-red-900/50 dark:text-red-300">
            {achievementsUnlocked}/{totalAchievements > 0 ? totalAchievements : 26}
          </span>
        </div>

        <div className="mb-4">
          <div className="mb-1.5 flex items-end justify-between">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{achievementPct}% complete</p>
            <p className="text-[10px] text-gray-500">{achievementsUnlocked} of {totalAchievements > 0 ? totalAchievements : 26} achievements</p>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">
            <div
              className="h-full rounded-full bg-[#4C0E0F] transition-all duration-1000 dark:bg-red-500"
              style={{ width: `${achievementPct}%` }}
            />
          </div>
        </div>

        <div className="border-b border-gray-300 pb-4 dark:border-neutral-800 flex items-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <BookOpen size={14} className="opacity-70" />
            <span>{totalChaptersRead} chapters</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-orange-500 opacity-70" />
            <span>{progress.streak?.current || 0} day streak</span>
          </div>
        </div>

        <button 
          onClick={() => router.push('/dashboard/achievements')}
          className="mt-4 flex w-full items-center justify-between rounded-lg border border-[#4C0E0F]/20 px-4 py-2 text-sm font-medium text-[#4C0E0F] transition-colors hover:bg-[#4C0E0F]/5 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <span>See all {totalAchievements > 0 ? totalAchievements : 26} achievements</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <button
        onClick={handleContinueReading}
        className="cursor-pointer rounded-lg bg-[#4C0E0F] py-2 text-lg text-white hover:bg-red-800 transition-colors"
      >
        Continue Reading
      </button>

      <div className="rounded-xl border border-gray-400 dark:border-neutral-800 p-6">
        <div className="flex items-center gap-1 text-[#4C0E0F] dark:text-red-400">
          <BookMarked size={20} />
          <h4 className="text-lg font-medium text-black dark:text-white">Daily Verse</h4>
        </div>
        {verseLoading ? (
          <div className="py-3 text-[#4C0E0F] dark:text-red-400">Loading verse...</div>
        ) : verse ? (
          <>
            <div className="text-[#4C0E0F] dark:text-red-400">
              <p className="py-3 text-sm">{verse.text}</p>
              <h4 className="text-right font-medium text-black dark:text-white">{verse.reference}</h4>
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
          <div className="py-3 text-[#4C0E0F] dark:text-red-400">Failed to load verse</div>
        )}
      </div>

      <Calendar
        mode="single"
        selected={undefined}
        onSelect={() => {}}
        month={month}
        onMonthChange={setMonth}
        className="bg-background w-full rounded-xl border border-gray-200 dark:border-neutral-800 p-3 md:mx-auto md:w-auto md:max-w-md lg:mx-0 lg:w-full lg:max-w-none"
        captionLayout="dropdown"
        classNames={{
          day: 'w-full p-0 text-sm font-normal rounded-full hover:bg-background hover:text-foreground dark:text-gray-200',
        }}
        modifiers={{
          streak: streakDates,
          streakChainLeft: chainLeft,
          streakChainRight: chainRight,
        }}
        modifiersClassNames={{
          streak: 'streak-day',
          streakChainLeft: 'streak-chain-left',
          streakChainRight: 'streak-chain-right',
        }}
      />
    </div>
  )
}

export default RightSidebar
