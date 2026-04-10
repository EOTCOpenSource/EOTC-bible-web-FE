'use client'

import { ChevronRight, Check } from 'lucide-react'
import Link from 'next/link'
import { ReadingItem } from '@/types/plans'
import { useEffect } from 'react'

interface ReadingItemChecklistProps {
  items: ReadingItem[]
  onDayComplete: () => Promise<void>
  isLoading?: boolean
  localReadItems: Record<string, boolean>
}

export const ReadingItemChecklist = ({
  items,
  onDayComplete,
  isLoading = false,
  localReadItems
}: ReadingItemChecklistProps) => {
  const isDayCompleted = items.length > 0 && items[0].isCompleted

  const markItemLocallyRead = (itemId: string) => {
    setTimeout(() => {
      try {
        const stored = localStorage.getItem('readPlanItems')
        const parsed = stored ? JSON.parse(stored) : {}
        parsed[itemId] = true
        localStorage.setItem('readPlanItems', JSON.stringify(parsed))
        window.dispatchEvent(new Event('localReadUpdate'))
      } catch (e) {
        console.error('Failed to save read items to local storage')
      }
    }, 40000)
  }

  const allItemsReadLocally = items.length > 0 && items.every(item => localReadItems[item.id])

  useEffect(() => {
    if (!isDayCompleted && allItemsReadLocally && !isLoading) {
      onDayComplete()
    }
  }, [allItemsReadLocally, isDayCompleted, isLoading, onDayComplete])

  return (
    <div className="space-y-3 rounded-lg bg-white p-6">
      {items.map(({ id, isCompleted, bookId, title, day, bookName, chapter, description }, index) => {
        const isMarked = isCompleted || localReadItems[id]

        return (
          <div
            key={id}
            className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex flex-1 items-center gap-4">
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${isMarked ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                {isMarked ? <Check size={16} className="text-green-600" /> : <span className="text-xs text-gray-500">{index + 1}</span>}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">
                  {title || `Day ${day}: ${bookName} ${chapter}`}
                </p>
                {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
              </div>
            </div>

            <Link
              href={`/read-online/${bookId.toLowerCase()}/${chapter}`}
              onClick={() => markItemLocallyRead(id)}
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[#4C0E0F] transition-colors hover:bg-red-50"
            >
              <span className="text-sm font-medium">Read</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
