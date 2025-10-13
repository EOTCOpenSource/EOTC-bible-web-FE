import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { VerseRef } from './types'
import { createBrowserStorage } from './storage'

interface BibleState {
  current: VerseRef
  history: VerseRef[] // ARRAY TO MAKE IT A BACKSTACK FOR PAST HISTORY
  selectedTestament: 'old' | 'new'
  setCurrent: (v: VerseRef) => void
  setSelectedTestament: (t: 'old' | 'new') => void
  goBack: () => void
  reset: (v?: VerseRef) => void
}

export const useBibleStore = create<BibleState>()(
  devtools(
    persist(
      (set, get) => ({
        current: { book: 'Genesis', chapter: 1, verse: 1 },
        history: [],
        selectedTestament: 'old',

        setCurrent: (v) => set((s) => ({ history: [...s.history, s.current], current: v })),
        setSelectedTestament: (t) => set({ selectedTestament: t }),
        goBack: () =>
          set((s) => {
            const last = s.history[s.history.length - 1]
            if (!last) return s
            return { current: last, history: s.history.slice(0, -1) }
          }),
        reset: (v = { book: 'Genesis', chapter: 1, verse: 1 }) => set({ current: v, history: [] }),
      }),
      {
        name: 'bible',
        storage: createBrowserStorage('eotc-'),
        partialize: (state) => ({
          selectedTestament: state.selectedTestament,
        }),
      },
    ),
  ),
)
