import React, { useEffect } from 'react'
import PlanItem from './PlanItem'
import { Skeleton } from '@/components/ui/skeleton'
import { usePlanStore } from '@/stores/usePlanStore'

const PlanList: React.FC = () => {
  const { plans, fetchPlans, error, isLoading } = usePlanStore()

  useEffect(() => {
    fetchPlans()
    return () => {

    }
  }, [fetchPlans])

  if (isLoading) {
    return (
      <div className="flex flex-col w-full gap-4">
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
      <div className="text-center text-muted-foreground py-8">
        No reading plans yet. Create one to get started 📖
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full gap-4">
      {plans.map((plan: any) => (
        <PlanItem
          key={plan._id}
          plan={plan}
        />
      ))}
    </div>
  )
}

export default PlanList
