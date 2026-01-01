import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Note {
  id: string
  _id?: string
  title: string
  content: string
  book?: string
  chapter?: number
  verse?: number
  bookId?: string
  verseStart?: number
  verseCount?: number
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
  editingNote: Note | null
  setEditingNote: (note: Note | null) => void
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      isLoading: false,
      error: null,
      editingNote: null,
      setEditingNote: (note) => set({ editingNote: note }),

      fetchNotes: async () => {
        set({ isLoading: true })
        try {
          const res = await fetch('/api/notes')
          const data = await res.json()
          if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch notes')
          
          // Align with backend response: data.data.data is the paginated notes array
          const notesArray = data.data?.data || (Array.isArray(data) ? data : [])
          set({ notes: notesArray, error: null })
        } catch (error: any) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },

      addNote: async (note: any) => {
        set({ isLoading: true })
        try {
          const payload = {
            bookId: note.bookId || 'GEN',
            chapter: note.chapter || 1,
            verseStart: note.verseStart || 1,
            verseCount: note.verseCount || 1,
            content: note.title ? `${note.title}\n\n${note.content}` : note.content,
            visibility: 'private'
          }
          const res = await fetch('/api/notes', {
            method: 'POST',
            body: JSON.stringify(payload),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.message || data.error || 'Failed to add note')
          set({ notes: [data.data?.note || data, ...get().notes], error: null })
        } catch (error: any) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },

      updateNote: async (id, note: any) => {
        set({ isLoading: true })
        try {
          const payload = {
            content: note.title ? `${note.title}\n\n${note.content}` : note.content,
            visibility: note.visibility || 'private'
          }
          const res = await fetch(`/api/notes/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.message || data.error || 'Failed to update note')
          set({
            notes: get().notes.map((n) => ((n.id === id || n._id === id) ? (data.data?.note || data) : n)),
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
      skipHydration: false,
    }
  )
)
