import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { User } from './types'

interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error?: string | null

  setUser: (u: User | null) => void
  loadUser: () => Promise<void>
  clearError: () => void
}

export const useUserStore = create<UserState>()(
  devtools((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: false,
    //i WILL IMPLEMENT THE GET HELPER FOR FEATURE THAT WILL REQUIRE CURRENT STATE CHECK
    setUser: (u) => set({ user: u, isAuthenticated: !!u, error: null }),
    clearError: () => set({ error: null }),

    loadUser: async () => {
      set({ isLoading: true, error: null })
      try {
        const res = await fetch('https://mylocalbackend/api/v1/user/me')
        if (!res.ok) throw new Error('Failed to fetch the user info')
        const data = (await res.json()) as User
        set({ user: data, isAuthenticated: true, isLoading: false })
      } catch (err: any) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: err?.message ?? 'Unknown',
        })
      }
    },
  })),
)
