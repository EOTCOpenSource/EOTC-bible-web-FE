import { create } from 'zustand'
import axios from 'axios'

export interface ReadingPlan {
  _id: string
  name: string
  startBook: string
  endBook: string
  durationInDays: number
  dailyReadings: {
    dayNumber: number
    isCompleted: boolean
  }[]
  createdAt: string
}

interface PlanState {
  plans: ReadingPlan[]
  isLoading: boolean
  error: string | null
  fetchPlans: () => Promise<void>
}

export const usePlanStore = create<PlanState>((set) => ({
  plans: [],
  isLoading: false,
  error: null,

  fetchPlans: async () => {
    set({ isLoading: true, error: null })

    try {
      const res = await fetch('/api/reading-plans')

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to load plans')
      }

      set({
        plans: json.data.data,
        isLoading: false,
      })
    } catch (err: any) {
      set({
        error: err.message || 'Failed to load plans',
        isLoading: false,
      })
    }
  },
}))
