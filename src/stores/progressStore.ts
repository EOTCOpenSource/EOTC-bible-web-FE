import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import axiosInstance from '@/lib/axios'
import type { Progress, VerseRef } from './types'

interface ProgressState {
  progress: Progress
  isLoading: boolean
  error?: string | null

  markChapterRead: (book: string, chapter: number) => Promise<void>
  setLastRead: (v: VerseRef) => Promise<void>
  loadProgress: () => Promise<void>
  resetProgressLocal: () => void
  clearError: () => void
}

const initialProgress: Progress = {
  chaptersRead: {},
  streak: { current: 0, longest: 0, lastDate: undefined },
  lastRead: undefined,
}

const transformBackendProgress = (backendData: any): Progress => {
  const progressData = backendData?.data?.progress || backendData?.progress || {}
  const streakData = backendData?.data?.streak || backendData?.streak || {}

  const chaptersRead: Record<string, number[]> = {}
  if (progressData.chaptersRead) {
    if (typeof progressData.chaptersRead === 'object' && !Array.isArray(progressData.chaptersRead)) {
      Object.entries(progressData.chaptersRead).forEach(([key, value]) => {
        const [bookId, chapterStr] = key.split(':')
        if (bookId && chapterStr) {
          if (!chaptersRead[bookId]) {
            chaptersRead[bookId] = []
          }
          const chapter = parseInt(chapterStr, 10)
          if (!isNaN(chapter) && !chaptersRead[bookId].includes(chapter)) {
            chaptersRead[bookId].push(chapter)
          }
        }
      })
    }
  }

  return {
    chaptersRead,
    streak: {
      current: streakData.current || 0,
      longest: streakData.longest || 0,
      lastDate: streakData.lastDate || undefined,
    },
    lastRead: progressData.lastRead || undefined,
  }
}

export const useProgressStore = create<ProgressState>()(
  devtools((set, get) => ({
    progress: initialProgress,
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    loadProgress: async () => {
      set({ isLoading: true, error: null })
      try {
        const res = await axiosInstance.get('/api/progress')
        const transformedProgress = transformBackendProgress(res.data)
        set({ progress: transformedProgress, isLoading: false })
      } catch (err: any) {
        set({
          isLoading: false,
          error: err?.response?.data?.error ?? err?.message ?? 'Failed to load progress',
        })
        throw err
      }
    },

    markChapterRead: async (book, chapter) => {
      const previousProgress = get().progress

      set((s) => {
        const chapters = { ...s.progress.chaptersRead }
        chapters[book] = Array.from(new Set([...(chapters[book] || []), chapter]))
        return {
          progress: { ...s.progress, chaptersRead: chapters },
          error: null,
        }
      })

      try {
        await axiosInstance.post('/api/progress', {
          bookId: book,
          chapter,
        })
        await get().loadProgress()
      } catch (err: any) {
        set({
          progress: previousProgress,
          error: err?.response?.data?.error ?? err?.message ?? 'Failed to mark chapter as read',
        })
        throw err
      }
    },

    setLastRead: async (v) => {
      const previousProgress = get().progress

      set((s) => ({ progress: { ...s.progress, lastRead: v }, error: null }))

      try {
        await axiosInstance.post('/api/progress', {
          bookId: v.book,
          chapter: v.chapter,
        })
      } catch (err: any) {
        set({
          progress: previousProgress,
          error: err?.response?.data?.error ?? err?.message ?? 'Failed to update last read',
        })
        throw err
      }
    },

    resetProgressLocal: () => set({ progress: initialProgress }),
  })),
)
