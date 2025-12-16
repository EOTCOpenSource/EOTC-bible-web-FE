import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import axiosInstance from '@/lib/axios'
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

const transformBackendNote = (raw: any): Note => {
  const verseRef = raw.verseRef || {}
  return {
    _id: raw._id,
    verseRef: {
      book: verseRef.book || raw.book || '',
      chapter: Number(verseRef.chapter || raw.chapter || 0),
      verseStart: Number(verseRef.verseStart || verseRef.verse || raw.verseStart || raw.verse || 0),
      verseCount: Number(verseRef.verseCount || raw.verseCount || 1),
    },
    content: raw.content || '',
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt,
    tags: raw.tags || [],
  }
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
        let url = '/api/notes'
        if (verse) {
          url += `?book=${verse.book}&chapter=${verse.chapter}&verse=${verse.verseStart}`
        }
        const res = await axiosInstance.get(url)
        const responseData = res.data?.data || res.data
        const notesArray = responseData?.notes || responseData || []
        const notes: Note[] = Array.isArray(notesArray)
          ? notesArray.map((raw: any) => transformBackendNote(raw))
          : []
        set({ notes, isLoading: false })
      } catch (err: any) {
        set({
          isLoading: false,
          error: err?.response?.data?.error ?? err?.message ?? 'Failed to load notes',
        })
        throw err
      }
    },

    createNote: async ({ verseRef, content, tags }) => {
      set({ error: null })

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const tempNote: Note = {
        _id: tempId,
        verseRef,
        content,
        createdAt: new Date().toISOString(),
        tags,
      }
      set((state) => ({ notes: [tempNote, ...state.notes] }))

      try {
        const res = await axiosInstance.post('/api/notes', {
          verseRef,
          content,
          tags,
        })
        const responseData = res.data?.data || res.data
        const createdNote = transformBackendNote(responseData?.note || responseData)
        set((state) => ({
          notes: state.notes.map((note) => (note._id === tempId ? createdNote : note)),
        }))
      } catch (err: any) {
        set((state) => ({
          notes: state.notes.filter((note) => note._id !== tempId),
          error: err?.response?.data?.error ?? err?.message ?? 'Failed to create note',
        }))
        throw err
      }
    },

    updateNote: async (id, content) => {
      const originalNotes = get().notes
      const originalNote = originalNotes.find((n) => n._id === id)

      if (!originalNote) {
        set({ error: 'Note not found' })
        return
      }

      set((state) => ({
        notes: state.notes.map((note) =>
          note._id === id ? { ...note, content, updatedAt: new Date().toISOString() } : note,
        ),
        error: null,
      }))

      try {
        const res = await axiosInstance.patch(`/api/notes/${id}`, { content })
        const responseData = res.data?.data || res.data
        const updatedNote = transformBackendNote(responseData?.note || responseData)
        set((state) => ({
          notes: state.notes.map((note) => (note._id === id ? updatedNote : note)),
        }))
      } catch (err: any) {
        set({
          notes: originalNotes,
          error: err?.response?.data?.error ?? err?.message ?? 'Failed to update note',
        })
        throw err
      }
    },

    deleteNote: async (id) => {
      const originalNotes = get().notes
      const noteToDelete = originalNotes.find((n) => n._id === id)

      if (!noteToDelete) {
        set({ error: 'Note not found' })
        return
      }

      set((state) => ({
        notes: state.notes.filter((note) => note._id !== id),
        error: null,
      }))

      try {
        await axiosInstance.delete(`/api/notes/${id}`)
      } catch (err: any) {
        set({
          notes: originalNotes,
          error: err?.response?.data?.error ?? err?.message ?? 'Failed to delete note',
        })
        throw err
      }
    },

    startEditing: (n) => set({ editing: n }),
  })),
)
