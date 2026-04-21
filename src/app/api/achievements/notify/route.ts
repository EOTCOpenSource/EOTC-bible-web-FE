import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'
import { computeAchievements } from '@/lib/achievements'
import type { Progress } from '@/stores/types'

const getAuthToken = async () => {
    const cookieStore = await cookies()
    return cookieStore.get(ENV.jwtCookieName)?.value
}

//  Server-side validation for achievement notifications.
//  This prevents clients from sending fake achievement IDs.
//  Only achievements that are actually earned based on user progress will trigger notifications.

async function validateAchievements(token: string, requestedAchievementIds: string[]): Promise<string[]> {
    try {
        const [progressRes, plansRes] = await Promise.all([
            serverAxiosInstance.get('/progress', {
                headers: { Authorization: `Bearer ${token}` },
                validateStatus: () => true,
            }),
            serverAxiosInstance.get('/reading-plans', {
                headers: { Authorization: `Bearer ${token}` },
                validateStatus: () => true,
            }),
        ])

        if (progressRes.status < 200 || progressRes.status >= 300) {
            return []
        }

        const progressData = progressRes.data?.data?.progress || progressRes.data?.progress || {}
        const streakData = progressRes.data?.data?.streak || progressRes.data?.streak || {}
        const plansData =
            plansRes.data?.data?.data ??
            plansRes.data?.data?.items ??
            plansRes.data?.data ??
            plansRes.data?.items ??
            plansRes.data
        const plans = Array.isArray(plansData) ? plansData : []
        const completedPlans = plans.filter((plan: any) => {
            if (plan?.status === 'completed') return true
            if (!Array.isArray(plan?.dailyReadings) || plan.dailyReadings.length === 0) return false
            return plan.dailyReadings.every((day: any) => !!day?.isCompleted)
        }).length

        const chaptersRead: Record<string, number[]> = {}
        if (progressData.chaptersRead && typeof progressData.chaptersRead === 'object') {
            Object.entries(progressData.chaptersRead).forEach(([key]) => {
                const [bookId, chapterStr] = key.split(':')
                if (bookId && chapterStr) {
                    if (!chaptersRead[bookId]) chaptersRead[bookId] = []
                    const chapter = parseInt(chapterStr, 10)
                    if (!isNaN(chapter)) chaptersRead[bookId].push(chapter)
                }
            })
        }

        const progress: Progress = {
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

        // Compute actual achievements based on real progress
        const computedAchievements = computeAchievements(progress)
        const earnedAchievementIds = new Set(
            computedAchievements.filter((a) => a.unlocked).map((a) => a.id)
        )

        // Only return achievement IDs that were actually earned
        return requestedAchievementIds.filter((id) => earnedAchievementIds.has(id))
    } catch (error) {
        console.error('Achievement validation error:', error)
        // On error, don't allow any notifications (fail secure)
        return []
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = await getAuthToken()
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized. Please login first.' }, { status: 401 })
        }

        const body = await req.json()
        const { achievementIds } = body

        if (!achievementIds || !Array.isArray(achievementIds) || achievementIds.length === 0) {
            return NextResponse.json({ error: 'achievementIds array is required' }, { status: 400 })
        }

        // SECURITY: Validate that the achievements were actually earned
        const validatedAchievementIds = await validateAchievements(token, achievementIds)

        if (validatedAchievementIds.length === 0) {
            // No valid achievements - either already notified or trying to fake
            return NextResponse.json({
                message: 'No new achievements to notify',
                validatedCount: 0
            })
        }

        const res = await serverAxiosInstance.post(
            '/achievements/notify',
            { achievementIds: validatedAchievementIds },
            {
                headers: { Authorization: `Bearer ${token}` },
                validateStatus: () => true,
            }
        )

        if (res.status < 200 || res.status >= 300) {
            return NextResponse.json(
                { error: res.data?.message || 'Failed to send achievement notification' },
                { status: res.status }
            )
        }

        return NextResponse.json({
            ...res.data,
            validatedCount: validatedAchievementIds.length,
        })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.response?.data?.error || error.message || 'Failed to notify achievement' },
            { status: error.response?.status || 500 }
        )
    }
}
