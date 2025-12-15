import React from 'react'
import { books } from '@/data/data'

interface PlanItemProps {
  bookId: string
  chaptersRead: number[]
  streak: {
    current: number
    longest: number
    lastDate?: string
  }
}

const PlanItem: React.FC<PlanItemProps> = ({ bookId, chaptersRead, streak }) => {
    const book = books.find((b) => b.book_name_en === bookId)
    const totalChapters = book?.chapters ?? 0

  const readCount = chaptersRead.length
  const progressPercent = totalChapters > 0 ? Math.round((readCount / totalChapters) * 100) : 0

  return (
    <div className="relative rounded-lg border p-4 pl-22 transition hover:shadow-md">
      {/* Ribbon / Bookmark */}
      <div className="text-muted-foreground absolute top-0 left-5 flex flex-col items-center gap-1 text-xs">
        <svg
          width="39"
          height="48"
          viewBox="0 0 39 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M37.1667 46.25L19.0833 33.3333L1 46.25V4.91667C1 3.54638 1.54434 2.23222 2.51328 1.26328C3.48222 0.294343 4.79638 -0.25 6.16667 -0.25H32C33.3703 -0.25 34.6844 0.294343 35.6534 1.26328C36.6223 2.23222 37.1667 3.54638 37.1667 4.91667V46.25Z"
            fill="#621B1C"
            stroke="#621B1C"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {streak.lastDate &&
          (() => {
            const date = new Date(streak.lastDate)
            const month = date.toLocaleDateString(undefined, { month: 'short' })
            const day = date.toLocaleDateString(undefined, { day: 'numeric' })

            return (
              <span className="flex flex-col items-center text-lg leading-tight text-red-900">
                <span className="font-bold">{month}</span>
                <span>{day}</span>
              </span>
            )
          })()}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="text-lg font-medium">{book?.book_name_am}</div>

        <div className="text-muted-foreground text-sm">
          Chapters read: {readCount}
          {totalChapters > 0 && ` / ${totalChapters}`}
        </div>

        <div className="text-muted-foreground text-sm">Dec 16 - Dec 22</div>
      </div>
    </div>
  )
}

export default PlanItem
