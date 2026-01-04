'use client'
import React, { useEffect } from 'react'
import PlanItem from './PlanItem'
import { Skeleton } from '@/components/ui/skeleton'
import { usePlanStore } from '@/stores/usePlanStore'

const PlanList: React.FC = () => {
  const { plans, fetchPlans, error, isFetching } = usePlanStore()

  useEffect(() => {
    fetchPlans()
    console.log('Fetching plans...')
  }, [fetchPlans])

  if (isFetching) {
    return (
      <div className="flex w-full flex-col gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-2 rounded-lg border p-4 shadow-sm">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (plans.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        No reading plans yet. Create one to get started 📖
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {plans.map(plan => (
        <PlanItem key={plan._id} plan={plan} />
      ))}
    </div>
  )
}

export default PlanList
