import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'
import { computeAchievements } from '@/lib/achievements'

const getAuthToken = async () => {
    const cookieStore = await cookies()
    return cookieStore.get(ENV.jwtCookieName)?.value
}

//  Server-side validation for achievement notifications.
//  This prevents clients from sending fake achievement IDs.
//  Only achievements that are actually earned based on user progress will trigger notifications.

async function validateAchievements(token: string, requestedAchievementIds: string[]): Promise<string[]> {
    try {
        // Fetch user's actual progress from backend
        const progressRes = await serverAxiosInstance.get('/progress', {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: () => true,
        })

        if (progressRes.status < 200 || progressRes.status >= 300) {
            // If we can't fetch progress, don't allow any notifications
            return []
        }

        // Transform backend progress format
        const progressData = progressRes.data?.data?.progress || progressRes.data?.progress || {}
        const streakData = progressRes.data?.data?.streak || progressRes.data?.streak || {}

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

        const progress = {
            chaptersRead,
            streak: {
                current: streakData.current || 0,
                longest: streakData.longest || 0,
                lastDate: streakData.lastDate || undefined,
            },
            lastRead: progressData.lastRead || undefined,
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
