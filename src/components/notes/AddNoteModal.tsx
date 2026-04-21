'use client'

import { useState, useEffect, useRef } from 'react'
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
import { BookOpen } from 'lucide-react'

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
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const { addNote, fetchNotes, isLoading } = useNotesStore()
  const hasInitializedTitle = useRef(false)

  // Pre-fill title with verse reference ONLY when the modal first opens
  useEffect(() => {
    if (isOpen && verseContext && !hasInitializedTitle.current) {
      setTitle(`${verseContext.book} ${verseContext.chapter}:${verseContext.verse} - Notes`)
      hasInitializedTitle.current = true
    }
  }, [isOpen, verseContext])

  // Reset everything when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('')
      setContent('')
      setIsPublic(false)
      hasInitializedTitle.current = false
    }
  }, [isOpen])

  const sourceLabel = verseContext
    ? `${verseContext.book} ${verseContext.chapter}:${verseContext.verse}`
    : null

  const handleSave = async () => {
    if (!content || !verseContext?.book || !verseContext?.chapter || !verseContext?.verse) {
      toast.error('Please enter note content')
      return
    }

    if (!title.trim()) {
      toast.error('Please enter a title for your note')
      return
    }

    try {
      await (addNote as any)({
        bookId: verseContext.book,
        chapter: verseContext.chapter,
        verseStart: verseContext.verse,
        verseCount: 1,
        title: title.trim(),
        content,
        visibility: isPublic ? 'public' : 'private',
      })

      // Refresh notes list to show the new note in dashboard
      await fetchNotes()

      toast.success('Note saved successfully')
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
          {/* Source tag — non-editable, shows where the note came from */}
          {sourceLabel && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
              <BookOpen size={12} />
              <span>{sourceLabel}</span>
            </div>
          )}

          {/* Editable title input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your note..."
              className="w-full rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#4C0E0F]/20 dark:focus:ring-amber-500/20 focus:outline-none"
            />
          </div>

          {/* Quoted verse text for context */}
          {verseContext && (
            <div className="rounded-lg border border-gray-100 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 p-3 text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
                {verseContext.book} {verseContext.chapter}:{verseContext.verse}
              </p>
              <p className="italic">&quot;{verseContext.text}&quot;</p>
            </div>
          )}

          {/* Note content */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={5}
              className="w-full resize-none rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#4C0E0F]/20 dark:focus:ring-amber-500/20 focus:outline-none"
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
              className="cursor-pointer text-sm text-gray-700 dark:text-gray-300 select-none"
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
              !title.trim() ||
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
