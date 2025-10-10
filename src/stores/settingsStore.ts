import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createBrowserStorage } from './storage'
import type { VerseRef } from './types'

interface SettingsState {
  preferredTranslation?: string
  theme?: 'light' | 'dark' | 'system'
  fontSize?: 'sm' | 'md' | 'lg' // font size stored in number, e.g. 14, 16, 18 .. on the backend-api
  lastRead?: VerseRef

  isLoading: boolean
  error?: string | null

  loadSettings: () => Promise<void>
  updateSettings: (
    patch: Partial<Omit<SettingsState, 'loadSettings' | 'updateSettings' | 'isLoading' | 'error'>>,
  ) => Promise<void>
  setLastRead: (v: VerseRef) => void
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        preferredTranslation: undefined,
        theme: undefined,
        fontSize: undefined,
        lastRead: undefined,
        isLoading: false,
        error: null,

        loadSettings: async () => {
          set({ isLoading: true, error: null })
          try {
            const res = await fetch('https://mylocalbackend/api/v1/user/settings')
            if (!res.ok) throw new Error('Failed to load settings')
            const data = await res.json()
            set({ ...data, isLoading: false })
          } catch (err: any) {
            set({ isLoading: false, error: err?.message ?? 'Unknown' })
          }
        },

        updateSettings: async (patch) => {
          set({ isLoading: true, error: null })
          try {
            const res = await fetch('https://mylocalbackend/api/v1/user/me', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(patch),
            })
            if (!res.ok) throw new Error('Failed to update settings')
            const updated = await res.json()
            set({ ...updated, isLoading: false })
          } catch (err: any) {
            set({ isLoading: false, error: err?.message ?? 'Unknown' })
          }
        },

        setLastRead: (v) => set({ lastRead: v }),
      }),
      {
        name: 'settings',
        storage: createBrowserStorage('eotc-'),
      },
    ),
  ),
)
