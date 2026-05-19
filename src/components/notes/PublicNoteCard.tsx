'use client'

import { format } from 'date-fns'
import { Globe } from 'lucide-react'
import type { Note } from '@/stores/useNotesStore'

interface PublicNoteCardProps {
  note: Note
  onClick?: () => void
}

export function PublicNoteCard({ note, onClick }: PublicNoteCardProps) {
  // Extract title if not present (logic reused from MyNotesList)
  const noteTitle =
    note.title ||
    (() => {
      const parts = (note.content || '').split('\n\n')
      if (parts.length > 1) return parts[0]
      const firstLine = (note.content || '').split('\n')[0]?.trim()
      return firstLine || 'Untitled'
    })()

  return (
    <div
      onClick={onClick}
      className="group flex min-h-[80px] w-full cursor-pointer flex-col items-start justify-between gap-3 rounded-[12px] border border-[#C9C9C9] bg-[#FFFBFB] p-3 transition-colors hover:bg-gray-50 min-[375px]:flex-row min-[375px]:items-center min-[375px]:gap-0 sm:min-h-[91px] sm:rounded-[16px] sm:p-4 md:rounded-[20px] md:p-6 dark:border-neutral-700 dark:bg-[#2A2A2A] dark:hover:bg-neutral-800"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4 md:gap-6">
        <div className="flex h-[35px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-[#1C4E80] text-white shadow-sm sm:h-[40px] sm:w-[35px] md:h-[45px] md:w-[40px]">
          <Globe className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </div>
        <div className="flex min-w-0 flex-col">
          <h3 className="truncate text-sm font-medium text-gray-900 sm:text-base md:text-[20px] dark:text-white">
            {noteTitle}
          </h3>
          {note.bookId && note.chapter && note.verseStart && (
            <p className="mt-1 truncate text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              {note.bookId} {note.chapter}:{note.verseStart}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-shrink-0 flex-row items-center gap-2 min-[375px]:flex-col min-[375px]:items-end min-[375px]:gap-1">
        <p className="font-inter font-weight-400 text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:text-sm md:text-[14px] dark:text-gray-400">
          {note.createdAt ? format(new Date(note.createdAt), 'dd-MM-yyyy') : '-'}
        </p>
        {note.userId?.name && (
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
            By {note.userId.name}
          </p>
        )}
      </div>
    </div>
  )
}
