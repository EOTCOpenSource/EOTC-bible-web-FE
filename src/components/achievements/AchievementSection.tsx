'use client'

import { useEffect } from 'react'
import { Trophy, ChevronRight, Flame, BookOpen, Zap } from 'lucide-react'
import Link from 'next/link'
import { useAchievementsStore } from '@/stores/achievementStore'
import { useProgressStore } from '@/stores/progressStore'
import CircularProgress from '@/components/achievements/CircularProgress'

const TIER_RING: Record<string, string> = {
    bronze: '#d97706',
    silver: '#64748b',
    gold: '#eab308',
    platinum: '#a855f7',
}

export default function AchievementsSection() {
    const { achievements, isLoading, loadAchievements } = useAchievementsStore()
    const { progress, loadProgress } = useProgressStore()

    useEffect(() => {
        loadAchievements().catch(() => { })
        loadProgress().catch(() => { })
    }, [loadAchievements, loadProgress])

    const unlocked = achievements.filter((a) => a.unlocked)
    const totalPct = achievements.length > 0 ? Math.round((unlocked.length / achievements.length) * 100) : 0
    const totalChaptersRead = Object.values(progress.chaptersRead || {}).reduce((s, c) => s + c.length, 0)
    const currentStreak = progress.streak?.current ?? 0

    const nextUp = achievements
        .filter((a) => !a.unlocked && a.progressValue > 0)
        .sort((a, b) => b.progressValue / b.target - a.progressValue / a.target)
        .slice(0, 2)

    const recentUnlocked = unlocked.slice(-2).reverse()

    return (
        <div className="rounded-2xl border border-gray-300 dark:border-neutral-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#4C0E0F] to-[#7a1a1c] px-4 py-3">
                <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-white/80" />
                    <span className="text-sm font-bold text-white">Achievements</span>
                    {achievements.length > 0 && (
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
                            {unlocked.length}/{achievements.length}
                        </span>
                    )}
                </div>
                <Link
                    href="/dashboard/achievements"
                    className="flex items-center gap-0.5 text-xs text-white/70 hover:text-white transition-colors"
                >
                    View all <ChevronRight size={12} />
                </Link>
            </div>

            <div className="p-4 flex flex-col gap-4">
                {isLoading ? (
                    <div className="flex flex-col gap-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-neutral-800" />
                        ))}
                    </div>
                ) : achievements.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                        <Trophy size={28} className="text-gray-300 dark:text-neutral-600" />
                        <p className="text-xs text-gray-400 dark:text-gray-500">Start reading to earn achievements!</p>
                        <Link
                            href="/read-online"
                            className="mt-1 rounded-full bg-[#4C0E0F] px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-800"
                        >
                            Start Reading
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Overall Progress Ring */}
                        <div className="flex items-center gap-4 rounded-xl bg-gray-50 dark:bg-neutral-800/50 p-3">
                            <CircularProgress pct={totalPct} size={52} strokeWidth={4} color="#4C0E0F">
                                <span className="text-xs font-black text-[#4C0E0F] dark:text-red-400">{totalPct}%</span>
                            </CircularProgress>
                            <div className="flex flex-1 flex-col gap-0.5">
                                <p className="text-xs font-bold text-black dark:text-white">{totalPct}% complete</p>
                                <p className="text-[10px] text-gray-400">{unlocked.length} of {achievements.length} achievements</p>
                                <div className="mt-1 flex gap-3 text-[10px] text-gray-500">
                                    <span className="flex items-center gap-0.5"><BookOpen size={10} />{totalChaptersRead} chapters</span>
                                    <span className="flex items-center gap-0.5"><Flame size={10} className="text-orange-500" />{currentStreak} day streak</span>
                                </div>
                            </div>
                        </div>

                        {/* Next Up */}
                        {nextUp.length > 0 && (
                            <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Zap size={12} className="text-orange-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Next Up</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {nextUp.map((a, i) => {
                                        const pct = Math.round((a.progressValue / a.target) * 100)
                                        const ringColor = TIER_RING[a.tier]
                                        const isClosest = i === 0
                                        return (
                                            <div
                                                key={a.id}
                                                className={`flex items-center gap-3 rounded-xl border p-2.5 ${isClosest
                                                    ? 'border-orange-200 dark:border-orange-800/40 bg-orange-50 dark:bg-orange-950/20'
                                                    : 'border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50'
                                                    }`}
                                            >
                                                <CircularProgress pct={pct} size={40} strokeWidth={3.5} color={ringColor}>
                                                    <span className="text-sm">{a.emoji}</span>
                                                </CircularProgress>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-xs font-bold text-black dark:text-white truncate">{a.title}</p>
                                                        {isClosest && <span className="shrink-0 rounded-full bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-white">Closest</span>}
                                                    </div>
                                                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">
                                                        <div
                                                            className="h-full rounded-full"
                                                            style={{ width: `${pct}%`, background: ringColor }}
                                                        />
                                                    </div>
                                                    <p className="mt-0.5 text-[10px] text-gray-400">{pct}% · {(a.target - a.progressValue).toLocaleString()} to go</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Recently unlocked */}
                        {recentUnlocked.length > 0 && (
                            <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                    <span className="text-[10px]">🏆</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Recently Unlocked</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {recentUnlocked.map((a) => (
                                        <div key={a.id} className="flex items-center gap-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-2.5">
                                            <span className="text-xl">{a.emoji}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-black dark:text-white truncate">{a.title}</p>
                                                <p className="text-[10px] text-gray-400">{a.description}</p>
                                            </div>
                                            <span className="shrink-0 rounded-full bg-green-100 px-1.5 py-0.5 text-[9px] font-bold text-green-700 dark:bg-green-900/40 dark:text-green-400">✓</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Link
                            href="/dashboard/achievements"
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#4C0E0F]/20 dark:border-red-400/20 bg-[#4C0E0F]/5 dark:bg-red-950/20 py-2 text-xs font-semibold text-[#4C0E0F] dark:text-red-400 hover:bg-[#4C0E0F]/10 transition-colors"
                        >
                            <Trophy size={12} />
                            See all {achievements.length} achievements
                            <ChevronRight size={12} />
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}
