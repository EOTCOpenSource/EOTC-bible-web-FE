'use client'

import { useState } from 'react'
import { useNotesStore } from '@/stores/useNotesStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

interface AddNoteModalProps {
  isOpen: boolean
  onClose: () => void
  verseContext?: {
    book: string
    chapter: number
    verse: number
    text: string
  }
}

export const AddNoteModal = ({ isOpen, onClose, verseContext }: AddNoteModalProps) => {
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const { addNote, fetchNotes, isLoading } = useNotesStore()

  const handleSave = async () => {
    if (!content || !verseContext?.book || !verseContext?.chapter || !verseContext?.verse) {
      toast.error('Please enter note content')
      return
    }

    try {
      // Create a title from verse reference
      const noteTitle = `${verseContext.book} ${verseContext.chapter}:${verseContext.verse}`

      await (addNote as any)({
        bookId: verseContext.book,
        chapter: verseContext.chapter,
        verseStart: verseContext.verse,
        verseCount: 1,
        title: noteTitle,
        content,
        visibility: isPublic ? 'public' : 'private',
      })

      // Refresh notes list to show the new note in dashboard
      await fetchNotes()

      toast.success('Note saved successfully')
      setContent('')
      setIsPublic(false) // Reset back to private default
      onClose()
    } catch (error: any) {
      console.error('Failed to save note:', error)
      toast.error(error?.message || 'Failed to save note')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {verseContext && (
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-600">
              <p className="mb-1 font-semibold">
                {verseContext.book} {verseContext.chapter}:{verseContext.verse}
              </p>
              <p className="italic">"{verseContext.text}"</p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={5}
              className="w-full resize-none rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#4C0E0F]/20 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="public-note"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked as boolean)}
            />
            <label
              htmlFor="public-note"
              className="cursor-pointer text-sm text-gray-700 select-none"
            >
              Make this note public
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isLoading ||
              !content ||
              !verseContext?.book ||
              !verseContext?.chapter ||
              !verseContext?.verse
            }
            className="bg-[#4C0E0F] hover:bg-red-800"
          >
            {isLoading ? 'Saving...' : 'Save Note'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
