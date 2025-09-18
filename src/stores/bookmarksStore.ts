import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { BookMark, VerseRef } from "./types";

interface BookmarksState {
  bookmarks: BookMark[];
  isLoading: boolean;
  error?: string | null;

  loadBookmarks: () => Promise<void>;
  addBookmark: (verseRef: VerseRef) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useBookmarksStore = create<BookmarksState>()(
  devtools((set, get) => ({
    bookmarks: [],
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    loadBookmarks: async () => {
      set({ isLoading: true, error: null });
      try {
        const res = await fetch(
          "https://mylocalbackend/api/v1/user/me/api/bookmarks"
        );
        if (!res.ok) throw new Error("Failed to load bookmarks");
        const data = (await res.json()) as BookMark[];
        set({ bookmarks: data, isLoading: false });
      } catch (err: any) {
        set({ isLoading: false, error: err?.message ?? "Unknown" });
      }
    },

    addBookmark: async (verseRef) => {
      set({ error: null });

      // UNIQUE TEMP ID WITH TIMESTAMP
      const tempId = `temp-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;
      const tempBookmark: BookMark = {
        _id: tempId,
        verseRef,
        createdAt: new Date().toISOString(),
      };

      // OPTIMISTIC UPDATE
      set((state) => ({ bookmarks: [tempBookmark, ...state.bookmarks] }));

      try {
        const res = await fetch(
          "https://mylocalbackend/api/v1/user/me/api/bookmarks",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookId: verseRef.book,
              chapter: verseRef.chapter,
              verse: verseRef.verse,
            }),
          }
        );
        if (!res.ok) throw new Error("Failed to add bookmark");
        const backendResponse = await res.json();

        const createdBookmark: BookMark = {
          _id: backendResponse._id,
          verseRef: {
            book: backendResponse.bookId,
            chapter: backendResponse.chapter,
            verse: backendResponse.verse,
          },
          createdAt: backendResponse.createdAt,
        };

        // REPLACE TEMP WITH REAL BOOKMARKS
        set((state) => ({
          bookmarks: state.bookmarks.map((bookmark) =>
            bookmark._id === tempId ? createdBookmark : bookmark
          ),
        }));
      } catch (err: any) {
        set((state) => ({
          bookmarks: state.bookmarks.filter(
            (bookmark) => bookmark._id !== tempId
          ),
          error: err?.message ?? "Failed to add bookmark",
        }));
      }
    },

    removeBookmark: async (id) => {
      const originalBookmarks = get().bookmarks;
      const bookmarkToDelete = originalBookmarks.find((b) => b._id === id);

      if (!bookmarkToDelete) {
        set({ error: "Bookmark not found" });
        return;
      }

      // OPTIMISTIC DELETE
      set((state) => ({
        bookmarks: state.bookmarks.filter((bookmark) => bookmark._id !== id),
        error: null,
      }));

      try {
        const res = await fetch(
          `https://mylocalbackend/api/v1/user/me/api/bookmarks/${id}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Failed to delete bookmark");
      } catch (err: any) {
        // ROLLBACK IN CASE OF FAILED DELETION
        set({
          bookmarks: originalBookmarks,
          error: err?.message ?? "Failed to delete bookmark",
        });
      }
    },
  }))
);
