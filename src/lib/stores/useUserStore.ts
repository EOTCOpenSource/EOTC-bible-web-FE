import { create } from 'zustand'
import axiosInstance from '@/lib/axios'

type User = {
  id: string
  email: string
  name?: string
  avatarUrl?: string | null
  settings?: {
    theme: 'light' | 'dark'
    fontSize: number
  }
}

type AuthState = {
  user: User | null
  isLoggedIn: boolean
  setUser: (user: User | null) => void
  updateSettings: (settings: Partial<User['settings']>) => void
  loadSession: () => Promise<void>
}

export const useUserStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  setUser: (user) => {
    const sanitizedUser = user ? {
      ...user,
      avatarUrl: user.avatarUrl?.replace('/avatars/avatars/', '/avatars/').replace('avatars/avatars/', 'avatars/')
    } : null
    set({ user: sanitizedUser, isLoggedIn: !!sanitizedUser })
  },

  updateSettings: (newSettings) =>
    set((state) => ({
      user: state.user
        ? {
          ...state.user,
          settings: { ...state.user.settings, ...newSettings } as User['settings'],
        }
        : null,
    })),

  loadSession: async () => {
    try {
      const res = await axiosInstance.get('/api/auth/profile')

      if (res.status !== 200) {
        if (res.status === 401) {
          set({ user: null, isLoggedIn: false })
          return
        }
        throw new Error(`HTTP ${res.status}`)
      }

      const userData = res.data
      const user = userData.user

      const sanitizedUser = user ? {
        ...user,
        avatarUrl: user.avatarUrl?.replace('/avatars/avatars/', '/avatars/').replace('avatars/avatars/', 'avatars/')
      } : null

      set({ user: sanitizedUser, isLoggedIn: true })
    } catch (err) {
      console.error('Load session error:', err)
      set({ user: null, isLoggedIn: false })
    }
  },
}))
