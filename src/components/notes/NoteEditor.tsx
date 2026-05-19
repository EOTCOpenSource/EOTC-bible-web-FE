'use client'

import { useState, useEffect, useRef } from 'react'
import { useNotesStore } from '@/stores/useNotesStore'
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Trash2,
  X,
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export const NoteEditor = () => {
  const { editingNote, setEditingNote, updateNote, addNote, deleteNote } = useNotesStore()
  const [title, setTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [titleError, setTitleError] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editingNote) {
      const parts = editingNote.content.split('\n\n')
      if (parts.length > 1) {
        setTitle(editingNote.title || parts[0])
        if (editorRef.current) editorRef.current.innerHTML = parts.slice(1).join('\n\n')
      } else {
        setTitle(editingNote.title || '')
        if (editorRef.current) editorRef.current.innerHTML = editingNote.content
      }
      setIsPublic(editingNote.visibility === 'public')
    } else {
      setTitle('')
      setIsPublic(false)
      setTitleError(false)
      if (editorRef.current) editorRef.current.innerHTML = ''
    }
  }, [editingNote])

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) editorRef.current.focus()
  }

  const handleSave = async () => {
    const content = editorRef.current?.innerHTML || ''

    if (!title.trim()) {
      setTitleError(true)
      toast.error('Please enter a title for your note')
      return
    }
    setTitleError(false)

    if (!content || content === '<br>' || !content.trim()) {
      toast.error('Please enter some content for your note')
      return
    }

    setIsSaving(true)
    try {
      if (editingNote) {
        await updateNote(editingNote.id || editingNote._id!, {
          title: title.trim(),
          content: content.trim(),
          visibility: isPublic ? 'public' : 'private',
        })
        setEditingNote(null)
      } else {
        await (addNote as any)({
          title: title.trim(),
          content: content.trim(),
          bookId: '_dashboard',
          chapter: 1,
          verseStart: 1,
          verseCount: 1,
          visibility: isPublic ? 'public' : 'private',
        })
        toast.success('Note created successfully')
      }

      setTitle('')
      setIsPublic(false)
      if (editorRef.current) editorRef.current.innerHTML = ''
    } catch (err) {
      console.error('Failed to save note:', err)
      toast.error('Failed to save note')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!editingNote) return

    setIsDeleting(true)
    try {
      const noteId = editingNote.id || editingNote._id!
      await deleteNote(noteId)
      setEditingNote(null)
      setTitle('')
      setIsPublic(false)
      if (editorRef.current) editorRef.current.innerHTML = ''
      toast.success('Note deleted successfully')
    } catch (err) {
      console.error('Failed to delete note:', err)
      toast.error('Failed to delete note')
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <div className="flex w-full max-w-full flex-col gap-3 sm:gap-4 md:max-w-[813px]">
        <div className="flex items-center justify-between">
          {!editingNote && (
            <h2 className="bg-[ #000000B2] font-poppins font-weight-400 h-[29px] text-[20px] text-black dark:text-white">
              Write new note
            </h2>
          )}
          {editingNote && (
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting || isSaving}
                className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                title="Delete note"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={() => setEditingNote(null)}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                title="Cancel edit"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>
        <div className="xs:p-6 flex flex-col gap-3 rounded-[20px] border border-[#C9C9C9] bg-[#FFFAFA] p-4 shadow-sm sm:gap-4 sm:p-8 md:min-h-[334px] md:gap-[17px] dark:border-neutral-700 dark:bg-[#1A1A1A]">
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (titleError && e.target.value.trim() !== '') {
                  setTitleError(false)
                }
              }}
              className={`font-weight-400 font-poppins min-w-0 flex-1 bg-transparent text-base font-medium placeholder-gray-300 focus:outline-none sm:text-lg md:text-[24px] dark:placeholder-gray-600 ${
                titleError
                  ? 'rounded-none border-b-2 border-red-500 text-red-500 placeholder-red-300 dark:text-red-400 dark:placeholder-red-700/50'
                  : 'text-gray-900 dark:text-white'
              }`}
            />
            <span className="flex-shrink-0 text-xs whitespace-nowrap text-gray-400 sm:text-sm md:text-[14px] dark:text-gray-500">
              {format(new Date(), 'dd-MM-yyyy')}
            </span>
          </div>

          <div
            ref={editorRef}
            contentEditable
            className="bg-[ #000000B2] font-poppins font-weight-400 min-h-[150px] w-full flex-1 resize-none overflow-y-auto bg-transparent text-[20px] text-black focus:outline-none dark:text-gray-200"
            onInput={(e) => {
              if (e.currentTarget.innerHTML === '') {
                e.currentTarget.innerHTML = ''
              }
            }}
            data-placeholder="write new note"
          />

          <div className="mt-auto flex w-full min-w-0 flex-col items-stretch gap-3 pt-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-3 md:gap-4">
            <div className="flex max-w-full min-w-0 flex-shrink items-center gap-1.5 overflow-x-auto rounded-full border border-gray-100 bg-white/50 px-2 py-1.5 text-gray-500 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-shrink-0 sm:gap-3 sm:px-4 sm:py-2 md:gap-4 md:px-6 lg:gap-6 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-gray-400 [&::-webkit-scrollbar]:hidden">
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleFormat('justifyLeft')
                }}
                className="flex-shrink-0 p-1 transition-colors hover:text-black sm:p-0.5"
                title="Align Left"
              >
                <AlignLeft size={16} className="sm:size-[18px] md:size-5" />
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleFormat('justifyCenter')
                }}
                className="flex-shrink-0 p-1 transition-colors hover:text-black sm:p-0.5"
                title="Align Center"
              >
                <AlignCenter size={16} className="sm:size-[18px] md:size-5" />
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleFormat('justifyRight')
                }}
                className="flex-shrink-0 p-1 transition-colors hover:text-black sm:p-0.5"
                title="Align Right"
              >
                <AlignRight size={16} className="sm:size-[18px] md:size-5" />
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleFormat('bold')
                }}
                className="flex-shrink-0 p-1 font-bold transition-colors hover:text-black sm:p-0.5"
                title="Bold"
              >
                <Bold size={16} className="sm:size-[18px] md:size-5" />
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleFormat('italic')
                }}
                className="flex-shrink-0 p-1 italic transition-colors hover:text-black sm:p-0.5"
                title="Italic"
              >
                <Italic size={16} className="sm:size-[18px] md:size-5" />
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleFormat('underline')
                }}
                className="flex-shrink-0 p-1 underline transition-colors hover:text-black sm:p-0.5"
                title="Underline"
              >
                <Underline size={16} className="sm:size-[18px] md:size-5" />
              </button>
              <button
                className="flex-shrink-0 p-1 transition-colors hover:text-black sm:p-0.5"
                title="Text Style"
              >
                <Type size={16} className="sm:size-[18px] md:size-5" />
              </button>
            </div>

            <div className="flex w-full min-w-0 flex-shrink flex-col items-stretch gap-2 sm:w-auto sm:max-w-full sm:flex-row sm:items-center sm:gap-2 md:gap-3 lg:gap-4">
              <div className="flex flex-shrink-0 items-center space-x-2">
                <Checkbox
                  id="public-note-editor"
                  checked={isPublic}
                  onCheckedChange={(checked) => setIsPublic(checked as boolean)}
                />
                <label
                  htmlFor="public-note-editor"
                  className="cursor-pointer text-xs whitespace-nowrap text-gray-700 select-none sm:text-sm dark:text-gray-300"
                >
                  Public
                </label>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving || isDeleting}
                className="flex h-[32px] w-full flex-shrink-0 items-center justify-center rounded-[8px] border bg-[#000000] px-3 py-2 text-xs font-medium tracking-tight text-white transition-colors hover:bg-gray-800 disabled:opacity-50 sm:h-[34px] sm:w-auto sm:min-w-[90px] sm:flex-none sm:px-4 sm:py-[12px] sm:text-[14px] md:min-w-[110px] md:px-5 lg:w-[158px] lg:px-[48px] dark:border-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                {isSaving ? (
                  'Saving...'
                ) : (
                  <span className="whitespace-nowrap">
                    Save<span className="ml-0.5">Note</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        <style jsx>{`
          [contentEditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            cursor: text;
          }
        `}</style>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
