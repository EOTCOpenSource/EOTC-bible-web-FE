import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { books } from '@/data/data'
import type { BibleBook } from './types'

interface DailyVerse {
  text: string
  reference: string
  bookId: string
  chapter: number
  verse: number
}

interface VerseStats {
  likes: number
  shares: number
  bookmarks: number
  userLiked: boolean
  userShared: boolean
  userBookmarked: boolean
}

interface DailyVerseState {
  verse: DailyVerse | null
  isLoading: boolean
  error?: string | null
  stats: VerseStats | null
  loadDailyVerse: () => Promise<void>
  clearError: () => void
  initStats: (likesStr: string, sharesStr: string, bookmarksStr: string) => void
  toggleLike: () => void
  toggleShare: () => void
  toggleBookmark: () => void
}

const getSeededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const getDailyVerse = async (): Promise<DailyVerse> => {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()

  const randomBookIndex = Math.floor(getSeededRandom(seed) * books.length)
  const randomBook = books[randomBookIndex]
  const bookData: BibleBook = await import(`@/data/bible-data/${randomBook.file_name}.json`).then(
    (m) => m.default,
  )

  if (!bookData.chapters || bookData.chapters.length === 0) {
    throw new Error('Book has no chapters')
  }

  const randomChapterIndex = Math.floor(getSeededRandom(seed + 1) * bookData.chapters.length)
  const randomChapter = bookData.chapters[randomChapterIndex]
  if (!randomChapter.sections || randomChapter.sections.length === 0) {
    throw new Error('Chapter has no sections')
  }

  const allVerses = randomChapter.sections.flatMap((section) =>
    section.verses.map((v) => ({ ...v, section })),
  )

  if (allVerses.length === 0) {
    throw new Error('Chapter has no verses')
  }

  const randomVerseIndex = Math.floor(getSeededRandom(seed + 2) * allVerses.length)
  const randomVerse = allVerses[randomVerseIndex]

  const bookName = randomBook.book_short_name_en || randomBook.book_name_en
  const reference = `${bookName} ${randomChapter.chapter}:${randomVerse.verse}`

  return {
    text: randomVerse.text,
    reference,
    bookId: randomBook.book_name_en.toLowerCase().replace(/ /g, '-'),
    chapter: randomChapter.chapter,
    verse: randomVerse.verse,
  }
}

const parseStat = (str: string) => {
  const num = parseFloat(str)
  if (str.toLowerCase().includes('k')) return num * 1000
  if (str.toLowerCase().includes('m')) return num * 1000000
  return num || 0
}

export const useDailyVerseStore = create<DailyVerseState>()(
  devtools(
    persist(
      (set, get) => ({
        verse: null,
        isLoading: false,
        error: null,
        stats: null,

        clearError: () => set({ error: null }),

        loadDailyVerse: async () => {
          set({ isLoading: true, error: null })
          try {
            const verse = await getDailyVerse()
            set({ verse, isLoading: false })
          } catch (err: any) {
            set({ isLoading: false, error: err?.message ?? 'Failed to load daily verse' })
          }
        },

        initStats: (likesStr, sharesStr, bookmarksStr) => {
          if (!get().stats) {
            set({
              stats: {
                likes: parseStat(likesStr),
                shares: parseStat(sharesStr),
                bookmarks: parseStat(bookmarksStr),
                userLiked: false,
                userShared: false,
                userBookmarked: false,
              },
            })
          }
        },

        toggleLike: () =>
          set((state) => {
            if (!state.stats) return state
            const { userLiked, likes } = state.stats
            return {
              stats: {
                ...state.stats,
                userLiked: !userLiked,
                likes: userLiked ? likes - 1 : likes + 1,
              },
            }
          }),

        toggleShare: () =>
          set((state) => {
            if (!state.stats) return state
            const { userShared, shares } = state.stats
            return {
              stats: {
                ...state.stats,
                userShared: !userShared,
                shares: userShared ? shares - 1 : shares + 1,
              },
            }
          }),

        toggleBookmark: () =>
          set((state) => {
            if (!state.stats) return state
            const { userBookmarked, bookmarks } = state.stats
            return {
              stats: {
                ...state.stats,
                userBookmarked: !userBookmarked,
                bookmarks: userBookmarked ? bookmarks - 1 : bookmarks + 1,
              },
            }
          }),
      }),
      {
        name: 'daily-verse-storage',
      }
    )
  )
)
