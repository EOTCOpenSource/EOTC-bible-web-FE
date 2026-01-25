import React from 'react'
import type { ReadingPlan } from '@/stores/types'
import { cn } from '@/lib/utils'
import { PlanDialogForm } from '@/components/forms/PlanDialogForm'

interface PlanItemProps {
  plan: ReadingPlan
}

const PlanItem: React.FC<PlanItemProps> = ({ plan }) => {
  const {
    _id,
    name,
    startDate,
    durationInDays,
    startBook,
    endBook,
    startChapter,
    endChapter,
    dailyReadings = [],
  } = plan

  const totalDays = dailyReadings.length
  const completedDays = dailyReadings.filter((r) => r.isCompleted).length

  const progressPercent = totalDays === 0 ? 0 : Math.round((completedDays / totalDays) * 100)

  const lastCompletedDate = [...dailyReadings].filter((r) => r.isCompleted).at(-1)?.date

  const start = startDate ? new Date(startDate) : new Date()
  const end = new Date(start)
  end.setDate(start.getDate() + durationInDays - 1)

  return (
    <div className="relative rounded-lg border p-4 pl-22 transition hover:shadow-md">
      {/* Ribbon */}
      <div className="absolute top-0 left-5 flex flex-col items-center gap-1 text-xs">
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

        {lastCompletedDate &&
          (() => {
            const d = new Date(lastCompletedDate)
            return (
              <span className="flex flex-col items-center text-lg leading-tight text-[#4C0E0F]">
                <span className="font-bold">
                  {d.toLocaleDateString(undefined, { month: 'short' })}
                </span>
                <span>{d.getDate()}</span>
              </span>
            )
          })()}
      </div>

      <div className="space-y-3 md:max-w-[150px] lg:max-w-[none]">
        <div className="text-lg font-medium">
          {startBook === endBook
            ? `${startBook} ${startChapter}-${endChapter}`
            : `${startBook} ${startChapter} - ${endBook} ${endChapter}`}
          <span className="text-md text-muted-foreground"> ( {name} )</span>
        </div>

        <div className="text-muted-foreground flex justify-between text-sm">
          <div>
            {completedDays} of {totalDays} days completed
          </div>
          <PlanDialogForm initialData={plan} />
        </div>

        {/* Progress bar */}
        <div className="bg-muted h-2 w-full rounded">
          <div
            className={cn(
              'bg-primary h-full rounded transition-all',
              progressPercent === 0 && 'bg-muted',
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="text-muted-foreground text-xs">
          {start.toLocaleDateString()} – {end.toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}

export default PlanItem
