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

    loadHighlights: async () => {
      set({ isLoading: true, error: null })
      try {
        const res = await axios.get('/api/highlights/add', { withCredentials: true })
        const responseData = res.data?.data || res.data
        const highlightsArray = responseData?.data || responseData

        const parseNumber = (value: any, fallback: number) => {
          const num = Number(value)
          return Number.isFinite(num) ? num : fallback
        }

        const transformedHighlights: Highlight[] = Array.isArray(highlightsArray)
          ? highlightsArray
              .filter((h: any) => h && h._id)
              .map((h: any) => {
                const book = h.bookId || h.verseRef?.book || h.book || ''
                const chapter = parseNumber(h.verseRef?.chapter ?? h.chapter, 0)
                const verseStart = parseNumber(
                  h.verseRef?.verseStart ?? h.verseRef?.verse ?? h.verseStart ?? h.verse,
                  0
                )
                const verseCount = parseNumber(h.verseRef?.verseCount ?? h.verseCount, 1) || 1

                return {
                  _id: h._id,
                  verseRef: {
                    book,
                    chapter,
                    verseStart,
                    verseCount,
                  },
                  color: h.color || 'yellow',
                  createdAt: h.createdAt || new Date().toISOString(),
                }
              })
              .filter(
                (h: Highlight) =>
                  h.verseRef.book &&
                  Number.isFinite(h.verseRef.chapter) &&
                  Number.isFinite(h.verseRef.verseStart)
              )
          : []

        set({ highlights: transformedHighlights, isLoading: false })
      } catch (err: any) {
        set({ isLoading: false, error: err?.response?.data?.error || err?.message || 'Failed to load highlights' })
      }
    },

    addHighlight: async (verseRef, color = 'yellow') => {
      set({ error: null })
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const tempHighlight: Highlight = { _id: tempId, verseRef, color, createdAt: new Date().toISOString() }

      set((state) => ({ highlights: [tempHighlight, ...state.highlights] }))

      try {
        const res = await axios.post(
          '/api/highlights/add',
          { ...verseRef, bookId: verseRef.book, color },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        )

        const backendHighlight = res.data?.data?.highlight || res.data?.highlight
        if (!backendHighlight?._id) throw new Error('Invalid response from server')

        const createdHighlight: Highlight = {
          _id: backendHighlight._id,
          verseRef: {
            book: backendHighlight.bookId || backendHighlight.book || verseRef.book,
            chapter: backendHighlight.chapter,
            verseStart: backendHighlight.verseStart ?? backendHighlight.verse ?? verseRef.verseStart,
            verseCount: backendHighlight.verseCount ?? verseRef.verseCount ?? 1,
          },
          color: backendHighlight.color || color,
          createdAt: backendHighlight.createdAt || new Date().toISOString(),
        }

        // Replace temp with backend highlight
        set((state) => ({
          highlights: state.highlights.map((h) => (h._id === tempId ? createdHighlight : h)),
        }))
      } catch (err: any) {
        // On failure remove temp highlight
        set((state) => ({
          highlights: state.highlights.filter((h) => h._id !== tempId),
          error: err?.response?.data?.error || err?.message || 'Failed to add highlight',
        }))
      }
    },

    removeHighlight: async (id) => {
      const original = get().highlights
      set((state) => ({ highlights: state.highlights.filter((h) => h._id !== id), error: null }))
      try {
        await axios.delete('/api/highlights/delete', { data: { id }, withCredentials: true })
      } catch (err: any) {
        set({ highlights: original, error: err?.response?.data?.error || err?.message || 'Failed to delete highlight' })
      }
    },

    changeColor: async (id, color) => {
      // Only allow real backend IDs
      if (!id || id.startsWith('temp-')) {
        set({ error: 'Cannot change color of temporary highlight yet' })
        return
      }

      const original = get().highlights
      set((state) => ({
        highlights: state.highlights.map((h) => (h._id === id ? { ...h, color } : h)),
        error: null,
      }))

      try {
        await axios.put(
          `/api/highlights/${id}`,
          { _id: id, id, color },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        )
      } catch (err: any) {
        set({ highlights: original, error: err?.response?.data?.error || err?.message || 'Failed to change highlight color' })
      }
    },
  }))
)
