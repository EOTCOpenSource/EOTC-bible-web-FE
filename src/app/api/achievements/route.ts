import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'
import { computeAchievements } from '@/lib/achievements'
import type { Progress } from '@/stores/types'

const getAuthToken = async () => {
    const cookieStore = await cookies()
    return cookieStore.get(ENV.jwtCookieName)?.value
}

const transformBackendProgress = (backendData: any): Progress => {
    const progressData = backendData?.data?.progress || backendData?.progress || {}
    const streakData = backendData?.data?.streak || backendData?.streak || {}

    const chaptersRead: Record<string, number[]> = {}
    if (progressData.chaptersRead && typeof progressData.chaptersRead === 'object' && !Array.isArray(progressData.chaptersRead)) {
        Object.entries(progressData.chaptersRead).forEach(([key]) => {
            const [bookId, chapterStr] = key.split(':')
            if (bookId && chapterStr) {
                if (!chaptersRead[bookId]) chaptersRead[bookId] = []
                const chapter = parseInt(chapterStr, 10)
                if (!isNaN(chapter) && !chaptersRead[bookId].includes(chapter)) {
                    chaptersRead[bookId].push(chapter)
                }
            }
        })
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

export async function GET() {
    try {
        const token = await getAuthToken()
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized. Please login first.' }, { status: 401 })
        }

        const [progressRes, achievementsRes] = await Promise.all([
            serverAxiosInstance.get('/progress', {
                headers: { Authorization: `Bearer ${token}` },
                validateStatus: () => true,
            }),
            serverAxiosInstance.get('/achievements', {
                headers: { Authorization: `Bearer ${token}` },
                validateStatus: () => true,
            })
        ])

        if (progressRes.status < 200 || progressRes.status >= 300) {
            return NextResponse.json(
                { error: progressRes.data?.message || 'Failed to fetch progress' },
                { status: progressRes.status }
            )
        }

        const progress = transformBackendProgress(progressRes.data)
        const computedAchievements = computeAchievements(progress)

        // Merge persisted achievements
        const unlockedIds = new Set<string>(achievementsRes.data?.unlockedIds || [])
        const achievements = computedAchievements.map((ach) => ({
            ...ach,
            unlocked: ach.unlocked || unlockedIds.has(ach.id),
        }))

        return NextResponse.json({ achievements, progress })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.error || error.message || 'Failed to compute achievements' },
            { status: error.response?.status || 500 }
        )
    }
}
