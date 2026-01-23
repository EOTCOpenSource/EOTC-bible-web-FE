'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll'

interface CalendarDay {
  day: number
  date: string
  isToday?: boolean
  isSelected?: boolean
}

interface PlanCalendarProps {
  startDate: Date | string
  totalDays: number
  currentDay?: number
  onDaySelect: (dayNumber: number) => void
}

export const PlanCalendar = ({
  startDate,
  totalDays,
  currentDay = 1,
  onDaySelect,
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
      })
    }

    return daysArray
  }, [startDate, totalDays, currentDay])

  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-6">
      <button
        onClick={scrollLeft}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50"
        aria-label="Previous days"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={containerRef}
        className="scrollbar-hide flex flex-1 gap-3 overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map((day) => (
          <button
            key={day.day}
            onClick={() => onDaySelect(day.day)}
            className={`flex min-w-[60px] flex-shrink-0 flex-col items-center justify-center rounded-lg p-3 transition-colors ${
              day.isSelected
                ? 'bg-[#4C0E0F] text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-sm font-bold">{day.day}</span>
            <span className="text-xs">{day.date}</span>
          </button>
        ))}
      </div>

      <button
        onClick={scrollRight}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition-colors hover:bg-gray-50"
        aria-label="Next days"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
