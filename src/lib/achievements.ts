import { books } from '@/data/data'
import type { Progress } from '@/stores/types'

export type AchievementCategory = 'streak' | 'chapters' | 'books' | 'special'
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface AchievementResult {
    id: string
    title: string
    description: string
    category: AchievementCategory
    tier: AchievementTier
    emoji: string
    unlocked: boolean
    unlockedAt?: string
    progressValue: number
    target: number
    bookId?: string
}

interface AchievementDefinition {
    id: string
    title: string
    description: string
    category: AchievementCategory
    tier: AchievementTier
    emoji: string
    bookId?: string
    check: (progress: Progress) => { unlocked: boolean; progressValue: number; target: number }
}

const totalChapters = (chaptersRead: Record<string, number[]>): number =>
    Object.values(chaptersRead || {}).reduce((sum, chs) => sum + chs.length, 0)

const toBookSlug = (bookNameEn: string) => bookNameEn.toLowerCase().replace(/\s+/g, '-')

const getChaptersReadForKey = (chaptersRead: Record<string, number[]>, wanted: string) => {
    const keys = Object.keys(chaptersRead || {})
    const found = keys.find((k) => k === wanted || k.toLowerCase() === wanted.toLowerCase())
    return found ? chaptersRead[found] : undefined
}

// Achievements are keyed by `books[].file_name` (e.g. "16-enoch"), but reading/progress tracking often uses
// the route slug based on `book_name_en` (e.g. "enoch"). Support both so achievements reflect real progress.
const bookChaptersRead = (chaptersRead: Record<string, number[]>, fileNamePrefix: string): number => {
    const direct = getChaptersReadForKey(chaptersRead, fileNamePrefix)
    if (direct) return direct.length

    const book = books.find((b) => b.file_name === fileNamePrefix)
    if (!book) return 0

    const slug = toBookSlug(book.book_name_en)
    const bySlug = getChaptersReadForKey(chaptersRead, slug)
    if (bySlug) return bySlug.length

    return 0
}

const isBookComplete = (chaptersRead: Record<string, number[]>, fileNamePrefix: string, totalChapterCount: number): boolean => {
    return bookChaptersRead(chaptersRead, fileNamePrefix) >= totalChapterCount
}

const ntBooks = books.filter((b) => b.testament === 'new')
const otBooks = books.filter((b) => b.testament === 'old')

const ntTotalChapters = ntBooks.reduce((s, b) => s + b.chapters, 0)
const otTotalChapters = otBooks.reduce((s, b) => s + b.chapters, 0)

const countNTChaptersRead = (chaptersRead: Record<string, number[]>): number =>
    ntBooks.reduce((sum, b) => sum + bookChaptersRead(chaptersRead, b.file_name), 0)

const countOTChaptersRead = (chaptersRead: Record<string, number[]>): number =>
    otBooks.reduce((sum, b) => sum + bookChaptersRead(chaptersRead, b.file_name), 0)

