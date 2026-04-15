'use client'

import { useEffect, useState } from 'react'
import { Trophy, Flame, BookOpen, Star, Zap, Crown, Filter, ChevronRight, TrendingUp, Award } from 'lucide-react'
import Link from 'next/link'
import { useAchievementsStore } from '@/stores/achievementStore'
import { useProgressStore } from '@/stores/progressStore'
import AchievementCard from '@/components/achievements/AchievementCard'
import CircularProgress from '@/components/achievements/CircularProgress'
import type { AchievementCategory } from '@/lib/achievements'
import { useSearchParams } from 'next/navigation'

const CATEGORIES: { value: AchievementCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All', icon: <Star size={13} /> },
    { value: 'special', label: 'Special', icon: <Zap size={13} /> },
    { value: 'streak', label: 'Streaks', icon: <Flame size={13} /> },
    { value: 'chapters', label: 'Chapters', icon: <BookOpen size={13} /> },
    { value: 'books', label: 'Books', icon: <Trophy size={13} /> },
]

const TIER_RING: Record<string, string> = {
    bronze: '#d97706',
    silver: '#64748b',
    gold: '#eab308',
    platinum: '#a855f7',
}

export default function AchievementsPage() {
    const { achievements, isLoading, loadAchievements } = useAchievementsStore()
    const { progress, loadProgress } = useProgressStore()
    const [filter, setFilter] = useState<AchievementCategory | 'all'>('all')
    const [showUnlockedOnly, setShowUnlockedOnly] = useState(false)
    const searchParams = useSearchParams()
    const highlightedAchievementId = searchParams.get('highlight')

    useEffect(() => {
        loadAchievements().catch(() => { })
        loadProgress().catch(() => { })
    }, [loadAchievements, loadProgress])

    const unlocked = achievements.filter((a) => a.unlocked)
    const totalPct = achievements.length > 0 ? Math.round((unlocked.length / achievements.length) * 100) : 0

    const totalChaptersRead = Object.values(progress.chaptersRead || {}).reduce(
        (sum, chs) => sum + chs.length, 0
    )
    const booksCompleted = Object.keys(progress.chaptersRead || {}).length
    const currentStreak = progress.streak?.current ?? 0
    const longestStreak = progress.streak?.longest ?? 0

    const nextUp = achievements
        .filter((a) => !a.unlocked && a.progressValue > 0)
        .sort((a, b) => b.progressValue / b.target - a.progressValue / a.target)
        .slice(0, 3)

    const nearlyThere = achievements.filter(
        (a) => !a.unlocked && a.progressValue / a.target >= 0.6
    )

    const tierOrder = { platinum: 0, gold: 1, silver: 2, bronze: 3 }

    const filtered = achievements
        .filter((a) => {
            if (filter !== 'all' && a.category !== filter) return false
            if (showUnlockedOnly && !a.unlocked) return false
            return true
        })
        .sort((a, b) => {
            if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1
            const pctA = a.progressValue / a.target
            const pctB = b.progressValue / b.target
            if (!a.unlocked && !b.unlocked) return pctB - pctA
            return tierOrder[a.tier] - tierOrder[b.tier]
        })

    const tierStats = (['platinum', 'gold', 'silver', 'bronze'] as const).map((tier) => ({
        tier,
        emoji: tier === 'platinum' ? '👑' : tier === 'gold' ? '🏅' : tier === 'silver' ? '✨' : '🎖️',
        count: achievements.filter((a) => a.tier === tier && a.unlocked).length,
        total: achievements.filter((a) => a.tier === tier).length,
        color: TIER_RING[tier],
    }))

    return (
        <div className="flex w-full flex-col gap-6 py-4 md:py-8">

            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4C0E0F] text-white">
                    <Award size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-black dark:text-white">Achievements</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Track your spiritual reading journey</p>
                </div>
            </div>

            {/* ── Overview Hero ──────────────────────────────────────── */}
            <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-gradient-to-br from-[#4C0E0F] to-[#7a1a1c] p-5 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">

                    <div className="flex items-center gap-5">
                        <CircularProgress pct={totalPct} size={88} strokeWidth={7} color="white" trackColor="rgba(255,255,255,0.2)">
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-black leading-none">{totalPct}%</span>
                                <span className="text-[9px] opacity-70 uppercase tracking-wide">done</span>
                            </div>
                        </CircularProgress>
                        <div className="flex flex-col gap-1">
                            <p className="text-lg font-bold">{unlocked.length} Unlocked</p>
                            <p className="text-sm opacity-70">{achievements.length - unlocked.length} remaining</p>
                            <div className="flex gap-3 mt-1">
                                {tierStats.map(({ tier, emoji, count, total }) => (
                                    <div key={tier} className="flex flex-col items-center">
                                        <span className="text-base">{emoji}</span>
                                        <span className="text-xs font-bold">{count}</span>
                                        <span className="text-[9px] opacity-60">/{total}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                            <div className="flex items-center gap-1.5 mb-1">
                                <BookOpen size={14} className="opacity-80" />
                                <span className="text-[11px] uppercase tracking-wide opacity-70">Chapters</span>
                            </div>
                            <p className="text-2xl font-black">{totalChaptersRead.toLocaleString()}</p>
                            <p className="text-[10px] opacity-60">total read</p>
                        </div>
                        <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Flame size={14} className="opacity-80" />
                                <span className="text-[11px] uppercase tracking-wide opacity-70">Streak</span>
                            </div>
                            <p className="text-2xl font-black">{currentStreak}</p>
                            <p className="text-[10px] opacity-60">days in a row</p>
                        </div>
                        <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                            <div className="flex items-center gap-1.5 mb-1">
                                <TrendingUp size={14} className="opacity-80" />
                                <span className="text-[11px] uppercase tracking-wide opacity-70">Best</span>
                            </div>
                            <p className="text-2xl font-black">{longestStreak}</p>
                            <p className="text-[10px] opacity-60">longest streak</p>
                        </div>
                        <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Crown size={14} className="opacity-80" />
                                <span className="text-[11px] uppercase tracking-wide opacity-70">Platinum</span>
                            </div>
                            <p className="text-2xl font-black">{tierStats[0].count}</p>
                            <p className="text-[10px] opacity-60">of {tierStats[0].total} unlocked</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Next Up / Nearly There ─────────────────────────────── */}
            {!isLoading && nextUp.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Zap size={16} className="text-orange-500" />
                        <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wide">
                            {nearlyThere.length > 0 ? '🔥 Almost There' : '⚡ Next Up'}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {nextUp.map((a, i) => {
                            const pct = Math.round((a.progressValue / a.target) * 100)
                            const ringColor = TIER_RING[a.tier]
                            return (
                                <div
                                    key={a.id}
                                    className={`relative flex flex-col items-center gap-3 rounded-2xl border p-4 text-center transition-all hover:shadow-md ${i === 0
                                        ? 'border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-950/20'
                                        : 'border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50'
                                        }`}
                                >
                                    {i === 0 && (
                                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                                            Closest
                                        </span>
                                    )}
                                    <CircularProgress pct={pct} size={64} strokeWidth={5} color={ringColor}>
                                        <span className="text-xl">{a.emoji}</span>
                                    </CircularProgress>
                                    <div>
                                        <p className="text-sm font-bold text-black dark:text-white">{a.title}</p>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{pct}% complete</p>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                            {(a.target - a.progressValue).toLocaleString()} more to go
                                        </p>
                                    </div>
                                    <div className="w-full">
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{ width: `${pct}%`, background: ringColor }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── Filters ────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-gray-400">
                    <Filter size={13} />
                    <span className="text-xs">Filter</span>
                </div>
                {CATEGORIES.map(({ value, label, icon }) => {
                    const catCount = achievements.filter(
                        (a) => value === 'all' || a.category === value
                    ).length
                    const catUnlocked = achievements.filter(
                        (a) => (value === 'all' || a.category === value) && a.unlocked
                    ).length
                    return (
                        <button
                            key={value}
                            onClick={() => setFilter(value)}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${filter === value
                                ? 'bg-[#4C0E0F] text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700'
                                }`}
                        >
                            {icon}
                            {label}
                            <span className={`rounded-full px-1.5 text-[10px] font-bold ${filter === value
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-200 text-gray-500 dark:bg-neutral-700 dark:text-gray-400'
                                }`}>
                                {catUnlocked}/{catCount}
                            </span>
                        </button>
                    )
                })}
                <button
                    onClick={() => setShowUnlockedOnly((v) => !v)}
                    className={`ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${showUnlockedOnly
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                        }`}
                >
                    ✓ Unlocked only
                </button>
            </div>

            {/* ── Achievement Grid ───────────────────────────────────── */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-neutral-800" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-14 text-center">
                    <Trophy size={40} className="text-gray-200 dark:text-neutral-700" />
                    <p className="text-sm font-medium text-gray-400">No achievements match this filter</p>
                    <button
                        onClick={() => { setFilter('all'); setShowUnlockedOnly(false) }}
                        className="rounded-full bg-gray-100 dark:bg-neutral-800 px-4 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {filtered.map((a) => (
                        <AchievementCard
                            key={a.id}
                            achievement={a}
                            highlight={nextUp[0]?.id === a.id || a.id === highlightedAchievementId}
                        />
                    ))}
                </div>
            )}

            {/* ── Reading Progress Section ───────────────────────────── */}
            {!isLoading && (
                <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen size={16} className="text-[#4C0E0F] dark:text-red-400" />
                        <h2 className="text-sm font-bold text-black dark:text-white">Reading Progress Overview</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            { label: 'Total Chapters', value: totalChaptersRead.toLocaleString(), sub: 'chapters read', icon: '📖' },
                            { label: 'Books Started', value: booksCompleted.toString(), sub: 'of 81 books', icon: '📚' },
                            { label: 'Current Streak', value: `${currentStreak}d`, sub: 'days in a row', icon: '🔥' },
                            { label: 'Best Streak', value: `${longestStreak}d`, sub: 'personal record', icon: '⭐' },
                        ].map(({ label, value, sub, icon }) => (
                            <div
                                key={label}
                                className="flex flex-col items-center gap-1 rounded-xl bg-gray-50 dark:bg-neutral-800/50 p-3 text-center"
                            >
                                <span className="text-2xl">{icon}</span>
                                <p className="text-xl font-black text-black dark:text-white">{value}</p>
                                <p className="text-[10px] text-gray-400 leading-tight">{sub}</p>
                            </div>
                        ))}
                    </div>

                    {totalChaptersRead > 0 && (
                        <div className="mt-4 flex flex-col gap-2">
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Progress toward 1,000 chapters</span>
                                <span>{Math.min(totalChaptersRead, 1000)} / 1,000</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#4C0E0F] to-red-500 transition-all duration-700"
                                    style={{ width: `${Math.min((totalChaptersRead / 1000) * 100, 100)}%` }}
                                />
                            </div>
                            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                                {totalChaptersRead >= 1000
                                    ? '🎉 Milestone reached!'
                                    : `${(1000 - totalChaptersRead).toLocaleString()} chapters to unlock Living Word`}
                            </p>
                        </div>
                    )}

                    <div className="mt-4 border-t border-gray-100 dark:border-neutral-800 pt-4">
                        <Link
                            href="/read-online"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4C0E0F] py-2.5 text-sm font-semibold text-white hover:bg-red-800 transition-colors"
                        >
                            Continue Reading
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
