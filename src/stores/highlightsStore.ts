import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import axios from 'axios'
import type { Highlight, HighlightColor, VerseRef } from './types'

interface HighlightsState {
  highlights: Highlight[]
  isLoading: boolean
  error?: string | null

  loadHighlights: () => Promise<void>
  addHighlight: (verseRef: VerseRef, color?: HighlightColor) => Promise<void>
  removeHighlight: (id: string) => Promise<void>
  changeColor: (id: string, color: HighlightColor) => Promise<void>
  clearError: () => void
}

export const useHighlightsStore = create<HighlightsState>()(
  devtools((set, get) => ({
    highlights: [],
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    // LOAD all highlights from the API
    loadHighlights: async () => {
      set({ isLoading: true, error: null })
      try {
        const res = await axios.get('/api/highlights', {
          withCredentials: true,
        })
        
        // Handle nested data structure
        const responseData = res.data?.data || res.data
        const highlightsArray = responseData?.data || responseData
        
        // Transform backend format to frontend format
        // Backend: { _id, bookId, chapter, verseStart, color, ... }
        // Frontend: { _id, verseRef: { book, chapter, verse }, color, ... }
        const transformedHighlights: Highlight[] = Array.isArray(highlightsArray)
          ? highlightsArray
              .filter((h: any) => h && h._id) // Filter out invalid highlights
              .map((h: any) => {
                // If already in frontend format, return as-is
                if (h.verseRef) {
                  return h as Highlight
                }
                // Transform from backend format
                return {
                  _id: h._id,
                  verseRef: {
                    book: h.bookId || h.book || '',
                    chapter: h.chapter || 0,
                    verse: h.verseStart || h.verse || 0,
                  },
                  color: h.color || 'yellow',
                  createdAt: h.createdAt || new Date().toISOString(),
                }
              })
              .filter((h: Highlight) => h.verseRef.book && h.verseRef.chapter && h.verseRef.verse) // Filter invalid transformed highlights
          : []
        
        set({ highlights: transformedHighlights, isLoading: false })
      } catch (err: any) {
        set({
          isLoading: false,
          error: err?.response?.data?.error || err?.message || 'Failed to load highlights',
        })
      }
    },

    // ✅ ADD a new highlight (calls /api/highlights/add)
    addHighlight: async (verseRef, color = 'yellow') => {
      set({ error: null })

      // GENERATE UNIQUE TEMP ID WITH TIMESTAMP FOR UNIQUENESS
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const tempHighlight: Highlight = {
        _id: tempId,
        verseRef,
        color,
        createdAt: new Date().toISOString(),
      }

      // Optimistic update
      set((state) => ({ highlights: [tempHighlight, ...state.highlights] }))

      try {
        const res = await axios.post(
          '/api/highlights/add',
          {
            bookId: verseRef.book,
            chapter: verseRef.chapter,
            verseStart: verseRef.verse,
            verseCount: 1,
            color,
          },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        )

        const backendResponse = res.data
        const backendHighlight = backendResponse?.data?.highlight || backendResponse?.highlight

        if (!backendHighlight?._id) {
          throw new Error('Invalid response from server')
        }

        const createdHighlight: Highlight = {
          _id: backendHighlight._id,
          verseRef: {
            book: backendHighlight.bookId || backendHighlight.book,
            chapter: backendHighlight.chapter,
            verse: backendHighlight.verseStart || backendHighlight.verse,
          },
          color: backendHighlight.color || color,
          createdAt: backendHighlight.createdAt || new Date().toISOString(),
        }

        // Replace temp highlight with real one
        set((state) => ({
          highlights: state.highlights.map((h) =>
            h._id === tempId ? createdHighlight : h
          ),
        }))
      } catch (err: any) {
        set((state) => ({
          highlights: state.highlights.filter((h) => h._id !== tempId),
          error: err?.response?.data?.error || err?.message || 'Failed to add highlight',
        }))
      }
    },

    // ✅ REMOVE highlight (calls /api/highlights/delete)
    removeHighlight: async (id) => {
      const originalHighlights = get().highlights
      const highlightToDelete = originalHighlights.find((h) => h._id === id)
      if (!highlightToDelete) {
        set({ error: 'Highlight not found' })
        return
      }

      // Optimistic delete
      set((state) => ({
        highlights: state.highlights.filter((h) => h._id !== id),
        error: null,
      }))

      try {
        await axios.delete('/api/highlights/delete', {
          data: { id },
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        })
      } catch (err: any) {
        set({
          highlights: originalHighlights,
          error: err?.response?.data?.error || err?.message || 'Failed to delete highlight',
        })
      }
    },

    // ✅ CHANGE color (calls /api/highlights/[id])
    changeColor: async (id, color) => {
      const originalHighlights = get().highlights
      const highlightToUpdate = originalHighlights.find((h) => h._id === id)
      if (!highlightToUpdate) {
        set({ error: 'Highlight not found' })
        return
      }

      // Optimistic update
      set((state) => ({
        highlights: state.highlights.map((h) =>
          h._id === id ? { ...h, color } : h
        ),
        error: null,
      }))

      try {
        await axios.put(
          `/api/highlights/${id}`,
          { color },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        )
      } catch (err: any) {
        set({
          highlights: originalHighlights,
          error: err?.response?.data?.error || err?.message || 'Failed to change highlight color',
        })
      }
    },
  })),
)
