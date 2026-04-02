import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import axiosInstance from '@/lib/axios'

interface NotificationState {
  dailyReadingEnabled: boolean
  isLoading: boolean
  error?: string | null

  loadNotificationStatus: () => Promise<void>
  toggleDailyReading: () => Promise<void>
  clearError: () => void
}

export const useNotificationStore = create<NotificationState>()(
  devtools((set, get) => ({
    dailyReadingEnabled: false,
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    loadNotificationStatus: async () => {
      set({ isLoading: true, error: null })
      try {
        const res = await axiosInstance.get('/api/notifications/status')
        const data = res.data?.data ?? res.data ?? {}
        set({
          dailyReadingEnabled: data.dailyReadingEnabled ?? data.enabled ?? data.notificationsEnabled ?? false,
          isLoading: false,
        })
      } catch (err: any) {
        if (err?.response?.status === 401) {
          set({ isLoading: false, dailyReadingEnabled: false, error: null })
          return
        }
        set({
          isLoading: false,
          error: err?.response?.data?.error ?? err?.message ?? 'Failed to load notification status',
        })
      }
    },

    toggleDailyReading: async () => {
      const previousValue = get().dailyReadingEnabled
      const newValue = !previousValue

      // Optimistic update
      set({ dailyReadingEnabled: newValue, error: null })

      try {
        const res = await axiosInstance.put('/api/notifications/toggle', {
          enabled: newValue,
        })

        // Sync with server response if available
        const data = res.data?.data ?? res.data ?? {}
        const serverValue = data.dailyReadingEnabled ?? data.enabled ?? data.notificationsEnabled
        if (typeof serverValue === 'boolean') {
          set({ dailyReadingEnabled: serverValue })
        }
      } catch (err: any) {
        // Rollback optimistic update
        set({
          dailyReadingEnabled: previousValue,
          error: err?.response?.data?.error ?? err?.message ?? 'Failed to toggle notification',
        })
        throw err
      }
    },
  })),
)
