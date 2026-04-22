'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll'
import { Button } from '../ui/button'
import { useTranslations, useLocale } from 'next-intl'

interface CalendarDay {
  day: number
  date: string
  isToday?: boolean
  isSelected?: boolean
  status?: 'completed' | 'started' | 'pending'
}

interface PlanCalendarProps {
  startDate: Date | string
  totalDays: number
  currentDay?: number
  onDaySelect: (dayNumber: number) => void
  dayStatuses?: Record<number, 'completed' | 'started' | 'pending'>
}

export const PlanCalendar = ({
  startDate,
  totalDays,
  currentDay = 1,
  onDaySelect,
  dayStatuses,
}: PlanCalendarProps) => {
  const t = useTranslations('PlansExplore')
  const locale = useLocale()
  const { containerRef, scrollLeft, scrollRight } = useHorizontalScroll(200)

  const days = useMemo(() => {
    const start = new Date(startDate)
    const daysArray: CalendarDay[] = []

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(start)
      currentDate.setDate(currentDate.getDate() + i)

      daysArray.push({
        day: i + 1,
        date: currentDate.toLocaleDateString(locale === 'am' ? 'am-ET' : 'en-US', {
          month: 'short',
          day: 'numeric',
        }),
        isToday: i + 1 === currentDay,
        isSelected: i + 1 === currentDay,
        status: dayStatuses?.[i + 1] || 'pending',
      })
    }

    return daysArray
  }, [startDate, totalDays, currentDay, dayStatuses, locale])

  return (
    <div className="flex items-center gap-2 border border-border rounded-lg bg-card p-3 shadow-sm">
      <Button
        onClick={scrollLeft}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-input transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label={t('prevDays')}
        size="sm"
        variant="outline"
      >
        <ChevronLeft size={20} />
      </Button>

      <div
        ref={containerRef}
        className="scrollbar-hide flex flex-1 gap-2 overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map((day) => {
          let statusColors = 'border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          
          if (day.status === 'completed') {
            statusColors = 'border-green-500/30 text-green-600 bg-green-500/10 dark:text-green-400 dark:border-green-500/20'
          } else if (day.status === 'started') {
            statusColors = 'border-amber-500/30 text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
          }

          return (
            <button
              key={day.day}
              onClick={() => onDaySelect(day.day)}
              className={`flex min-w-[60px] shrink-0 flex-col items-center justify-center rounded-lg p-3 transition-colors border ${
                day.isSelected
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : statusColors
              }`}
            >
              <span className="text-sm font-bold">{day.day}</span>
              <span className="text-[10px] uppercase opacity-80">{day.date}</span>
            </button>
          )
        })}
      </div>

      <Button
        onClick={scrollRight}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-input transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label={t('nextDays')}
        size="sm"
        variant="outline"
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  )
}
