'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import axiosInstance from '@/lib/axios'
import type { User } from './types'

interface TelegramAuthData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error?: string | null
  success?: string | null

  // OTP states
  otpStatus: 'idle' | 'pending' | 'verified' | 'failed'
  otpCountdown: number

  // Auth actions
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  login: (data: { email: string; password: string }) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<void>
  loginWithFacebook: (accessToken: string) => Promise<void>
  loginWithTelegram: (telegramData: TelegramAuthData) => Promise<void>
  logout: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
  clearError: () => void
  verifyOtp: (email: string, otp: string) => Promise<void>
  resendOtp: (email: string, name: string) => Promise<void>
  startCountdown: (seconds: number) => void
}

export const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    success: null,

    otpStatus: 'idle',
    otpCountdown: 0,

    clearError: () => set({ error: null, success: null }),

    fetchCurrentUser: async () => {
      set({ isLoading: true })
      try {
        const res = await axiosInstance.get('/api/auth/profile')
        const user: User = res.data.user
        set({ user, isAuthenticated: true, isLoading: false })
      } catch {
        set({ user: null, isAuthenticated: false, isLoading: false })
      }
    },

    register: async ({ name, email, password }) => {
      set({ isLoading: true, error: null, success: null })
      try {
        await axiosInstance.post('/api/auth/register', {
          name,
          email,
          password,
        })

        set({
          success: 'Registration successful, please verify your email.',
          otpStatus: 'idle',
        })
      } catch (err: any) {
        set({ error: err?.response?.data?.error ?? 'Registration failed' })
        throw err
      } finally {
        set({ isLoading: false })
      }
    },

    login: async ({ email, password }) => {
      set({ isLoading: true, error: null, success: null })
      try {
        await axiosInstance.post('/api/auth/login', { email, password })
        await get().fetchCurrentUser()
      } catch (err: any) {
        set({ error: err?.response?.data?.error ?? 'Login failed' })
        throw err
      } finally {
        set({ isLoading: false })
      }
    },

    loginWithGoogle: async (idToken: string) => {
      set({ isLoading: true, error: null, success: null })
      try {
        await axiosInstance.post('/api/auth/social/google', { idToken })
        await get().fetchCurrentUser()
      } catch (err: any) {
        set({ error: err?.response?.data?.error ?? 'Google login failed' })
        throw err
      } finally {
        set({ isLoading: false })
      }
    },

    loginWithFacebook: async (accessToken: string) => {
      set({ isLoading: true, error: null, success: null })
      try {
        await axiosInstance.post('/api/auth/social/facebook', { accessToken })
        await get().fetchCurrentUser()
      } catch (err: any) {
        set({ error: err?.response?.data?.error ?? 'Facebook login failed' })
        throw err
      } finally {
        set({ isLoading: false })
      }
    },

    loginWithTelegram: async (telegramData: TelegramAuthData) => {
      set({ isLoading: true, error: null, success: null })
      try {
        await axiosInstance.post('/api/auth/social/telegram', telegramData)
        await get().fetchCurrentUser()
      } catch (err: any) {
        set({ error: err?.response?.data?.error ?? 'Telegram login failed' })
        throw err
      } finally {
        set({ isLoading: false })
      }
    },

    logout: async () => {
      try {
        await axiosInstance.post('/api/auth/logout', {})
      } finally {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          success: null,
          otpStatus: 'idle',
          otpCountdown: 0,
        })
      }
    },

    verifyOtp: async (email: string, otp: string) => {
      set({ otpStatus: 'pending', error: null, success: null })
      try {
        const res = await axiosInstance.post('/api/auth/verify-otp', {
          email,
          otp,
        })

        if (res.data.success) {
          set({
            otpStatus: 'verified',
            success: 'Email verified successfully!',
          })
          await get().fetchCurrentUser()
        } else {
          set({
            otpStatus: 'failed',
            error: res.data.error ?? 'Invalid OTP code',
          })
        }
      } catch (err: any) {
        set({
          otpStatus: 'failed',
          error: err?.response?.data?.error ?? 'OTP verification failed',
        })
      }
    },

    resendOtp: async (email: string, name: string) => {
      try {
        await axiosInstance.post('/api/auth/resend-otp', { email, name })
        set({ success: 'OTP resent successfully. Check your email.' })
      } catch (err: any) {
        set({ error: err?.response?.data?.error ?? 'Failed to resend OTP' })
      }
    },

    startCountdown: (seconds: number) => {
      set({ otpCountdown: seconds })
      const interval = setInterval(() => {
        set((state) => {
          if (state.otpCountdown <= 1) {
            clearInterval(interval)
            return { otpCountdown: 0 }
          }
          return { otpCountdown: state.otpCountdown - 1 }
        })
      }, 1000)
    },
  })),
)