const completedReadingPlans = (progress: Progress): number => progress.readingPlansCompleted ?? 0

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
    // ── Special ───────────────────────────────────────────────────────────────
    {
        id: 'first_step',
        title: 'First Step',
        description: 'Read your first chapter',
        category: 'special',
        tier: 'bronze',
        emoji: '📖',
        check: (p) => {
            const v = totalChapters(p.chaptersRead)
            return { unlocked: v >= 1, progressValue: Math.min(v, 1), target: 1 }
        },
    },

    // ── Reading plan achievements ─────────────────────────────────────────────
    {
        id: 'plan_complete_1',
        title: 'Plan Finisher',
        description: 'Complete your first reading plan',
        category: 'special',
        tier: 'bronze',
        emoji: '🗺️',
        check: (p) => {
            const v = completedReadingPlans(p)
            return { unlocked: v >= 1, progressValue: Math.min(v, 1), target: 1 }
        },
    },
    {
        id: 'plan_complete_3',
        title: 'Disciplined Walker',
        description: 'Complete 3 reading plans',
        category: 'special',
        tier: 'silver',
        emoji: '🥾',
        check: (p) => {
            const v = completedReadingPlans(p)
            return { unlocked: v >= 3, progressValue: Math.min(v, 3), target: 3 }
        },
    },
    {
        id: 'plan_complete_10',
        title: 'Master Planner',
        description: 'Complete 10 reading plans',
        category: 'special',
        tier: 'gold',
        emoji: '🏠',
        check: (p) => {
            const v = completedReadingPlans(p)
            return { unlocked: v >= 10, progressValue: Math.min(v, 10), target: 10 }
        },
    },
    // Streak achievements
    {
        id: 'streak_3',
        title: 'First Flame',
        description: 'Read for 3 days in a row',
        category: 'streak',
        tier: 'bronze',
        emoji: '🔥',
        check: (p) => ({
            unlocked: (p.streak?.current ?? 0) >= 3,
            progressValue: Math.min(p.streak?.current ?? 0, 3),
            target: 3,
        }),
    },
    {
        id: 'streak_7',
        title: 'Weekly Warrior',
        description: 'Maintain a 7-day reading streak',
        category: 'streak',
        tier: 'bronze',
        emoji: '⚡',
        check: (p) => ({
            unlocked: (p.streak?.current ?? 0) >= 7,
            progressValue: Math.min(p.streak?.current ?? 0, 7),
            target: 7,
        }),
    },
    {
        id: 'streak_14',
        title: 'Faithful Fortnight',
        description: 'Read for 14 consecutive days',
        category: 'streak',
        tier: 'silver',
        emoji: '✨',
        check: (p) => ({
            unlocked: (p.streak?.current ?? 0) >= 14,
            progressValue: Math.min(p.streak?.current ?? 0, 14),
            target: 14,
        }),
    },
    {
        id: 'streak_30',
        title: 'Monthly Disciple',
        description: 'Maintain a 30-day reading streak',
        category: 'streak',
        tier: 'silver',
        emoji: '🌟',
        check: (p) => ({
            unlocked: (p.streak?.current ?? 0) >= 30,
            progressValue: Math.min(p.streak?.current ?? 0, 30),
            target: 30,
        }),
    },
    {
        id: 'streak_60',
        title: 'Iron Reader',
        description: 'Read every day for 60 days',
        category: 'streak',
        tier: 'gold',
        emoji: '🏆',
        check: (p) => ({
            unlocked: (p.streak?.current ?? 0) >= 60,
            progressValue: Math.min(p.streak?.current ?? 0, 60),
            target: 60,
        }),
    },
    {
        id: 'streak_100',
        title: 'Centurion',
        description: 'Achieve a 100-day reading streak',
        category: 'streak',
        tier: 'gold',
        emoji: '💯',
        check: (p) => ({
            unlocked: (p.streak?.current ?? 0) >= 100,
            progressValue: Math.min(p.streak?.current ?? 0, 100),
            target: 100,
        }),
    },
    {
        id: 'streak_365',
        title: 'Year of the Word',
        description: 'Read every single day for a full year',
        category: 'streak',
        tier: 'platinum',
        emoji: '👑',
        check: (p) => ({
            unlocked: (p.streak?.current ?? 0) >= 365,
            progressValue: Math.min(p.streak?.current ?? 0, 365),
            target: 365,
        }),
    },

    // ── Chapter milestones ────────────────────────────────────────────────────
    {
        id: 'chapters_10',
        title: 'Devoted Reader',
        description: 'Read 10 chapters total',
        category: 'chapters',
        tier: 'bronze',
        emoji: '📚',
        check: (p) => {
            const v = totalChapters(p.chaptersRead)
            return { unlocked: v >= 10, progressValue: Math.min(v, 10), target: 10 }
        },
    },
    {
        id: 'chapters_25',
        title: 'Chapter Champion',
        description: 'Read 25 chapters total',
        category: 'chapters',
        tier: 'bronze',
        emoji: '🎯',
        check: (p) => {
            const v = totalChapters(p.chaptersRead)
            return { unlocked: v >= 25, progressValue: Math.min(v, 25), target: 25 }
        },
    },
    {
        id: 'chapters_50',
        title: 'Halfway Pilgrim',
        description: 'Read 50 chapters total',
        category: 'chapters',
        tier: 'silver',
        emoji: '🏃',
        check: (p) => {
            const v = totalChapters(p.chaptersRead)
            return { unlocked: v >= 50, progressValue: Math.min(v, 50), target: 50 }
        },
    },
    {
        id: 'chapters_100',
        title: 'Century Reader',
        description: 'Read 100 chapters total',
        category: 'chapters',
        tier: 'silver',
        emoji: '💪',
        check: (p) => {
            const v = totalChapters(p.chaptersRead)
            return { unlocked: v >= 100, progressValue: Math.min(v, 100), target: 100 }
        },
    },
    {
        id: 'chapters_250',
        title: 'Bible Scholar',
        description: 'Read 250 chapters total',
        category: 'chapters',
        tier: 'gold',
        emoji: '🎓',
        check: (p) => {
            const v = totalChapters(p.chaptersRead)
            return { unlocked: v >= 250, progressValue: Math.min(v, 250), target: 250 }
        },
    },
    {
        id: 'chapters_500',
        title: 'Wisdom Seeker',
        description: 'Read 500 chapters total',
        category: 'chapters',
        tier: 'gold',
        emoji: '🔮',
        check: (p) => {
            const v = totalChapters(p.chaptersRead)
            return { unlocked: v >= 500, progressValue: Math.min(v, 500), target: 500 }
        },
    },
    {
        id: 'chapters_1000',
        title: 'Living Word',
        description: 'Read 1,000 chapters total',
        category: 'chapters',
        tier: 'platinum',
        emoji: '✍️',
        check: (p) => {
            const v = totalChapters(p.chaptersRead)
            return { unlocked: v >= 1000, progressValue: Math.min(v, 1000), target: 1000 }
        },
    },

    // ── Book completion achievements ──────────────────────────────────────────
    {
        id: 'book_genesis',
        title: 'In the Beginning',
        description: 'Complete the Book of Genesis (50 chapters)',
        category: 'books',
        tier: 'silver',
        emoji: '🌱',
        bookId: '01-genesis',
        check: (p) => {
            const v = bookChaptersRead(p.chaptersRead, '01-genesis')
            return { unlocked: isBookComplete(p.chaptersRead, '01-genesis', 50), progressValue: Math.min(v, 50), target: 50 }
        },
    },
    {
        id: 'book_psalms',
        title: 'Psalms of David',
        description: 'Complete the Book of Psalms (151 chapters)',
        category: 'books',
        tier: 'gold',
        emoji: '🎵',
        bookId: '28-psalms',
        check: (p) => {
            const v = bookChaptersRead(p.chaptersRead, '28-psalms')
            return { unlocked: isBookComplete(p.chaptersRead, '28-psalms', 151), progressValue: Math.min(v, 151), target: 151 }
        },
    },
    {
        id: 'book_proverbs',
        title: 'Wisdom of Proverbs',
        description: 'Complete the Book of Proverbs (24 chapters)',
        category: 'books',
        tier: 'bronze',
        emoji: '💡',
        bookId: '29-proverbs',
        check: (p) => {
            const v = bookChaptersRead(p.chaptersRead, '29-proverbs')
            return { unlocked: isBookComplete(p.chaptersRead, '29-proverbs', 24), progressValue: Math.min(v, 24), target: 24 }
        },
    },
    {
        id: 'book_isaiah',
        title: 'Voice of the Prophet',
        description: 'Complete the Book of Isaiah (66 chapters)',
        category: 'books',
        tier: 'gold',
        emoji: '🕊️',
        bookId: '35-isaiah',
        check: (p) => {
            const v = bookChaptersRead(p.chaptersRead, '35-isaiah')
            return { unlocked: isBookComplete(p.chaptersRead, '35-isaiah', 66), progressValue: Math.min(v, 66), target: 66 }
        },
    },
    {
        id: 'book_enoch',
        title: 'Ancient Scribe',
        description: 'Complete the Book of Enoch (42 chapters)',
        category: 'books',
        tier: 'silver',
        emoji: '📜',
        bookId: '16-enoch',
        check: (p) => {
            const v = bookChaptersRead(p.chaptersRead, '16-enoch')
            return { unlocked: isBookComplete(p.chaptersRead, '16-enoch', 42), progressValue: Math.min(v, 42), target: 42 }
        },
    },
    {
        id: 'book_matthew',
        title: 'Good News',
        description: 'Complete the Gospel of Matthew (28 chapters)',
        category: 'books',
        tier: 'silver',
        emoji: '✍️',
        bookId: '55-matthew',
        check: (p) => {
            const v = bookChaptersRead(p.chaptersRead, '55-matthew')
            return { unlocked: isBookComplete(p.chaptersRead, '55-matthew', 28), progressValue: Math.min(v, 28), target: 28 }
        },
    },
    {
        id: 'book_john',
        title: 'In the Beginning Was the Word',
        description: 'Complete the Gospel of John (21 chapters)',
        category: 'books',
        tier: 'silver',
        emoji: '🌊',
        bookId: '58-john',
        check: (p) => {
            const v = bookChaptersRead(p.chaptersRead, '58-john')
            return { unlocked: isBookComplete(p.chaptersRead, '58-john', 21), progressValue: Math.min(v, 21), target: 21 }
        },
    },
    {
        id: 'book_acts',
        title: 'Acts of Faith',
        description: 'Complete the Book of Acts (28 chapters)',
        category: 'books',
        tier: 'silver',
        emoji: '⚡',
        bookId: '59-act',
        check: (p) => {
            const v = bookChaptersRead(p.chaptersRead, '59-act')
            return { unlocked: isBookComplete(p.chaptersRead, '59-act', 28), progressValue: Math.min(v, 28), target: 28 }
        },
    },
    {
        id: 'book_revelation',
        title: 'The Final Word',
        description: 'Complete the Book of Revelation (22 chapters)',
        category: 'books',
        tier: 'gold',
        emoji: '⭐',
        bookId: '81-revelation',
        check: (p) => {
            const v = bookChaptersRead(p.chaptersRead, '81-revelation')
            return { unlocked: isBookComplete(p.chaptersRead, '81-revelation', 22), progressValue: Math.min(v, 22), target: 22 }
        },
    },

    // ── Testament completions ─────────────────────────────────────────────────
    {
        id: 'nt_complete',
        title: 'New Covenant',
        description: 'Read all chapters of the New Testament',
        category: 'books',
        tier: 'platinum',
        emoji: '🕊️',
        check: (p) => {
            const v = countNTChaptersRead(p.chaptersRead)
            return { unlocked: v >= ntTotalChapters, progressValue: Math.min(v, ntTotalChapters), target: ntTotalChapters }
        },
    },
    {
        id: 'ot_complete',
        title: 'Ancient Covenant',
        description: 'Read all chapters of the Old Testament',
        category: 'books',
        tier: 'platinum',
        emoji: '📜',
        check: (p) => {
            const v = countOTChaptersRead(p.chaptersRead)
            return { unlocked: v >= otTotalChapters, progressValue: Math.min(v, otTotalChapters), target: otTotalChapters }
        },
    },
]

