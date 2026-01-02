'use client'

import { format } from 'date-fns'
import { FileText, Globe } from 'lucide-react'
import type { Note } from '@/stores/useNotesStore'

interface PublicNoteCardProps {
    note: Note
    onClick?: () => void
}

export function PublicNoteCard({ note, onClick }: PublicNoteCardProps) {
    // Extract title if not present (logic reused from MyNotesList)
    const noteTitle = note.title || (() => {
        const parts = (note.content || '').split('\n\n')
        if (parts.length > 1) return parts[0]
        const firstLine = (note.content || '').split('\n')[0]?.trim()
        return firstLine || 'Untitled'
    })()

    return (
        <div
            onClick={onClick}
            className="group flex flex-col min-[375px]:flex-row items-start min-[375px]:items-center justify-between rounded-[12px] sm:rounded-[16px] md:rounded-[20px] border border-[#C9C9C9] bg-[#FFFBFB] p-3 sm:p-4 md:p-6 hover:bg-gray-50 transition-colors w-full min-h-[80px] sm:min-h-[91px] gap-3 min-[375px]:gap-0 cursor-pointer"
        >
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-1 min-w-0">
                <div className="flex h-[35px] w-[30px] sm:h-[40px] sm:w-[35px] md:h-[45px] md:w-[40px] items-center justify-center rounded-lg bg-[#1C4E80] text-white shadow-sm flex-shrink-0">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                    <h3 className="text-sm sm:text-base md:text-[20px] font-medium text-gray-900 truncate">{noteTitle}</h3>
                    {note.bookId && note.chapter && note.verseStart && (
                        <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">
                            {note.bookId} {note.chapter}:{note.verseStart}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-row min-[375px]:flex-col items-center min-[375px]:items-end gap-2 min-[375px]:gap-1 flex-shrink-0">
                <p className="text-xs sm:text-sm md:text-[14px] font-inter font-weight-400 uppercase tracking-wider font-medium whitespace-nowrap text-gray-500">
                    {note.createdAt ? format(new Date(note.createdAt), 'dd-MM-yyyy') : '-'}
                </p>
            </div>
        </div>
    )
}
