import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
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

    // ✅ LOAD all highlights from the API proxy
    loadHighlights: async () => {
      set({ isLoading: true, error: null })
      try {
        const res = await fetch('/api/highlights')
        if (!res.ok) throw new Error('Failed to load highlights')
        const json = await res.json()
        const data = json.data || json
        set({ highlights: data, isLoading: false })
      } catch (err: any) {
        set({ isLoading: false, error: err?.message ?? 'Unknown' })
      }
    },

    // ✅ ADD a new highlight (calls /api/highlights)
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
        const res = await fetch('/api/highlights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookId: verseRef.book,
            chapter: verseRef.chapter,
            verseStart: verseRef.verse,
            verseCount: 1,
            color,
          }),
        })

        if (!res.ok) throw new Error('Failed to add highlight')
        const backendResponse = await res.json()
        const backendHighlight = backendResponse.data?.highlight

        const createdHighlight: Highlight = {
          _id: backendHighlight._id,
          verseRef: {
            book: backendHighlight.bookId,
            chapter: backendHighlight.chapter,
            verse: backendHighlight.verseStart,
          },
          color: backendHighlight.color,
          createdAt: backendHighlight.createdAt,
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
          error: err?.message ?? 'Failed to add highlight',
        }))
      }
    },

    // ✅ REMOVE highlight (calls /api/highlights/:id)
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
        const res = await fetch(`/api/highlights/${id}`, {
          method: 'DELETE',
        })
        if (!res.ok) throw new Error('Failed to delete highlight')
      } catch (err: any) {
        set({
          highlights: originalHighlights,
          error: err?.message ?? 'Failed to delete highlight',
        })
      }
    },

    // ✅ CHANGE color (calls /api/highlights/:id)
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
        const res = await fetch(`/api/highlights/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ color }),
        })
        if (!res.ok) throw new Error('Failed to change highlight color')
      } catch (err: any) {
        set({
          highlights: originalHighlights,
          error: err?.message ?? 'Failed to change highlight color',
        })
      }
    },
  })),
)