export const computeAchievements = (progress: Progress): AchievementResult[] => {
    return ACHIEVEMENT_DEFINITIONS.map((def) => {
        const { unlocked, progressValue, target } = def.check(progress)
        return {
            id: def.id,
            title: def.title,
            description: def.description,
            category: def.category,
            tier: def.tier,
            emoji: def.emoji,
            bookId: def.bookId,
            unlocked,
            progressValue,
            target,
        }
    })
}

export const TIER_COLORS: Record<AchievementTier, { bg: string; border: string; text: string; badge: string }> = {
    bronze: {
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        border: 'border-amber-300 dark:border-amber-700',
        text: 'text-amber-800 dark:text-amber-300',
        badge: 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    },
    silver: {
        bg: 'bg-slate-50 dark:bg-slate-900/40',
        border: 'border-slate-300 dark:border-slate-600',
        text: 'text-slate-700 dark:text-slate-300',
        badge: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    },
    gold: {
        bg: 'bg-yellow-50 dark:bg-yellow-950/30',
        border: 'border-yellow-400 dark:border-yellow-600',
        text: 'text-yellow-800 dark:text-yellow-300',
        badge: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    },
    platinum: {
        bg: 'bg-purple-50 dark:bg-purple-950/30',
        border: 'border-purple-400 dark:border-purple-600',
        text: 'text-purple-800 dark:text-purple-300',
        badge: 'bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    },
}
