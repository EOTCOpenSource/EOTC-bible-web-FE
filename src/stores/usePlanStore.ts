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

  createPlan: (planData: {
    name: string
    startBook: string
    endBook: string
    startChapter: number
    endChapter: number
    startDate: string
    durationInDays: number
  }) => Promise<void>

  fetchPlans: () => Promise<void>

  updatePlan: (id: string, updatedData: Partial<ReadingPlan>) => Promise<void>
  deletePlan: (id: string) => Promise<void>
}

export const usePlanStore = create<PlanState>((set) => ({
  plans: [],
  isLoading: false,
  error: null,

  createPlan: async (planData) => {
    set({ isLoading: true, error: null })

    try {
      const res = await axios.post('/api/reading-plans', planData)

      if (res.status < 200 || res.status >= 300) {
        throw new Error(res.data?.error || 'Failed to create plan')
      }

      set((state) => ({ plans: [...state.plans, res.data.data], isLoading: false }))
    } catch (err: any) {
      set({ error: err.message || 'Failed to create plan', isLoading: false })
    }
  },

  fetchPlans: async () => {
    set({ isLoading: true, error: null })

    try {
      const res = await fetch('/api/reading-plans')
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to load plans')
      }

      set({ plans: json.data.data, isLoading: false })
    } catch (err: any) {
      set({ error: err.message || 'Failed to load plans', isLoading: false })
    }
  },

  updatePlan: async (id, updatedData) => {
    set({ isLoading: true, error: null })

    try {
      const res = await axios.put(`/api/reading-plans/${id}`, updatedData)

      if (res.status < 200 || res.status >= 300) {
        throw new Error(res.data?.error || 'Failed to update plan')
      }

      set((state) => ({
        plans: state.plans.map((plan) => (plan._id === id ? res.data.data : plan)),
        isLoading: false,
      }))
    } catch (err: any) {
      set({ error: err.message || 'Failed to update plan', isLoading: false })
    }
  },

  deletePlan: async (id) => {
    set({ isLoading: true, error: null })

    try {
      const res = await axios.delete(`/api/reading-plans/${id}`)

      if (res.status < 200 || res.status >= 300) {
        throw new Error(res.data?.error || 'Failed to delete plan')
      }

      set((state) => ({
        plans: state.plans.filter((plan) => plan._id !== id),
        isLoading: false,
      }))
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete plan', isLoading: false })
    }
  },
}))
