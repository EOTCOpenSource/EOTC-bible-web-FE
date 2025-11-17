import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { BookMark, VerseRef } from './types'
import axiosInstance from '@/lib/axios' // Import axiosInstance

interface BookmarksState {
  bookmarks: BookMark[]
  isLoading: boolean
  error?: string | null

  loadBookmarks: () => Promise<void>
  addBookmark: (verseRef: VerseRef) => Promise<void>
  removeBookmark: (id: string) => Promise<void>
  clearError: () => void
}

export const useBookmarksStore = create<BookmarksState>()(
  devtools((set, get) => ({
    bookmarks: [],
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    loadBookmarks: async () => {
      set({ isLoading: true, error: null })
      try {
        const res = await axiosInstance.get('/api/bookmarks') // Use axiosInstance
        const data = res.data as BookMark[] // Axios returns data in res.data
        set({ bookmarks: data, isLoading: false })
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
        verseRef,
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
        const backendResponse = res.data // Axios returns data in res.data

        const createdBookmark: BookMark = {
          _id: backendResponse._id,
          verseRef: {
            book: backendResponse.bookId,
            chapter: backendResponse.chapter,
            verseStart: verseRef.verseStart,
            verseCount: verseRef.verseCount,
          },
          createdAt: backendResponse.createdAt,
        }

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
