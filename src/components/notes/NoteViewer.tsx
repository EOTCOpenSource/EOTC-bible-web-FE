'use client'

import { useEffect, useRef } from 'react'
import { useNotesStore } from '@/stores/useNotesStore'
import { X, SquarePen, Globe, Lock } from 'lucide-react'
import { format } from 'date-fns'

export const NoteViewer = () => {
  const { viewingNote, setViewingNote, setEditingNote } = useNotesStore()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (viewingNote && contentRef.current) {
      // We should mirror this display logic.

      let contentToDisplay = viewingNote.content
      // If title is inferred from first line, we might want to strip it from content display if we show title separately.
      // But viewingNote from store might already have title separate if it went through the transform?
      // The store transform:
      // return { ...note, title: parts[0], content: parts.slice(1).join('\n\n') }

      // So viewingNote.content should be just the body if it was transformed.
      contentToDisplay = viewingNote.content

      contentRef.current.innerHTML = contentToDisplay
    }
  }, [viewingNote])

  if (!viewingNote) return null

  const handleEdit = () => {
    setEditingNote(viewingNote)
    setViewingNote(null)
  }

  return (
    <div className="flex w-full max-w-full flex-col gap-3 sm:gap-4 md:max-w-[813px]">
      <div className="flex items-center justify-between">
        <h2 className="bg-[ #000000B2] font-poppins font-weight-400 h-[29px] text-[20px] text-black dark:text-white">
          View Note
        </h2>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={handleEdit}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            title="Edit note"
          >
            <SquarePen size={20} />
          </button>
          <button
            onClick={() => setViewingNote(null)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            title="Close view"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="xs:p-6 flex flex-col gap-3 rounded-[20px] border border-[#C9C9C9] bg-[#FFFAFA] p-4 shadow-sm sm:gap-4 sm:p-8 md:min-h-[334px] md:gap-[17px] dark:border-neutral-700 dark:bg-[#1A1A1A]">
        <div className="flex w-full flex-row items-center justify-between gap-2 border-b border-gray-100 pb-4 dark:border-neutral-700">
          <h1 className="font-weight-400 font-poppins min-w-0 flex-1 text-base font-medium text-gray-900 sm:text-lg md:text-[24px] dark:text-white">
            {viewingNote.title || 'Untitled'}
          </h1>
          <span className="flex-shrink-0 text-xs whitespace-nowrap text-gray-400 sm:text-sm md:text-[14px] dark:text-gray-500">
            {format(new Date(viewingNote.createdAt), 'dd-MM-yyyy')}
          </span>
        </div>

        <div
          ref={contentRef}
          className="font-poppins font-weight-400 min-h-[150px] w-full flex-1 resize-none overflow-y-auto text-[20px] text-gray-800 dark:text-gray-200"
        />

        <div className="mt-auto flex justify-end pt-4">
          {viewingNote.visibility === 'public' ? (
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <Globe size={14} />
              <span>Public Note</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500 dark:bg-neutral-800 dark:text-gray-400">
              <Lock size={14} />
              <span>Private Note</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
