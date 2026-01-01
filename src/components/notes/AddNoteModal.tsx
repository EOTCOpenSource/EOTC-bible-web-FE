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
  const { addNote, isLoading } = useNotesStore()

  const handleSave = async () => {
    if (!content || !verseContext?.book || !verseContext?.chapter || !verseContext?.verse) return
    await addNote({
      bookId: verseContext.book,
      chapter: verseContext.chapter,
      verseStart: verseContext.verse,
      verseCount: 1, // Defaulting to 1 as it's often a single verse note
      content,
      visibility: "private",
    })
    setContent('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {verseContext && (
            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 border border-gray-100">
              <p className="font-semibold mb-1">{verseContext.book} {verseContext.chapter}:{verseContext.verse}</p>
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
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-900/20 resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !content || !verseContext?.book || !verseContext?.chapter || !verseContext?.verse} className="bg-red-900 hover:bg-red-800">
            {isLoading ? 'Saving...' : 'Save Note'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
