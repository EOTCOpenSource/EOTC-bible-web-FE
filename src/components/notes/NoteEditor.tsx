'use client'

import { useState, useEffect, useRef } from 'react'
import { useNotesStore } from '@/stores/useNotesStore'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Trash2, X } from 'lucide-react'
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
  const { editingNote, setEditingNote, updateNote, addNote, deleteNote, isLoading } = useNotesStore()
  const [title, setTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
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
      if (editorRef.current) editorRef.current.innerHTML = ''
    }
  }, [editingNote])

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) editorRef.current.focus()
  }

  const handleSave = async () => {
    const content = editorRef.current?.innerHTML || ''
    if (!title || !content || content === '<br>' || !content.trim()) return

    setIsSaving(true)
    try {
      if (editingNote) {
        await updateNote(editingNote.id || editingNote._id!, {
          title: title.trim(),
          content: content.trim(),
          visibility: isPublic ? 'public' : 'private'
        })
        setEditingNote(null)
      } else {
        const timestamp = Date.now()
        const randomVerse = Math.floor(Math.random() * 1000) + 1

        await (addNote as any)({
          title: title.trim(),
          content: content.trim(),
          bookId: 'GEN',
          chapter: Math.floor(timestamp / 1000000) || 1,
          verseStart: randomVerse,
          verseCount: 1,
          visibility: isPublic ? 'public' : 'private'
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
      <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-full md:max-w-[813px]">
        <div className="flex items-center justify-between">
          {!editingNote && (
            <h2 className="text-[20px] bg-[ #000000B2] font-poppins font-weight-400 h-[29px]">
              Write new note
            </h2>
          )}
          {editingNote && (
            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting || isSaving}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                title="Delete note"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={() => setEditingNote(null)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Cancel edit"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>
        <div className="rounded-[20px] border border-[#C9C9C9] bg-[#FFFAFA] p-4 xs:p-6 sm:p-8 shadow-sm md:min-h-[334px] flex flex-col gap-3 sm:gap-4 md:gap-[17px]">
          <div className="flex flex-row justify-between items-center w-full gap-2">
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base sm:text-lg md:text-[24px] font-medium font-weight-400 font-poppins placeholder-gray-300 focus:outline-none bg-transparent text-gray-900 flex-1 min-w-0"
            />
            <span className="text-xs sm:text-sm md:text-[14px] text-gray-400 whitespace-nowrap flex-shrink-0">{format(new Date(), 'dd-MM-yyyy')}</span>
          </div>

          <div
            ref={editorRef}
            contentEditable
            className="w-full flex-1 min-h-[150px] resize-none text-[20px] bg-[ #000000B2] font-poppins font-weight-400 focus:outline-none bg-transparent overflow-y-auto"
            onInput={(e) => {
              if (e.currentTarget.innerHTML === '') {
                e.currentTarget.innerHTML = ''
              }
            }}
            data-placeholder="write new note"
          />

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end sm:justify-between mt-auto pt-4 gap-3 sm:gap-3 md:gap-4 w-full min-w-0">
            <div
              className="flex items-center gap-1.5 sm:gap-3 md:gap-4 lg:gap-6 text-gray-500 bg-white/50 px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full border border-gray-100 overflow-x-auto flex-shrink sm:flex-shrink-0 min-w-0 max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleFormat('justifyLeft')
                }}
                className="hover:text-black transition-colors flex-shrink-0 p-1 sm:p-0.5"
                title="Align Left"
              ><AlignLeft size={16} className="sm:size-[18px] md:size-5" /></button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleFormat('justifyCenter')
                }}
                className="hover:text-black transition-colors flex-shrink-0 p-1 sm:p-0.5"
                title="Align Center"
              ><AlignCenter size={16} className="sm:size-[18px] md:size-5" /></button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleFormat('justifyRight')
                }}
                className="hover:text-black transition-colors flex-shrink-0 p-1 sm:p-0.5"
                title="Align Right"
              ><AlignRight size={16} className="sm:size-[18px] md:size-5" /></button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleFormat('bold')
                }}
                className="hover:text-black transition-colors font-bold flex-shrink-0 p-1 sm:p-0.5"
                title="Bold"
              ><Bold size={16} className="sm:size-[18px] md:size-5" /></button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleFormat('italic')
                }}
                className="hover:text-black transition-colors italic flex-shrink-0 p-1 sm:p-0.5"
                title="Italic"
              ><Italic size={16} className="sm:size-[18px] md:size-5" /></button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleFormat('underline')
                }}
                className="hover:text-black transition-colors underline flex-shrink-0 p-1 sm:p-0.5"
                title="Underline"
              ><Underline size={16} className="sm:size-[18px] md:size-5" /></button>
              <button
                className="hover:text-black transition-colors flex-shrink-0 p-1 sm:p-0.5"
                title="Text Style"
              ><Type size={16} className="sm:size-[18px] md:size-5" /></button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 md:gap-3 lg:gap-4 w-full sm:w-auto sm:max-w-full min-w-0 flex-shrink">
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Checkbox
                  id="public-note-editor"
                  checked={isPublic}
                  onCheckedChange={(checked) => setIsPublic(checked as boolean)}
                />
                <label htmlFor="public-note-editor" className="text-xs sm:text-sm text-gray-700 select-none cursor-pointer whitespace-nowrap">
                  Public
                </label>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving || isDeleting || !title}
                className="flex items-center justify-center rounded-[8px] bg-[#000000] py-2 sm:py-[12px] px-3 sm:px-4 md:px-5 lg:px-[48px] text-xs sm:text-[14px] font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors w-full sm:w-auto sm:flex-none sm:min-w-[90px] md:min-w-[110px] lg:w-[158px] h-[32px] sm:h-[34px] tracking-tight flex-shrink-0"
              >
                {isSaving ? 'Saving...' : <span className="whitespace-nowrap">Save<span className="ml-0.5">Note</span></span>}
              </button>
            </div>
          </div>
        </div>
        <style jsx>{`
          [contentEditable]:empty:before {
            content: attr(data-placeholder);
            color: #9CA3AF;
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
