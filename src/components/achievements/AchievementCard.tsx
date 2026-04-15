'use client'

import { CheckCircle2 } from 'lucide-react'
import type { AchievementResult } from '@/lib/achievements'
import CircularProgress from '@/components/achievements/CircularProgress'

interface AchievementCardProps {
    achievement: AchievementResult
    highlight?: boolean
    highlightedAchievementId?: string | null
}

const TIER_RING: Record<string, string> = {
    bronze: '#d97706',
    silver: '#64748b',
    gold: '#eab308',
    platinum: '#a855f7',
}

const TIER_GLOW: Record<string, string> = {
    bronze: 'shadow-amber-200 dark:shadow-amber-900/40',
    silver: 'shadow-slate-200 dark:shadow-slate-700/40',
    gold: 'shadow-yellow-200 dark:shadow-yellow-900/40',
    platinum: 'shadow-purple-200 dark:shadow-purple-900/50',
}

const TIER_BG: Record<string, string> = {
    bronze: 'from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30',
    silver: 'from-slate-50 to-gray-50 dark:from-slate-900/40 dark:to-neutral-900/30',
    gold: 'from-yellow-50 to-amber-50 dark:from-yellow-950/40 dark:to-amber-950/30',
    platinum: 'from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/30',
}

const TIER_BORDER: Record<string, string> = {
    bronze: 'border-amber-300 dark:border-amber-700',
    silver: 'border-slate-300 dark:border-slate-600',
    gold: 'border-yellow-400 dark:border-yellow-600',
    platinum: 'border-purple-400 dark:border-purple-600',
}

const TIER_BADGE: Record<string, string> = {
    bronze: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
    silver: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    gold: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300',
    platinum: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300',
}

const TIER_LABEL: Record<string, string> = {
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
}

export default function AchievementCard({ achievement, highlight = false }: AchievementCardProps) {
    const pct = Math.round((achievement.progressValue / achievement.target) * 100)
    const ringColor = TIER_RING[achievement.tier]
    const nearComplete = !achievement.unlocked && pct >= 60
    const isEmailHighlight = highlight && !achievement.unlocked

    return (
        <div
            className={`group relative flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300 ${achievement.unlocked
                ? `bg-gradient-to-br ${TIER_BG[achievement.tier]} ${TIER_BORDER[achievement.tier]} shadow-md ${TIER_GLOW[achievement.tier]}`
                : nearComplete || isEmailHighlight
                    ? `bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-neutral-700`
                    : 'bg-gray-50 dark:bg-neutral-900/50 border-gray-200 dark:border-neutral-800 opacity-80 hover:opacity-100'
                } ${highlight ? 'ring-2 ring-offset-1 ring-[#4C0E0F]/30 dark:ring-red-400/30 animate-pulse' : ''}`}
        >
            {achievement.unlocked ? (
                <div className="relative shrink-0">
                    <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl ${TIER_BORDER[achievement.tier]} bg-white dark:bg-neutral-900`}
                    >
                        {achievement.emoji}
                    </div>
                    <CheckCircle2
                        size={18}
                        className="absolute -bottom-1 -right-1 rounded-full bg-white dark:bg-neutral-900 text-green-500"
                        fill="currentColor"
                    />
                </div>
            ) : (
                <div className="shrink-0">
                    <CircularProgress
                        pct={pct}
                        size={56}
                        strokeWidth={4}
                        color={nearComplete ? ringColor : '#d1d5db'}
                    >
                        <span className={`text-xl ${pct === 0 ? 'grayscale opacity-40' : nearComplete ? '' : 'opacity-50'}`}>
                            {achievement.emoji}
                        </span>
                    </CircularProgress>
                </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <span
                        className={`text-sm font-bold leading-tight ${achievement.unlocked
                            ? 'text-gray-900 dark:text-white'
                            : nearComplete
                                ? 'text-gray-800 dark:text-gray-200'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                    >
                        {achievement.title}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${achievement.unlocked ? TIER_BADGE[achievement.tier] : 'bg-gray-100 text-gray-400 dark:bg-neutral-800 dark:text-gray-500'
                        }`}>
                        {TIER_LABEL[achievement.tier]}
                    </span>
                </div>

                <p className={`text-xs leading-snug ${achievement.unlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                    {achievement.description}
                </p>

                {!achievement.unlocked && (
                    <div className="mt-1 flex flex-col gap-1">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${Math.min(pct, 100)}%`,
                                    background: nearComplete
                                        ? `linear-gradient(90deg, ${ringColor}99, ${ringColor})`
                                        : '#d1d5db',
                                }}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">
                                {pct === 0 ? 'Not started' : `${pct}% there`}
                            </span>
                            <span className="text-[10px] text-gray-400">
                                {achievement.progressValue.toLocaleString()} / {achievement.target.toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}

                {achievement.unlocked && (
                    <span className="mt-0.5 w-fit rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                        ✓ Unlocked
                    </span>
                )}
            </div>

            {nearComplete && !achievement.unlocked && (
                <div className="absolute top-2 right-2 animate-pulse rounded-full bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-orange-600 dark:bg-orange-900/40 dark:text-orange-400">
                    SO CLOSE!
                </div>
            )}
        </div>
    )
}
