import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import axiosInstance from '@/lib/axios'
import type { Highlight, HighlightColor, VerseRef } from './types'

type RawHighlight = {
  _id: string
  verseRef?: {
    book?: string
    chapter?: number | string
    verseStart?: number | string
    verse?: number | string
    verseCount?: number | string
  }
  bookId?: string
  book?: string
  chapter?: number | string
  verseStart?: number | string
  verse?: number | string
  verseCount?: number | string
  color?: HighlightColor
  createdAt?: string
  text?: string
  content?: string
}

const normalizeHighlight = (
  raw: RawHighlight | undefined,
  fallback?: { verseRef?: VerseRef; color?: HighlightColor },
): Highlight | null => {
  if (!raw?._id) return null

  const sourceVerse = raw.verseRef ?? {}

  const book = raw.bookId || sourceVerse.book || raw.book || fallback?.verseRef?.book
  const chapter = Number(
    sourceVerse.chapter ?? raw.chapter ?? fallback?.verseRef?.chapter ?? Number.NaN,
  )
  const verseStart = Number(
    sourceVerse.verseStart ??
    sourceVerse.verse ??
    raw.verseStart ??
    raw.verse ??
    fallback?.verseRef?.verseStart ??
    Number.NaN,
  )
  const verseCount = Number(
    sourceVerse.verseCount ?? raw.verseCount ?? fallback?.verseRef?.verseCount ?? 1,
  )
  const color = raw.color || fallback?.color || 'yellow'

  if (!book || !Number.isFinite(chapter) || !Number.isFinite(verseStart)) {
    return null
  }

  return {
    _id: raw._id,
    verseRef: {
      book,
      chapter,
      verseStart,
      verseCount: Number.isFinite(verseCount) && verseCount > 0 ? verseCount : 1,
    },
    color,
    createdAt: raw.createdAt || new Date().toISOString(),
    text: raw.text || raw.content
  }
}

const normalizeBookId = (book?: string) => (book ? book.toLowerCase().replace(/\s+/g, '-') : '')

const isSameHighlightStart = (highlight: Highlight | undefined, verseRef: VerseRef): boolean => {
  if (!highlight?.verseRef) return false
  const { book, chapter, verseStart } = highlight.verseRef
  return (
    normalizeBookId(book) === normalizeBookId(verseRef.book) &&
    Number(chapter) === Number(verseRef.chapter) &&
    Number(verseStart) === Number(verseRef.verseStart)
  )
}

interface HighlightsState {
  highlights: Highlight[]
  isLoading: boolean
  error?: string | null

  loadHighlights: (preferredTranslation?: string) => Promise<void>
  addHighlight: (verseRef: VerseRef, color?: HighlightColor) => Promise<void>
  removeHighlight: (id: string) => Promise<void>
  changeColor: (id: string, color: HighlightColor) => Promise<void>
  clearError: () => void
  hydrateTexts: (preferredTranslation?: string) => Promise<void>
}

