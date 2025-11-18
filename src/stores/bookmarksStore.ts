import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { BookMark, VerseRef, BibleBook } from './types'
import axiosInstance from '@/lib/axios' // Import axiosInstance
import { books } from '@/data/data'

interface BookmarksState {
  bookmarks: BookMark[]
  bibleBooks: Map<string, BibleBook>
  isLoading: boolean
  error?: string | null

  loadBookmarks: () => Promise<void>
  loadBibleBook: (bookId: string) => Promise<void>
  addBookmark: (verseRef: VerseRef) => Promise<void>
  removeBookmark: (id: string) => Promise<void>
  clearError: () => void
}

export const useBookmarksStore = create<BookmarksState>()(
  devtools((set, get) => ({
    bookmarks: [],
    bibleBooks: new Map(),
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    loadBibleBook: async (bookId: string) => {
      const book = books.find((b) => b.book_name_en.toLowerCase().replace(/ /g, '-') === bookId)
      if (!book) {
        return
      }

      try {
        const res = await import(`@/data/bible-data/${book.file_name}.json`)
        const bookData = res.default
        set((state) => ({
          bibleBooks: new Map(state.bibleBooks).set(bookId, bookData),
        }))
      } catch (error) {
        console.error(`Failed to load bible book: ${bookId}`, error)
      }
    },

    loadBookmarks: async () => {
      set({ isLoading: true, error: null })
      try {
        const res = await axiosInstance.get('/api/bookmarks')
        const raw = res.data?.data?.data ?? []

        const bookmarks: BookMark[] = raw.map((item: any) => ({
          _id: item._id,
          bookId: item.bookId,
          chapter: item.chapter,
          verseStart: item.verseStart,
          verseCount: item.verseCount,
          createdAt: item.createdAt,
        }))

        set({ bookmarks, isLoading: false })

        const bookIds = new Set(bookmarks.map((b) => b.bookId))
        for (const bookId of bookIds) {
          get().loadBibleBook(bookId)
        }
      } catch (err: any) {
        set({ isLoading: false, error: err?.response?.data?.error ?? err?.message ?? 'Unknown' })
      }
    },

    addBookmark: async (verseRef) => {
      set({ error: null })

      // UNIQUE TEMP ID WITH TIMESTAMP
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const tempBookmark: BookMark = {
        _id: tempId,
        bookId: verseRef.book,
        chapter: verseRef.chapter,
        verseStart: verseRef.verseStart,
        verseCount: verseRef.verseCount,
        createdAt: new Date().toISOString(),
      }

      // OPTIMISTIC UPDATE
      set((state) => ({ bookmarks: [tempBookmark, ...state.bookmarks] }))

      try {
        const res = await axiosInstance.post('/api/bookmarks', {
          // Use axiosInstance
          bookId: verseRef.book,
          chapter: verseRef.chapter,
          verseStart: verseRef.verseStart,
          verseCount: verseRef.verseCount,
        })
        const createdBookmark = res.data?.data

        // REPLACE TEMP WITH REAL BOOKMARKS
        set((state) => ({
          bookmarks: state.bookmarks.map((bookmark) =>
            bookmark._id === tempId ? createdBookmark : bookmark,
          ),
        }))
      } catch (err: any) {
        set((state) => ({
          bookmarks: state.bookmarks.filter((bookmark) => bookmark._id !== tempId),
          error: err?.response?.data?.error ?? err?.message ?? 'Failed to add bookmark',
        }))
      }
    },

    removeBookmark: async (id) => {
      const originalBookmarks = get().bookmarks
      const bookmarkToDelete = originalBookmarks.find((b) => b._id === id)

      if (!bookmarkToDelete) {
        set({ error: 'Bookmark not found' })
        return
      }

      // OPTIMISTIC DELETE
      set((state) => ({
        bookmarks: state.bookmarks.filter((bookmark) => bookmark._id !== id),
        error: null,
      }))

      try {
        await axiosInstance.delete(`/api/bookmarks/${id}`) // Use axiosInstance
      } catch (err: any) {
        // ROLLBACK IN CASE OF FAILED DELETION
        set({
          bookmarks: originalBookmarks,
          error: err?.response?.data?.error ?? err?.message ?? 'Failed to delete bookmark',
        })
      }
    },
  })),
)
