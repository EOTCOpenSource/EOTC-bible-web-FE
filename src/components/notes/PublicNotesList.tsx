'use client'

import { useEffect, useState } from 'react'
import { useNotesStore } from '@/stores/useNotesStore'
import { Globe, ArrowLeft, ArrowRight } from 'lucide-react'
import { PublicNoteCard } from './PublicNoteCard'
import { useRouter } from 'next/navigation'
import { NoteCardSkeleton } from '../skeletons/NoteCardSkeleton'

export const PublicNotesList = () => {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const { publicNotes, publicNotesPagination, fetchPublicNotes, isLoading } = useNotesStore()

  useEffect(() => {
    fetchPublicNotes({ page, limit: 10 })
  }, [fetchPublicNotes, page])

  const handleNoteClick = (noteId: string) => {
    // Navigate to a detail view or expand
    // For now, assume a detail page route exists or just do nothing/log
    router.push(`/dashboard/notes/public/${noteId}`)
  }

  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1)
  }

  const handleNextPage = () => {
    if (publicNotesPagination && publicNotesPagination.hasNextPage) {
      setPage((p) => p + 1)
    }
  }

  return (
    <div className="mb-6 min-h-[600px] w-full rounded-xl border border-gray-200 bg-[#FFFAFA] p-3 shadow-sm transition-all duration-300 sm:p-4 md:p-6 dark:border-neutral-800 dark:bg-[#1A1A1A]">
      <div className="mb-4 flex flex-col items-center justify-between gap-2 min-[375px]:flex-row sm:mb-6">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-[#1C4E80] sm:h-6 sm:w-6 dark:text-blue-400" />
          <h2 className="font-inter text-xl font-medium text-[#1C4E80] sm:text-2xl dark:text-blue-400">
            Public Notes
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 md:gap-[16px]">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <NoteCardSkeleton key={i} />)
        ) : publicNotes.length > 0 ? (
          publicNotes.map((note, index) => (
            <PublicNoteCard
              key={note.id || note._id || index}
              note={note}
              onClick={() => handleNoteClick(note.id || note._id || '')}
            />
          ))
        ) : (
          <p className="py-10 text-center text-gray-500 dark:text-gray-400">
            No public notes found.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {publicNotesPagination && publicNotesPagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4 border-t border-gray-100 pt-4 dark:border-neutral-800">
          <button
            onClick={handlePrevPage}
            disabled={page === 1 || isLoading}
            className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {publicNotesPagination.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!publicNotesPagination.hasNextPage || isLoading}
            className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-800"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
