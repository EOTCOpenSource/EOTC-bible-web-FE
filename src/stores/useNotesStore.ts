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
          
          // Transform notes to extract title from content if title doesn't exist
          const transformedNotes = notesArray.map((note: any) => {
            if (note.title) {
              return note
            }
            // Extract title from content (format: "title\n\ncontent")
            const parts = (note.content || '').split('\n\n')
            if (parts.length > 1) {
              return {
                ...note,
                title: parts[0].trim(),
                content: parts.slice(1).join('\n\n')
              }
            }
            // If no title found, use first line or "Untitled"
            const firstLine = (note.content || '').split('\n')[0]?.trim()
            return {
              ...note,
              title: firstLine || 'Untitled',
              content: note.content || ''
            }
          })
          
          set({ notes: transformedNotes, error: null })
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
          
          // Transform the new note to extract title
          const newNote = data.data?.note || data
          let transformedNote = newNote
          if (!newNote.title && newNote.content) {
            const parts = newNote.content.split('\n\n')
            if (parts.length > 1) {
              transformedNote = {
                ...newNote,
                title: parts[0].trim(),
                content: parts.slice(1).join('\n\n')
              }
            } else {
              const firstLine = newNote.content.split('\n')[0]?.trim()
              transformedNote = {
                ...newNote,
                title: firstLine || 'Untitled',
                content: newNote.content
              }
            }
          }
          
          set({ notes: [transformedNote, ...get().notes], error: null })
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
            method: 'PUT',
            body: JSON.stringify(payload),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.message || data.error || 'Failed to update note')
          
          // Transform the updated note to extract title
          const updatedNote = data.data?.note || data
          let transformedNote = updatedNote
          if (!updatedNote.title && updatedNote.content) {
            const parts = updatedNote.content.split('\n\n')
            if (parts.length > 1) {
              transformedNote = {
                ...updatedNote,
                title: parts[0].trim(),
                content: parts.slice(1).join('\n\n')
              }
            } else {
              const firstLine = updatedNote.content.split('\n')[0]?.trim()
              transformedNote = {
                ...updatedNote,
                title: firstLine || 'Untitled',
                content: updatedNote.content
              }
            }
          }
          
          set({
            notes: get().notes.map((n) => ((n.id === id || n._id === id) ? transformedNote : n)),
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
            notes: get().notes.filter((n) => !(n.id === id || n._id === id)),
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
