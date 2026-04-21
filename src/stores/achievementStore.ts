import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import axiosInstance from '@/lib/axios'
import type { AchievementResult } from '@/lib/achievements'

const NOTIFIED_KEY = 'eotc-notified-achievements-v1'
const LAST_NOTIFY_KEY = 'eotc-last-notify-time-v1'
const NOTIFY_COOLDOWN_MS = 60_000 // 1 minute cooldown between notification batches

const readNotified = (): Set<string> => {
    if (typeof window === 'undefined') return new Set()
    try {
        const raw = window.localStorage.getItem(NOTIFIED_KEY)
        return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
    } catch {
        return new Set()
    }
}

const writeNotified = (ids: Set<string>) => {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(NOTIFIED_KEY, JSON.stringify(Array.from(ids)))
    } catch { }
}

const readLastNotifyTime = (): number => {
    if (typeof window === 'undefined') return 0
    try {
        const raw = window.localStorage.getItem(LAST_NOTIFY_KEY)
        return raw ? parseInt(raw, 10) : 0
    } catch {
        return 0
    }
}

const writeLastNotifyTime = (time: number) => {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(LAST_NOTIFY_KEY, time.toString())
    } catch { }
}

interface AchievementsState {
    achievements: AchievementResult[]
    isLoading: boolean
    error: string | null
    lastFetched: number | null
    loadAchievements: (force?: boolean) => Promise<void>
    notifyNewAchievements: (achievements: AchievementResult[]) => Promise<void>
}

export const useAchievementsStore = create<AchievementsState>()(
    devtools(
        persist(
            (set, get) => ({
                achievements: [],
                isLoading: false,
                error: null,
                lastFetched: null,

                loadAchievements: async (force = false) => {
                    const { isLoading, lastFetched } = get()
                    if (isLoading) return
                    const now = Date.now()
                    if (!force && lastFetched && now - lastFetched < 30_000) return

                    set({ isLoading: true, error: null })
                    try {
                        const res = await axiosInstance.get('/api/achievements')
                        const achievements: AchievementResult[] = res.data.achievements ?? []
                        set({ achievements, isLoading: false, lastFetched: Date.now() })
                        await get().notifyNewAchievements(achievements)
                    } catch (err: any) {
                        if (err?.response?.status === 401) {
                            set({ isLoading: false, achievements: [], error: null })
                            return
                        }
                        set({
                            isLoading: false,
                            error: err?.response?.data?.error ?? err?.message ?? 'Failed to load achievements',
                        })
                    }
                },

                notifyNewAchievements: async (achievements: AchievementResult[]) => {
                    const notified = readNotified()
                    const newlyUnlocked = achievements
                        .filter((a) => a.unlocked && !notified.has(a.id))
                        .map((a) => a.id)

                    if (newlyUnlocked.length === 0) return

                    // RATE LIMITING: Prevent notification spam
                    const lastNotifyTime = readLastNotifyTime()
                    const now = Date.now()
                    if (now - lastNotifyTime < NOTIFY_COOLDOWN_MS) {
                        // Still in cooldown - mark as notified but don't send
                        newlyUnlocked.forEach((id) => notified.add(id))
                        writeNotified(notified)
                        return
                    }

                    newlyUnlocked.forEach((id) => notified.add(id))
                    writeNotified(notified)
                    writeLastNotifyTime(now)

                    try {
                        await axiosInstance.post('/api/achievements/notify', { achievementIds: newlyUnlocked })
                    } catch {
                        // On failure, remove from notified so we can retry later
                        newlyUnlocked.forEach((id) => notified.delete(id))
                        writeNotified(notified)
                    }
                },
            }),
            {
                name: 'eotc-achievements-storage',
            }
        ),
        { name: 'achievements-store' }
    )
)
