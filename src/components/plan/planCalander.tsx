'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll'
import { Button } from '../ui/button'

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
  const { containerRef, scrollLeft, scrollRight } = useHorizontalScroll(200)

  const days = useMemo(() => {
    const start = new Date(startDate)
    const daysArray: CalendarDay[] = []

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(start)
      currentDate.setDate(currentDate.getDate() + i)

      daysArray.push({
        day: i + 1,
        date: currentDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        isToday: i + 1 === currentDay,
        isSelected: i + 1 === currentDay,
        status: dayStatuses?.[i + 1] || 'pending',
      })
    }

    return daysArray
  }, [startDate, totalDays, currentDay, dayStatuses])

  return (
    <div className="flex items-center gap-2 dark:bg-background border-2 border-gray-300 rounded-lg bg-white p-3">
      <Button
        onClick={scrollLeft}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50"
        aria-label="Previous days"
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
          let statusColors = 'border-gray-300 text-gray-700 hover:bg-gray-50'
          if (day.status === 'completed') {
            statusColors = 'border-green-600 text-green-700 bg-green-50'
          } else if (day.status === 'started') {
            statusColors = 'border-amber-500 text-amber-700 bg-amber-50'
          }

          return (
            <button
              key={day.day}
              onClick={() => onDaySelect(day.day)}
              className={`flex min-w-[60px] flex-shrink-0 flex-col items-center justify-center rounded-lg p-3 transition-colors border-2 ${
                day.isSelected
                  ? 'bg-[#4C0E0F] text-white border-[#4C0E0F]'
                  : statusColors
              }`}
            >
              <span className="text-sm font-bold">{day.day}</span>
              <span className="text-xs">{day.date}</span>
            </button>
          )
        })}
      </div>

      <Button
        onClick={scrollRight}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50"
        aria-label="Next days"
        size="sm"
        variant="outline"
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  )
}
