import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Progress, VerseRef } from './types'

interface ProgressState {
  progress: Progress
  isLoading: boolean
  error?: string | null

  markChapterRead: (book: string, chapter: number) => Promise<void>
  setLastRead: (v: VerseRef) => Promise<void>
  loadProgress: () => Promise<void>
  resetProgressLocal: () => void
}

const initialProgress: Progress = {
  chaptersRead: {},
  streak: { current: 0, longest: 0, lastDate: undefined },
  lastRead: undefined,
}

export const useProgressStore = create<ProgressState>()(
  devtools((set, get) => ({
    progress: initialProgress,
    isLoading: false,
    error: null,

    loadProgress: async () => {
      set({ isLoading: true, error: null })
      try {
        const res = await fetch('https://mylocalbackend/api/v1/user/progress')
        if (!res.ok) throw new Error('Failed to load progress')
        const data: Progress = await res.json()
        set({ progress: data, isLoading: false })
      } catch (err: any) {
        set({ isLoading: false, error: err?.message ?? 'Unknown' })
      }
    },

    markChapterRead: async (book, chapter) => {
      const previousProgress = get().progress
      // USED TO UPDATE THE LOCAL STATE IMMEDIATELY BEFORE CONFIRRMING WITH THE BACKEND
      set((s) => {
        const chapters = { ...s.progress.chaptersRead }
        chapters[book] = Array.from(new Set([...(chapters[book] || []), chapter]))
        return {
          progress: { ...s.progress, chaptersRead: chapters },
          error: null,
        }
      })

      try {
        const res = await fetch('https://mylocalbackend/api/v1/user/progress/mark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ book, chapter }),
        })
        if (!res.ok) {
          throw new Error(`Failed to mark chapter as read: ${res.statusText}`)
        }
        await get().loadProgress()
      } catch (err) {
        // optionally revert or set error
        set({
          progress: previousProgress,
          error: `Failed to mark chapter as read: ${(err as Error).message}`,
        })
      }
    },

    setLastRead: async (v) => {
      const previousProgress = get().progress

      set((s) => ({ progress: { ...s.progress, lastRead: v }, error: null }))
      try {
        const res = await fetch('https://mylocalbackend/api/v1/user/progress/last-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(v),
        })
        if (!res.ok) {
          throw new Error(`Failed to update last read ${res.statusText}`)
        }
      } catch (err) {
        set({
          progress: previousProgress,
          error: (err as Error).message,
        })
      }
    },

    resetProgressLocal: () => set({ progress: initialProgress }),
  })),
)
