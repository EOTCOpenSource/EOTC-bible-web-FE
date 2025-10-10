import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Note, VerseRef } from './types'

interface NotesState {
  notes: Note[]
  editing?: Note | null
  isLoading: boolean
  error?: string | null

  loadNotes: (verse?: VerseRef) => Promise<void>
  createNote: (payload: { verseRef: VerseRef; content: string; tags?: string[] }) => Promise<void>
  updateNote: (id: string, content: string) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  startEditing: (n: Note | null) => void
  clearError: () => void
}

export const useNotesStore = create<NotesState>()(
  devtools((set, get) => ({
    notes: [],
    editing: null,
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    loadNotes: async (verse) => {
      set({ isLoading: true, error: null })
      try {
        const res = await fetch(
          `https://mylocalbackend/api/v1/user/me/api/notes${
            verse ? `?book=${verse.book}&chapter=${verse.chapter}&verse=${verse.verse}` : ''
          }`,
        )
        if (!res.ok) throw new Error('Failed to load notes')
        const data = (await res.json()) as Note[]
        set({ notes: data, isLoading: false })
      } catch (err: any) {
        set({ isLoading: false, error: err?.message ?? 'Unknown' })
      }
    },

    createNote: async ({ verseRef, content, tags }) => {
      set({ error: null })

      // USED TO UPDATE THE LOCAL STATE IMMEDIATELY BEFORE CONFIRRMING WITH THE BACKEND
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const tempNote: Note = {
        _id: tempId,
        verseRef,
        content,
        createdAt: new Date().toISOString(),
        tags,
      }
      set((state) => ({ notes: [tempNote, ...state.notes] })) // HERE IS THE OPTIMISTIC UPDATE

      try {
        const res = await fetch('https://mylocalbackend/api/v1/user/me/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verseRef, content, tags }),
        })
        if (!res.ok) throw new Error('Failed to create note')
        const createdNote = await res.json()
        set((state) => ({
          notes: state.notes.map((note) => (note._id === tempId ? createdNote : note)),
        }))
      } catch (err: any) {
        set((state) => ({
          notes: state.notes.filter((note) => note._id !== tempId),
          error: err?.message ?? 'Failed to create note',
        }))
      }
    },

    updateNote: async (id, content) => {
      const originalNotes = get().notes
      const originalNote = originalNotes.find((n) => n._id === id)

      if (!originalNote) {
        set({ error: 'Note not found' })
        return
      }

      // OPTIMISTIC UPDATE
      set((state) => ({
        notes: state.notes.map((note) =>
          note._id === id ? { ...note, content, updatedAt: new Date().toISOString() } : note,
        ),
        error: null,
      }))
      try {
        const res = await fetch(`https://mylocalbackend/api/v1/user/me/api/notes/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        })
        if (!res.ok) {
          throw new Error(`Failed to update note.`)
        }

        //GET UPDATED NOTE TO SYNC IF ANY BACKEND CHANGES
        const updatedNote = await res.json()
        set((state) => ({
          notes: state.notes.map((note) => (note._id === id ? updatedNote : note)),
        }))
      } catch (err: any) {
        // ROLLBACK TO ORIGINAL SATE IF FAILED TO UPDATE
        set({
          notes: originalNotes,
          error: err?.message ?? 'Failed to update note',
        })
        throw err
      }
    },

    deleteNote: async (id) => {
      const originalNotes = get().notes
      const noteToDelete = originalNotes.find((n) => n._id === id)

      if (!noteToDelete) {
        set({
          error: 'Note notfound',
        })
        return
      }

      // OPTIMISTIC DELETE
      set((state) => ({
        notes: state.notes.filter((note) => note._id !== id),
        error: null,
      }))
      try {
        const res = await fetch(`https://mylocalbackend/api/v1/user/me/api/notes/${id}`, {
          method: 'DELETE',
        })

        if (!res.ok) {
          throw new Error('Failed to delete note')
        }
      } catch (err: any) {
        // ROLLBACK IF FAILED TO DELETE
        set({
          notes: originalNotes,
          error: err?.message ?? 'Failed to delete note',
        })
        throw err
      }
    },

    startEditing: (n) => set({ editing: n }),
  })),
)