export const useHighlightsStore = create<HighlightsState>()(
  devtools((set, get) => ({
    highlights: [],
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    loadHighlights: async (preferredTranslation) => {
      set({ isLoading: true, error: null })
      try {
        const res = await axiosInstance.get('/api/highlights', {
          params: {
            limit: 1000,
            ...(preferredTranslation ? { preferredTranslation } : {}),
          },
        })
        const responseData = res.data?.data || res.data
        const highlightsArray = responseData?.data || responseData

        const transformedHighlights: Highlight[] = Array.isArray(highlightsArray)
          ? highlightsArray
            .map((raw: RawHighlight) => normalizeHighlight(raw))
            .filter((h): h is Highlight => Boolean(h))
          : []

        set({ highlights: transformedHighlights, isLoading: false })
        await get().hydrateTexts(preferredTranslation)
      } catch (err: any) {
        set({
          isLoading: false,
          error: err?.response?.data?.error || err?.message || 'Failed to load highlights',
        })
        throw err
      }
    },

    addHighlight: async (verseRef, color = 'yellow') => {
      set({ error: null })

      const existing = get().highlights.find((highlight) =>
        isSameHighlightStart(highlight, verseRef),
      )
      if (existing && !existing._id.startsWith('temp-')) {
        await get().changeColor(existing._id, color)
        return
      }

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const tempHighlight: Highlight = {
        _id: tempId,
        verseRef,
        color,
        createdAt: new Date().toISOString(),
      }

      set((state) => ({ highlights: [tempHighlight, ...state.highlights] }))

      // Start background fetch for text if needed (optimization)
      // For now, let's just let the UI trigger it or do it on load

      try {
        const res = await axiosInstance.post('/api/highlights', {
          ...verseRef,
          bookId: verseRef.book,
          color,
        })

        const backendHighlight =
          res.data?.data?.highlight || res.data?.data || res.data?.highlight || res.data
        const createdHighlight = normalizeHighlight(backendHighlight, { verseRef, color })

        if (!createdHighlight) {
          throw new Error('Invalid highlight response from server')
        }

        set((state) => ({
          highlights: state.highlights.map((h) => (h._id === tempId ? createdHighlight : h)),
        }))
      } catch (err: any) {
        // Remove temp highlight
        set((state) => ({
          highlights: state.highlights.filter((h) => h._id !== tempId),
        }))

        if (err?.response?.status === 409) {
          try {
            await get().loadHighlights()
            const refreshed = get().highlights.find((highlight) =>
              isSameHighlightStart(highlight, verseRef),
            )
            if (refreshed && !refreshed._id.startsWith('temp-')) {
              await get().changeColor(refreshed._id, color)
              return
            }
          } catch (conflictErr) {
            console.error('Failed to resolve highlight conflict:', conflictErr)
          }
        }

        set({
          error: err?.response?.data?.error || err?.message || 'Failed to add highlight',
        })
        throw err
      }
    },

    removeHighlight: async (id) => {
      const original = get().highlights
      set((state) => ({ highlights: state.highlights.filter((h) => h._id !== id), error: null }))
      try {
        await axiosInstance.delete(`/api/highlights/${id}`)
      } catch (err: any) {
        set({
          highlights: original,
          error: err?.response?.data?.error || err?.message || 'Failed to delete highlight',
        })
        throw err
      }
    },

    changeColor: async (id, color) => {
      // Only allow real backend IDs
      if (!id || id.startsWith('temp-')) {
        const error = new Error('Cannot change color of temporary highlight yet')
        set({ error: 'Cannot change color of temporary highlight yet' })
        throw error
      }

      const original = get().highlights
      set((state) => ({
        highlights: state.highlights.map((h) => (h._id === id ? { ...h, color } : h)),
        error: null,
      }))

      try {
        const res = await axiosInstance.put(`/api/highlights/${id}`, { color })
        const backendHighlight =
          res.data?.data?.highlight || res.data?.data || res.data?.highlight || res.data
        const normalized = normalizeHighlight(
          backendHighlight,
          original.find((h) => h._id === id)
            ? { verseRef: original.find((h) => h._id === id)?.verseRef, color }
            : undefined,
        )

        if (normalized) {
          set((state) => ({
            highlights: state.highlights.map((h) => (h._id === id ? normalized : h)),
          }))
        }
      } catch (err: any) {
        set({
          highlights: original,
          error: err?.response?.data?.error || err?.message || 'Failed to change highlight color',
        })
        throw err
      }
    },

    hydrateTexts: async (preferredTranslation) => {
      const { highlights } = get()
      const missingText = highlights.filter((h) => !h.text)
      if (missingText.length === 0) return

      // Fetch in parallel but limited? For now, basic Promise.all
      // In production, might want p-limit or similar
      const updates = await Promise.all(
        missingText.map(async (h) => {
          try {
            const { book, chapter, verseStart } = h.verseRef
            const res = await axiosInstance.get('/api/verse', {
              params: {
                bookId: book,
                chapter,
                verse: verseStart,
                ...(preferredTranslation ? { preferredTranslation } : {}),
              },
            })
            if (res.data?.text) {
              return { id: h._id, text: res.data.text }
            }
          } catch (e) {
            // Ignore single failures to not break others
            console.error('Failed to fetch text for highlight', h._id, e)
          }
          return null
        })
      )

      set((state) => ({
        highlights: state.highlights.map((h) => {
          const update = updates.find((u) => u && u.id === h._id)
          return update ? { ...h, text: update.text } : h
        })
      }))
    },
  })),
)
