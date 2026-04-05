'use client'

import React, { useEffect, useState, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePlanStore } from '@/stores/usePlanStore'
import { PlanCalendar } from '@/components/plan/planCalander'
import { ReadingItemChecklist } from '@/components/plan/readingItemChecklist'
import { ReadingItem } from '@/types/plans'
import { ChevronLeft } from 'lucide-react'

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  const { fetchPlanById, plans, markDayComplete, isFetching, isMutating } = usePlanStore()
  const [currentDayNumber, setCurrentDayNumber] = useState<number>(1)
  const [localReadItems, setLocalReadItems] = useState<Record<string, boolean>>({})
  
  const plan = plans.find((p) => p._id === id)

  useEffect(() => {
    const loadIds = () => {
      try {
        const stored = localStorage.getItem('readPlanItems')
        if (stored) setLocalReadItems(JSON.parse(stored))
      } catch (e) {}
    }
    loadIds();
    window.addEventListener('localReadUpdate', loadIds);
    window.addEventListener('storage', loadIds);
    return () => {
      window.removeEventListener('localReadUpdate', loadIds);
      window.removeEventListener('storage', loadIds);
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchPlanById(id).then((fetchedPlan) => {
        // find first incomplete day or default to 1
        const firstIncomplete = fetchedPlan.dailyReadings?.find((d: any) => !d.isCompleted)
        if (firstIncomplete) {
          setCurrentDayNumber(firstIncomplete.dayNumber)
        }
      }).catch(console.error)
    }
  }, [id, fetchPlanById])

  if (isFetching && !plan) {
    return <div className="p-4 flex items-center justify-center">Loading plan details...</div>
  }

  if (!plan) {
    return <div className="p-4 flex items-center justify-center">Plan not found.</div>
  }
  
  const handleBack = () => router.push('/dashboard/plans')

  const currentDayData = plan.dailyReadings?.find(d => d.dayNumber === currentDayNumber)
  
  const readingItems: ReadingItem[] = []
  if (currentDayData) {
    currentDayData.readings.forEach((reading, index) => {
      for (let ch = reading.startChapter; ch <= reading.endChapter; ch++) {
        readingItems.push({
          id: `${currentDayData.dayNumber}-${reading.book}-${ch}`,
          isCompleted: currentDayData.isCompleted,
          bookId: reading.book,
          bookName: reading.book,
          title: `${reading.book} ${ch}`,
          chapter: ch,
          day: currentDayData.dayNumber
        })
      }
    })
  }

  const dayStatuses: Record<number, 'completed' | 'started' | 'pending'> = {};
  plan.dailyReadings?.forEach(day => {
    if (day.isCompleted) {
      dayStatuses[day.dayNumber] = 'completed';
    } else {
      let isStarted = false;
      day.readings.forEach(reading => {
        for (let ch = reading.startChapter; ch <= reading.endChapter; ch++) {
          const chId = `${day.dayNumber}-${reading.book}-${ch}`;
          if (localReadItems[chId]) {
            isStarted = true;
          }
        }
      });
      dayStatuses[day.dayNumber] = isStarted ? 'started' : 'pending';
    }
  });

  const handleDayComplete = useCallback(async () => {
    if (currentDayData && !currentDayData.isCompleted) {
      await markDayComplete(plan._id, currentDayData.dayNumber)
    }
  }, [currentDayData, markDayComplete, plan])

  return (
    <div className="p-4 w-full space-y-6">
      <button 
        onClick={handleBack}
        className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
      >
        <ChevronLeft size={16} className="mr-1" /> Back to Plans
      </button>

      <div>
        <h1 className="text-2xl font-bold">{plan.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Day {currentDayNumber} of {plan.durationInDays} - {currentDayData?.isCompleted ? "Completed" : "Not Completed"}
        </p>
      </div>

      <PlanCalendar
        startDate={plan.startDate || new Date()}
        totalDays={plan.durationInDays}
        currentDay={currentDayNumber}
        onDaySelect={setCurrentDayNumber}
        dayStatuses={dayStatuses}
      />

      <div>
        <h2 className="text-xl font-semibold mb-4 text-black dark:bg-background border-2 border-gray-300 rounded-lg bg-white p-6 dark:text-white">
          Readings for Day {currentDayNumber}
        </h2>
        {readingItems.length > 0 ? (
          <ReadingItemChecklist
            items={readingItems}
            onDayComplete={handleDayComplete}
            isLoading={isMutating}
            localReadItems={localReadItems}
          />
        ) : (
          <p className="text-sm text-gray-500">No readings for this day.</p>
        )}
      </div>
    </div>
  )
}
