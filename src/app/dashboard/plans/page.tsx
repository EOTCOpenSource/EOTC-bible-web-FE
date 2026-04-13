'use client'

import React, { useEffect, useState } from 'react'
import PlansList from '@/components/dashboard/plans/PlansList'
import { useProgressStore } from '@/stores/progressStore'
import { usePlanStore } from '@/stores/usePlanStore'
import { toast } from 'sonner'
import { PlanDialogForm } from '@/components/forms/PlanDialogForm'
import { useSearchParams, useRouter } from 'next/navigation'
import { getPlanTemplateBySlug } from '@/lib/planTemplates'

const BookmarksPage = () => {
  const { loadProgress } = useProgressStore()
  const { plans, fetchPlans, isFetching } = usePlanStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  const templateSlug = searchParams.get('template') || ''
  const create = searchParams.get('create') === '1'
  const template = React.useMemo(() => (templateSlug ? getPlanTemplateBySlug(templateSlug) : undefined), [templateSlug])

  const [shouldOpen, setShouldOpen] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  useEffect(() => {
    let active = true
    fetchPlans().finally(() => {
      if (active) setHasFetched(true)
    })
    return () => {
      active = false
    }
  }, [fetchPlans])

  useEffect(() => {
    if (!hasFetched) return

    if (template) {
      const activeMatch = plans.find((p: any) => {
        const isCompleted =
          p.status === 'completed' ||
          (Array.isArray(p.dailyReadings) &&
            p.dailyReadings.length > 0 &&
            p.dailyReadings.every((r: any) => r.isCompleted))

        const isMatch =
          p.name === template.title &&
          p.startBook === template.startBook &&
          p.startChapter === template.startChapter &&
          p.endBook === template.endBook &&
          p.endChapter === template.endChapter &&
          p.durationInDays === template.durationInDays

        return isMatch && !isCompleted
      })

      if (activeMatch) {
        toast.error('You already have an active plan for this template.')
        router.replace('/dashboard/plans')
        return
      }
    }

    // If no active match or just generic create mode
    if (Boolean(template) || create) {
      setShouldOpen(true)
    }
  }, [hasFetched, plans, template, create, router])

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl font-bold">Plans</h1>
        <PlanDialogForm
          defaultOpen={shouldOpen}
          hideTrigger={shouldOpen}
          initialValues={
            template
              ? {
                  name: template.title,
                  startBook: template.startBook,
                  startChapter: template.startChapter,
                  endBook: template.endBook,
                  endChapter: template.endChapter,
                  startDate: new Date(),
                  durationInDays: template.durationInDays,
                }
              : undefined
          }
          onCreated={(plan) => {
            router.replace(`/dashboard/plans/${plan._id}`)
          }}
        />
      </div>
      <PlansList />
    </div>
  )
}

export default BookmarksPage
