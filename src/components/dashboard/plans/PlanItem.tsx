import React from 'react'
import type { ReadingPlan } from '@/stores/types'
import { cn } from '@/lib/utils'

interface PlanItemProps {
  plan: ReadingPlan
}

const PlanItem: React.FC<PlanItemProps> = ({ plan }) => {
  const { name, startDate, durationInDays, dailyReadings } = plan

  const completedDays = dailyReadings.filter((d) => d.isCompleted)
  const completedCount = completedDays.length

  const progressPercent = Math.round(
    (completedCount / dailyReadings.length) * 100,
  )

  // last completed date (for ribbon)
  const lastCompleted = completedDays.at(-1)?.date

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

        {lastCompleted && (
          (() => {
            const d = new Date(lastCompleted)
            return (
              <span className="flex flex-col items-center text-lg leading-tight text-red-900">
                <span className="font-bold">
                  {d.toLocaleDateString(undefined, { month: 'short' })}
                </span>
                <span>{d.getDate()}</span>
              </span>
            )
          })()
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="text-lg font-medium">{name}</div>

        <div className="text-muted-foreground text-sm">
          {completedCount} of {dailyReadings.length} days completed
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded bg-muted">
          <div
            className={cn(
              'h-full rounded bg-primary transition-all',
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
