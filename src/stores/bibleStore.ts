import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { VerseRef } from "./types";

interface BibleState {
  current: VerseRef;
  history: VerseRef[]; // ARRAY TO MAKE IT A BACKSTACK FOR PAST HISTORY
  setCurrent: (v: VerseRef) => void;
  goBack: () => void;
  goToNextChapter: (totalChaptersInCurrentBook: number) => void;
  goToPreviousChapter: () => void;
  reset: (v?: VerseRef) => void;
}

export const useBibleStore = create<BibleState>()(
  devtools((set) => ({
    current: { book: "Genesis", chapter: 1, verse: 1 },
    history: [],

    setCurrent: (v) =>
      set((s) => ({ history: [...s.history, s.current], current: v })),
    goBack: () =>
      set((s) => {
        const last = s.history[s.history.length - 1];
        if (!last) return s;
        return { current: last, history: s.history.slice(0, -1) };
      }),

    goToNextChapter: (totalChaptersInCurrentBook: number) =>
      set((s) => {
        const { book } = s.current;
        let { chapter, verse } = s.current;

        if (chapter < totalChaptersInCurrentBook) {
          chapter += 1;
          verse = 1; // Reset to the first verse of the new chapter
        } else {
          // Optionally handle moving to the next book if needed, 
          // but for now, we'll stay on the last chapter of the current book
          // You'd need a list of books to determine the next book.
        }
        return { ...s, current: { book, chapter, verse } };
      }),

    goToPreviousChapter: () =>
      set((s) => {
        const { book } = s.current;
        let { chapter, verse } = s.current;

        if (chapter > 1) {
          chapter -= 1;
          verse = 1; // Reset to the first verse of the new chapter
        } else {
          // Optionally handle moving to the previous book if needed
          // For now, we'll stay on the first chapter of the current book
        }
        return { ...s, current: { book, chapter, verse } };
      }),

    reset: (v = { book: "Genesis", chapter: 1, verse: 1 }) =>
      set({ current: v, history: [] }),
  }))
);
