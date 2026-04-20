import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import axiosInstance from '@/lib/axios'
import type { Progress, VerseRef } from './types'
import type { VerseReadEvent } from '@/hooks/useReadingTracker'

interface ProgressState {
  progress: Progress
  isLoading: boolean
  error?: string | null

  markChapterRead: (book: string, chapter: number) => Promise<void>
  setLastRead: (v: VerseRef) => Promise<void>
  syncVerseReadings: (readings: VerseReadEvent[]) => Promise<void>
  flushVerseQueue: () => Promise<void>
  loadProgress: () => Promise<void>
  resetProgressLocal: () => void
  clearError: () => void
}

const READING_QUEUE_KEY = 'eotc-reading-queue-v1'
const MAX_QUEUE_ITEMS = 1000

type QueuedVerseReadEvent = VerseReadEvent

const canUseBrowserStorage = () => typeof window !== 'undefined' && !!window.localStorage

const readQueueFromStorage = (): QueuedVerseReadEvent[] => {
  if (!canUseBrowserStorage()) return []
  try {
    const raw = window.localStorage.getItem(READING_QUEUE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as QueuedVerseReadEvent[]) : []
  } catch {
    return []
  }
}

const writeQueueToStorage = (queue: QueuedVerseReadEvent[]) => {
  if (!canUseBrowserStorage()) return
  try {
    window.localStorage.setItem(READING_QUEUE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE_ITEMS)))
  } catch {
    // ignore storage failures (quota, private mode, etc.)
  }
}

const toVerseKey = (e: Pick<VerseReadEvent, 'bookId' | 'chapter' | 'verse'>) =>
  `${e.bookId.toLowerCase()}:${e.chapter}:${e.verse}`

const mergeQueue = (existing: QueuedVerseReadEvent[], incoming: QueuedVerseReadEvent[]) => {
  const map = new Map<string, QueuedVerseReadEvent>()
  for (const item of existing) map.set(toVerseKey(item), item)
  for (const item of incoming) {
    const key = toVerseKey(item)
    const prev = map.get(key)
    if (!prev) {
      map.set(key, item)
      continue
    }
    map.set(key, {
      ...prev,
      // Keep the most recent timestamp and the largest readDuration we observed.
      timestamp: Math.max(prev.timestamp, item.timestamp),
      readDuration: Math.max(prev.readDuration, item.readDuration),
    })
  }
  return Array.from(map.values()).slice(-MAX_QUEUE_ITEMS)
}

let drainInFlight = false
let drainRetryTimer: number | null = null
let drainBackoffMs = 1000

const scheduleDrain = (drainFn: () => Promise<void>) => {
  if (typeof window === 'undefined') return
  if (drainRetryTimer != null) return
  const jitter = Math.floor(Math.random() * 250)
  const delay = Math.min(60_000, drainBackoffMs) + jitter
  drainRetryTimer = window.setTimeout(() => {
    drainRetryTimer = null
    void drainFn()
  }, delay)
  drainBackoffMs = Math.min(60_000, drainBackoffMs * 2)
}

const resetBackoff = () => {
  drainBackoffMs = 1000
  if (typeof window !== 'undefined' && drainRetryTimer != null) {
    window.clearTimeout(drainRetryTimer)
    drainRetryTimer = null
  }
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
      Object.entries(progressData.chaptersRead).forEach(([key]) => {
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
        if (err?.response?.status === 401) {
          set({ isLoading: false, progress: initialProgress, error: null })
          return
        }
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

    flushVerseQueue: async () => {
      // Drain whatever is in localStorage (survives refresh/offline).
      await get().syncVerseReadings([])
    },

    syncVerseReadings: async (readings) => {
      const queue = mergeQueue(readQueueFromStorage(), readings || [])
      writeQueueToStorage(queue)

      const drain = async () => {
        if (drainInFlight) return
        if (typeof navigator !== 'undefined' && navigator.onLine === false) return

        const stored = readQueueFromStorage()
        if (stored.length === 0) {
          resetBackoff()
          return
        }

        drainInFlight = true
        try {
          // Send in smaller batches to reduce payload risk.
          const batchSize = 200
          const toSend = stored.slice(0, batchSize)

          await axiosInstance.post('/api/progress/sync-verses', {
            readings: toSend.map((r) => ({
              bookId: r.bookId,
              chapter: r.chapter,
              verse: r.verse,
              readDuration: r.readDuration,
              timestamp: r.timestamp,
            })),
          })

          // Remove sent items (dedupe by verse key).
          const sentKeys = new Set(toSend.map((r) => toVerseKey(r)))
          const remaining = stored.filter((r) => !sentKeys.has(toVerseKey(r)))
          writeQueueToStorage(remaining)

          resetBackoff()

          // If more remains, keep draining.
          if (remaining.length > 0) {
            drainInFlight = false
            await drain()
            return
          }

          // Refresh progress from server after successful drain.
          await get().loadProgress()
        } catch (err: any) {
          set({
            error: err?.response?.data?.error ?? err?.message ?? 'Failed to sync verse readings',
          })
          scheduleDrain(drain)
        } finally {
          drainInFlight = false
        }
      }

      await drain()
    },

    resetProgressLocal: () => set({ progress: initialProgress }),
  })),
)
