import { useCallback, useEffect, useRef, useState } from 'react'

export interface VerseReadEvent {
  bookId: string
  chapter: number
  verse: number
  timestamp: number
  readDuration: number // milliseconds of active reading time
}

export interface ReadingTrackerConfig {
  // Minimum active reading time (ms) required to count a verse as "read".
  minReadDuration?: number // default: 3000
  // After any user activity, we count time for this long as "engaged reading".
  // This prevents "open page + wait + click next" from counting as reading.
  engagementWindow?: number // default: 8000
  // Time (ms) of no activity before considered idle.
  idleTimeout?: number // default: 30000
  // Time (ms) between syncing progress to backend.
  syncInterval?: number // default: 10000
  // Time (ms) between active-time accumulation ticks.
  tickInterval?: number // default: 250
  onVerseRead?: (event: VerseReadEvent) => void
  onSyncProgress?: (verses: VerseReadEvent[]) => void | Promise<void>
}

type VerseKey = `${string}:${number}:${number}`

const toKey = (bookId: string, chapter: number, verse: number): VerseKey =>
  `${bookId.toLowerCase()}:${chapter}:${verse}`

export function useReadingTracker({
  minReadDuration = 3000,
  engagementWindow = 8000,
  idleTimeout = 30000,
  syncInterval = 10000,
  tickInterval = 250,
  onVerseRead,
  onSyncProgress,
}: ReadingTrackerConfig = {}) {
  const readVersesRef = useRef<Map<VerseKey, VerseReadEvent>>(new Map())
  const versesToSyncRef = useRef<VerseReadEvent[]>([])

  const currentVerseRef = useRef<{ bookId: string; chapter: number; verse: number } | null>(null)
  const currentVerseActiveMsRef = useRef<number>(0)

  const lastTickAtRef = useRef<number>(Date.now())
  const lastActivityAtRef = useRef<number>(Date.now())
  const engagedUntilRef = useRef<number>(0)
  const hadEngagementSinceVerseStartRef = useRef<boolean>(false)

  const [isTabVisible, setIsTabVisible] = useState(true)
  const [isIdle, setIsIdle] = useState(false)

  const isVerseRead = useCallback((bookId: string, chapter: number, verse: number) => {
    return readVersesRef.current.has(toKey(bookId, chapter, verse))
  }, [])

  const getVersesReadCount = useCallback(() => readVersesRef.current.size, [])
  const getReadVerses = useCallback(() => Array.from(readVersesRef.current.values()), [])

  const markCurrentVerseAsRead = useCallback(
    (reason: 'switch' | 'hidden' | 'unmount') => {
      const current = currentVerseRef.current
      if (!current) return

      // Must have at least one engagement event while on this verse.
      if (!hadEngagementSinceVerseStartRef.current) return

      const activeMs = currentVerseActiveMsRef.current
      if (activeMs < minReadDuration) return

      const now = Date.now()
      const key = toKey(current.bookId, current.chapter, current.verse)
      if (readVersesRef.current.has(key)) return

      // If the tab is hidden, only count if we already had engagement (still true here).
      if (!isTabVisible && reason === 'switch') return

      const event: VerseReadEvent = {
        bookId: current.bookId,
        chapter: current.chapter,
        verse: current.verse,
        timestamp: now,
        readDuration: activeMs,
      }

      readVersesRef.current.set(key, event)
      versesToSyncRef.current.push(event)
      onVerseRead?.(event)
    },
    [isTabVisible, minReadDuration, onVerseRead],
  )

  const setCurrentVerse = useCallback(
    (bookId: string, chapter: number, verse: number) => {
      markCurrentVerseAsRead('switch')

      currentVerseRef.current = { bookId, chapter, verse }
      currentVerseActiveMsRef.current = 0
      lastTickAtRef.current = Date.now()
      engagedUntilRef.current = 0
      hadEngagementSinceVerseStartRef.current = false
      lastActivityAtRef.current = Date.now()
      setIsIdle(false)
    },
    [markCurrentVerseAsRead],
  )

  const syncProgress = useCallback(async () => {
    if (versesToSyncRef.current.length === 0) return

    const batch = versesToSyncRef.current.slice()
    versesToSyncRef.current = []

    try {
      await onSyncProgress?.(batch)
    } catch (error) {
      versesToSyncRef.current.unshift(...batch)
      throw error
    }
  }, [onSyncProgress])

  useEffect(() => {
    const onVisibility = () => {
      const visible = document.visibilityState === 'visible'
      setIsTabVisible(visible)

      if (!visible) {
        markCurrentVerseAsRead('hidden')
      } else {
        lastActivityAtRef.current = Date.now()
        setIsIdle(false)
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [markCurrentVerseAsRead])

  useEffect(() => {
    const handleActivity = () => {
      const now = Date.now()
      lastActivityAtRef.current = now
      engagedUntilRef.current = now + engagementWindow
      hadEngagementSinceVerseStartRef.current = true
      if (isIdle) setIsIdle(false)
    }

    window.addEventListener('scroll', handleActivity, { passive: true })
    window.addEventListener('wheel', handleActivity, { passive: true })
    window.addEventListener('touchstart', handleActivity, { passive: true })
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('click', handleActivity)

    return () => {
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('wheel', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
    }
  }, [engagementWindow, isIdle])

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!isTabVisible) return
      if (isIdle) return
      if (!currentVerseRef.current) return

      const now = Date.now()
      const lastTickAt = lastTickAtRef.current
      lastTickAtRef.current = now

      // Only count time if still within the engagement window.
      if (now > engagedUntilRef.current) return

      const delta = Math.max(0, now - lastTickAt)
      currentVerseActiveMsRef.current += delta
    }, tickInterval)

    return () => window.clearInterval(id)
  }, [isTabVisible, isIdle, tickInterval])

  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now()
      const idleFor = now - lastActivityAtRef.current
      if (idleFor >= idleTimeout && !isIdle) setIsIdle(true)
    }, 1000)

    return () => window.clearInterval(id)
  }, [idleTimeout, isIdle])

  useEffect(() => {
    const id = window.setInterval(() => {
      void syncProgress().catch(() => {})
    }, syncInterval)

    return () => window.clearInterval(id)
  }, [syncInterval, syncProgress])

  useEffect(() => {
    return () => {
      markCurrentVerseAsRead('unmount')
      void syncProgress().catch(() => {})
    }
  }, [markCurrentVerseAsRead, syncProgress])

  return {
    setCurrentVerse,
    isVerseRead,
    getVersesReadCount,
    getReadVerses,
    syncProgress,
    isTabVisible,
    isIdle,
    _readVersesRef: readVersesRef,
    _versesToSyncRef: versesToSyncRef,
  }
}

