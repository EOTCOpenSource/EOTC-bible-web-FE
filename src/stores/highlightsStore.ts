import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Highlight, HighlightColor, VerseRef } from "./types";

interface HighlightsState {
  highlights: Highlight[];
  isLoading: boolean;
  error?: string | null;

  loadHighlights: () => Promise<void>;
  addHighlight: (verseRef: VerseRef, color?: HighlightColor) => Promise<void>;
  removeHighlight: (id: string) => Promise<void>;
  changeColor: (id: string, color: HighlightColor) => Promise<void>;
  clearError: () => void;
}

export const useHighlightsStore = create<HighlightsState>()(
  devtools((set, get) => ({
    highlights: [],
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    loadHighlights: async () => {
      set({ isLoading: true, error: null });
      try {
        const res = await fetch(
          "https://mylocalbackend/api/v1/user/me/api/highlights"
        );
        if (!res.ok) throw new Error("Failed to load highlights");
        const data = (await res.json()) as Highlight[];
        set({ highlights: data, isLoading: false });
      } catch (err: any) {
        set({ isLoading: false, error: err?.message ?? "Unknown" });
      }
    },

    addHighlight: async (verseRef, color = "yellow") => {
      set({ error: null });

      // GENERATE UNIQUE TEMP ID WITH TIMESTAMP FOR UNIQUENESS
      const tempId = `temp-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;
      const tempHighlight: Highlight = {
        _id: tempId,
        verseRef,
        color,
        createdAt: new Date().toISOString(),
      };

      // OPTIMISTIC UPDATE
      set((state) => ({ highlights: [tempHighlight, ...state.highlights] }));

      try {
        const res = await fetch(
          "https://mylocalbackend/api/v1/user/me/api/highlights",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookId: verseRef.book,
              chapter: verseRef.chapter,
              verse: verseRef.verse,
              color,
            }),
          }
        );
        if (!res.ok) throw new Error("Failed to add highlight");
        const backendResponse = await res.json();

        // CONVERTING THE BAVKEND RESPONSE TO MATCH THE HIGHLIGHT INTERFACE
        const createdHighlight: Highlight = {
          _id: backendResponse._id,
          verseRef: {
            book: backendResponse.bookId,
            chapter: backendResponse.chapter,
            verse: backendResponse.verse,
          },
          color: backendResponse.color,
          createdAt: backendResponse.createdAt,
        };

        // REPLACE TEMP WITH THE REALHIGHLIGHT FETCHED
        set((state) => ({
          highlights: state.highlights.map((highlight) =>
            highlight._id === tempId ? createdHighlight : highlight
          ),
        }));
      } catch (err: any) {
        set((state) => ({
          highlights: state.highlights.filter(
            (highlight) => highlight._id !== tempId
          ),
          error: err?.message ?? "Failed to add highlight",
        }));
      }
    },

    removeHighlight: async (id) => {
      const originalHighlights = get().highlights;
      const highlightToDelete = originalHighlights.find((h) => h._id === id);

      if (!highlightToDelete) {
        set({ error: "Highlight not found" });
        return;
      }

      // OPTIMISTIC DELETE
      set((state) => ({
        highlights: state.highlights.filter(
          (highlight) => highlight._id !== id
        ),
        error: null,
      }));

      try {
        const res = await fetch(
          `https://mylocalbackend/api/v1/user/me/api/highlights/${id}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Failed to delete highlight");
      } catch (err: any) {
        // ROLLBACK WHEN FAILED TO DELETE
        set({
          highlights: originalHighlights,
          error: err?.message ?? "Failed to delete highlight",
        });
      }
    },

    changeColor: async (id, color) => {
      const originalHighlights = get().highlights;
      const highlightToUpdate = originalHighlights.find((h) => h._id === id);

      if (!highlightToUpdate) {
        set({ error: "Highlight not found" });
        return;
      }

      // OPTIMISTIC UPDATE
      set((state) => ({
        highlights: state.highlights.map((highlight) =>
          highlight._id === id ? { ...highlight, color } : highlight
        ),
        error: null,
      }));

      try {
        const res = await fetch(
          `https://mylocalbackend/api/v1/user/me/api/highlights/${id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ color }),
          }
        );
        if (!res.ok) throw new Error("Failed to change highlight color");
      } catch (err: any) {
        // ROLLBACK IF FAILED TO UPDATE THE HILIGHT
        set({
          highlights: originalHighlights,
          error: err?.message ?? "Failed to change highlight color",
        });
      }
    },
  }))
);
