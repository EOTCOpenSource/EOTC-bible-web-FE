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

const extractPlans = (backendData: any): any[] => {
    const plans =
        backendData?.data?.data ??
        backendData?.data?.items ??
        backendData?.data ??
        backendData?.items ??
        backendData

    return Array.isArray(plans) ? plans : []
}

const isPlanCompleted = (plan: any): boolean => {
    if (plan?.status === 'completed') return true
    if (!Array.isArray(plan?.dailyReadings) || plan.dailyReadings.length === 0) return false
    return plan.dailyReadings.every((day: any) => !!day?.isCompleted)
}

const transformBackendProgress = (backendData: any, readingPlansData?: any): Progress => {
    const progressData = backendData?.data?.progress || backendData?.progress || {}
    const streakData = backendData?.data?.streak || backendData?.streak || {}
    const plans = extractPlans(readingPlansData)
    const completedPlans = plans.filter(isPlanCompleted).length

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
        readingPlansCompleted: completedPlans,
        readingPlansTotal: plans.length,
    }
}

// SECURITY: Server-side achievement validation.

async function getServerValidatedAchievements(token: string) {
    // Promise.all to fetch progress and plans concurrently for performance.
    const [progressRes, plansRes] = await Promise.all([
        serverAxiosInstance.get('/progress', {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: () => true,
        }),
        serverAxiosInstance.get('/reading-plans', {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: () => true,
        }).catch(err => {
            console.error('Achievements API: Failed to fetch reading plans:', err.message)
            return { status: 500, data: null }
        }),
    ])

    if (progressRes.status < 200 || progressRes.status >= 300) {
        throw new Error('Failed to fetch progress')
    }

    const progress = transformBackendProgress(
        progressRes.data,
        plansRes && plansRes.status >= 200 && plansRes.status < 300 ? plansRes.data : undefined,
    )
    const computedAchievements = computeAchievements(progress)


    // Also fetch persisted achievements from backend for cross-device sync
    const achievementsRes = await serverAxiosInstance.get('/achievements', {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
    })

    const unlockedIds = new Set<string>(achievementsRes.data?.unlockedIds || [])

    // SECURITY: Only unlock if BOTH conditions are true:

    const achievements = computedAchievements.map((ach) => ({
        ...ach,
        unlocked: ach.unlocked || unlockedIds.has(ach.id),
    }))

    return { achievements, progress }
}

export async function GET() {
    try {
        const token = await getAuthToken()
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized. Please login first.' }, { status: 401 })
        }

        const { achievements, progress } = await getServerValidatedAchievements(token)

        return NextResponse.json({ achievements, progress })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.error || error.message || 'Failed to compute achievements' },
            { status: error.response?.status || 500 }
        )
    }
}
