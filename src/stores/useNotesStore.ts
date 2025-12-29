import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Note {
  id: string
  title: string
  content: string
  book?: string
  chapter?: number
  verse?: number
  createdAt: string
  updatedAt: string
}

interface NotesState {
  notes: Note[]
  isLoading: boolean
  error: string | null
  fetchNotes: () => Promise<void>
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateNote: (id: string, note: Partial<Note>) => Promise<void>
  deleteNote: (id: string) => Promise<void>
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      isLoading: false,
      error: null,

      fetchNotes: async () => {
        set({ isLoading: true })
        try {
          const res = await fetch('/api/notes')
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Failed to fetch notes')
          set({ notes: data, error: null })
        } catch (error: any) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },

      addNote: async (note) => {
        set({ isLoading: true })
        try {
          const res = await fetch('/api/notes', {
            method: 'POST',
            body: JSON.stringify(note),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Failed to add note')
          set({ notes: [data, ...get().notes], error: null })
        } catch (error: any) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },

      updateNote: async (id, note) => {
        set({ isLoading: true })
        try {
          const res = await fetch(`/api/notes/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(note),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Failed to update note')
          set({
            notes: get().notes.map((n) => (n.id === id ? data : n)),
            error: null,
          })
        } catch (error: any) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },

      deleteNote: async (id) => {
        set({ isLoading: true })
        try {
          const res = await fetch(`/api/notes/${id}`, {
            method: 'DELETE',
          })
          if (!res.ok) {
            const data = await res.json()
            throw new Error(data.error || 'Failed to delete note')
          }
          set({
            notes: get().notes.filter((n) => (n.id !== id)),
            error: null,
          })
        } catch (error: any) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'notes-storage',
    }
  )
)
