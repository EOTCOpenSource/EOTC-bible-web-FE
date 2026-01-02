'use client'

import { useEffect, useState } from 'react'
import { useNotesStore } from '@/stores/useNotesStore'
import { Globe, ArrowLeft, ArrowRight } from 'lucide-react'
import { PublicNoteCard } from './PublicNoteCard'
import { useRouter } from 'next/navigation'

export const PublicNotesList = () => {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const {
        publicNotes,
        publicNotesPagination,
        fetchPublicNotes,
        isLoading
    } = useNotesStore()

    useEffect(() => {
        fetchPublicNotes({ page, limit: 10 })
    }, [fetchPublicNotes, page])

    const handleNoteClick = (noteId: string) => {
        // Navigate to a detail view or expand
        // For now, assume a detail page route exists or just do nothing/log
        router.push(`/dashboard/notes/public/${noteId}`)
    }

    const handlePrevPage = () => {
        if (page > 1) setPage(p => p - 1)
    }

    const handleNextPage = () => {
        if (publicNotesPagination && publicNotesPagination.hasNextPage) {
            setPage(p => p + 1)
        }
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-[#FFFAFA] p-3 sm:p-4 md:p-6 shadow-sm transition-all duration-300 w-full mb-6 min-h-[600px]">
            <div className="flex flex-col min-[375px]:flex-row items-center justify-between mb-4 sm:mb-6 gap-2">
                <div className="flex items-center gap-2">
                    <Globe className="text-[#1C4E80] w-5 h-5 sm:w-6 sm:h-6" />
                    <h2 className="text-xl sm:text-2xl font-medium font-inter text-[#1C4E80]">Public Notes</h2>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 md:gap-[16px]">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : publicNotes.length > 0 ? (
                    publicNotes.map((note, index) => (
                        <PublicNoteCard
                            key={note.id || note._id || index}
                            note={note}
                            onClick={() => handleNoteClick(note.id || note._id || '')}
                        />
                    ))
                ) : (
                    <p className="text-center py-10 text-gray-500">No public notes found.</p>
                )}
            </div>

            {/* Pagination Controls */}
            {publicNotesPagination && (publicNotesPagination.totalPages > 1) && (
                <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-100">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1 || isLoading}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="w-4 h-4" /> Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {publicNotesPagination.totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={!publicNotesPagination.hasNextPage || isLoading}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
