import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { books } from '@/data/data'
import type { BibleBook } from './types'

interface DailyVerse {
  text: string
  reference: string
  bookId: string
  chapter: number
  verse: number
}

interface DailyVerseState {
  verse: DailyVerse | null
  isLoading: boolean
  error?: string | null
  loadRandomVerse: () => Promise<void>
  clearError: () => void
}

const getRandomVerse = async (): Promise<DailyVerse> => {
  const randomBook = books[Math.floor(Math.random() * books.length)]
  const bookData: BibleBook = await import(`@/data/bible-data/${randomBook.file_name}.json`).then(
    (m) => m.default,
  )

  if (!bookData.chapters || bookData.chapters.length === 0) {
    throw new Error('Book has no chapters')
  }

  const randomChapter = bookData.chapters[Math.floor(Math.random() * bookData.chapters.length)]
  if (!randomChapter.sections || randomChapter.sections.length === 0) {
    throw new Error('Chapter has no sections')
  }

  const allVerses = randomChapter.sections.flatMap((section) =>
    section.verses.map((v) => ({ ...v, section })),
  )

  if (allVerses.length === 0) {
    throw new Error('Chapter has no verses')
  }

  const randomVerse = allVerses[Math.floor(Math.random() * allVerses.length)]

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

export const useDailyVerseStore = create<DailyVerseState>()(
  devtools((set) => ({
    verse: null,
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    loadRandomVerse: async () => {
      set({ isLoading: true, error: null })
      try {
        const verse = await getRandomVerse()
        set({ verse, isLoading: false })
      } catch (err: any) {
        set({ isLoading: false, error: err?.message ?? 'Failed to load daily verse' })
      }
    },
  })),
)
