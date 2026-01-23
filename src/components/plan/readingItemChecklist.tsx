'use client'

import { ChevronRight, Check } from 'lucide-react'
import Link from 'next/link'
import { ReadingItem } from '@/types/plans'
import { useState } from 'react'

interface ReadingItemChecklistProps {
  items: ReadingItem[]
  onItemComplete: (itemId: string) => Promise<void>
  isLoading?: boolean
}

export const ReadingItemChecklist = ({
  items,
  onItemComplete,
  isLoading = false,
}: ReadingItemChecklistProps) => {
  const [completingId, setCompletingId] = useState<string | null>(null)

  const handleCompleteClick = async (itemId: string) => {
    setCompletingId(itemId)
    try {
      await onItemComplete(itemId)
    } finally {
      setCompletingId(null)
    }
  }

  return (
    <div className="space-y-3 rounded-lg bg-white p-6">
      {items.map(({ id, isCompleted, bookId, title, day, bookName, chapter, description }) => (
        <div
          key={id}
          className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
        >
          <div className="flex flex-1 items-center gap-4">
            <button
              onClick={() => handleCompleteClick(id)}
              disabled={completingId === id || isLoading}
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                isCompleted
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              aria-label={`Mark "${title}" complete`}
            >
              {isCompleted && <Check size={16} className="text-green-600" />}
            </button>

            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900">
                {title || `Day ${day}: ${bookName} ${chapter}`}
              </p>
              {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
            </div>
          </div>

          <Link
            href={`/read-online/${bookId}/${chapter}`}
            className="flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[#4C0E0F] transition-colors hover:bg-red-50"
          >
            <span className="text-sm font-medium">Read</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      ))}
    </div>
  )
}
