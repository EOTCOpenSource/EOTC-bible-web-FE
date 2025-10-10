import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { VerseRef } from './types'

interface BibleState {
  current: VerseRef
  history: VerseRef[] // ARRAY TO MAKE IT A BACKSTACK FOR PAST HISTORY
  setCurrent: (v: VerseRef) => void
  goBack: () => void
  reset: (v?: VerseRef) => void
}

export const useBibleStore = create<BibleState>()(
  devtools((set, get) => ({
    current: { book: 'Genesis', chapter: 1, verse: 1 },
    history: [],

    setCurrent: (v) => set((s) => ({ history: [...s.history, s.current], current: v })),
    goBack: () =>
      set((s) => {
        const last = s.history[s.history.length - 1]
        if (!last) return s
        return { current: last, history: s.history.slice(0, -1) }
      }),
    reset: (v = { book: 'Genesis', chapter: 1, verse: 1 }) => set({ current: v, history: [] }),
  })),
)
