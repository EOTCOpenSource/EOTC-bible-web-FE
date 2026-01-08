import { create } from 'zustand'
import axios from 'axios'
import type { ReadingPlan } from './types'
import axiosInstance from '@/lib/axios'

type CreatePlanPayload = {
  name: string
  startBook: string
  endBook: string
  startChapter: number
  endChapter: number
  startDate: string
  durationInDays: number
}

type UpdatePlanPayload = Partial<
  Pick<
    ReadingPlan,
    | 'name'
    | 'startBook'
    | 'endBook'
    | 'startChapter'
    | 'endChapter'
    | 'startDate'
    | 'durationInDays'
  >
>

interface PlanState {
  plans: ReadingPlan[]

  isFetching: boolean
  isMutating: boolean
  error: string | null

  fetchPlans: () => Promise<void>
  createPlan: (payload: CreatePlanPayload) => Promise<void>
  updatePlan: (id: string, payload: UpdatePlanPayload) => Promise<void>
  deletePlan: (id: string) => Promise<void>
}

export const usePlanStore = create<PlanState>((set) => ({
  plans: [],
  isFetching: false,
  isMutating: false,
  error: null,

  /* -------- Fetch all plans -------- */
  fetchPlans: async (page = 1, limit = 10) => {
    set({ isFetching: true, error: null })

    try {
      const res = await axios.get('/api/reading-plans', {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // if your backend requires auth
        },
      })

      // Correct path: data.data.items
      const plans: ReadingPlan[] = res.data?.data?.data ?? []

      set({
        plans,
        isFetching: false,
      })
    } catch (err: any) {
      set({
        plans: [],
        isFetching: false,
        error:
          err?.response?.data?.message || // backend error
          err?.message || // axios/network error
          'Failed to load plans',
      })
    }
  },

  /* -------- Create plan -------- */
  createPlan: async (payload) => {
    set({ isMutating: true, error: null })

    try {
      const res = await axios.post('/api/reading-plans', payload)

      // Be explicit about where the plan lives in the response
      const newPlan: ReadingPlan | null = res.data?.data?.plan ?? null

      if (!newPlan || !newPlan._id) {
        throw new Error('Invalid plan returned from server')
      }

      set((state) => ({
        plans: [...state.plans, newPlan],
        isMutating: false,
      }))
    } catch (err: any) {
      set({
        isMutating: false,
        error: err?.response?.data?.error || err?.message || 'Failed to create plan',
      })
    }
  },

  /* -------- Update plan -------- */
  updatePlan: async (id, payload) => {
    set({ isMutating: true, error: null })

    try {
      const res = await axiosInstance.put(`/api/reading-plans/${id}`, payload)

      const updatedPlan: ReadingPlan = res.data?.data

      set((state) => ({
        plans: state.plans.map((plan) => (plan._id === id ? updatedPlan : plan)),
        isMutating: false,
      }))
    } catch (err: any) {
      set({
        isMutating: false,
        error: err?.response?.data?.error || err?.message || 'Failed to update plan',
      })
    }
  },

  /* -------- Delete plan -------- */
  deletePlan: async (id) => {
    set({ isMutating: true, error: null })

    try {
      await axios.delete(`/api/reading-plans/${id}`)

      set((state) => ({
        plans: state.plans.filter((plan) => plan._id !== id),
        isMutating: false,
      }))
    } catch (err: any) {
      set({
        isMutating: false,
        error: err?.response?.data?.error || err?.message || 'Failed to delete plan',
      })
    }
  },
}))
