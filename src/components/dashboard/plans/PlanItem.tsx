import React from 'react'
import Link from 'next/link'
import type { ReadingPlan } from '@/stores/types'
import { cn } from '@/lib/utils'
import { PlanDialogForm } from '@/components/forms/PlanDialogForm'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface PlanItemProps {
  plan: ReadingPlan
}

const PlanItem: React.FC<PlanItemProps> = ({ plan }) => {
  const {
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

  let stringOfName: string =
    startBook === endBook
      ? `${startBook} ${startChapter}-${endChapter}`
      : `${startBook} ${startChapter} - ${endBook} ${endChapter}`

  return (
    <div className="relative rounded-lg border bg-white p-4 pl-4 transition hover:shadow-md md:pl-22 dark:border-neutral-800 dark:bg-[#1A1A1A] dark:hover:shadow-neutral-900">
      {/* Ribbon */}
      <div className="absolute top-0 left-5 hidden flex-col items-center gap-1 text-xs md:block">
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
              <span className="z-10 flex flex-col items-center pt-1 text-lg leading-tight text-[#4C0E0F] dark:text-gray-100">
                <span className="font-bold">
                  {d.toLocaleDateString(undefined, { month: 'short' })}
                </span>
                <span>{d.getDate()}</span>
              </span>
            )
          })()}
      </div>
      <div className="space-y-3 md:max-w-[150px] lg:max-w-none">
        <Link href={`/dashboard/plans/${plan._id}`}>
          <div className="text-lg font-medium text-black dark:text-white">
            <span>
              {stringOfName.length > 30 ? `${stringOfName.slice(0, 30)}...` : stringOfName}
            </span>
            <span className="text-md text-muted-foreground ml-2 hidden max-w-[80%] md:block dark:text-gray-400">
              {' '}
              ( {name} )
            </span>
          </div>
        </Link>
        <div className="text-muted-foreground flex justify-between text-sm dark:text-gray-400">
          <div>
            {completedDays} of {totalDays} days completed
          </div>
          <PlanDialogForm initialData={plan} />
        </div>

        {/* Progress bar */}
        <div className="bg-muted h-2 w-full rounded dark:bg-neutral-800">
          <div
            className={cn(
              'bg-primary h-full rounded transition-all',
              progressPercent === 0 && 'bg-muted',
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="text-muted-foreground text-xs dark:text-gray-400">
          {start.toLocaleDateString()} – {end.toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}

export default PlanItem
