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
        <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-full md:max-w-[813px]">
            <div className="flex items-center justify-between">
                <h2 className="text-[20px] bg-[ #000000B2] font-poppins font-weight-400 h-[29px] text-black dark:text-white">
                    View Note
                </h2>
                <div className="flex items-center gap-3 ml-auto">
                    <button
                        onClick={handleEdit}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        title="Edit note"
                    >
                        <SquarePen size={20} />
                    </button>
                    <button
                        onClick={() => setViewingNote(null)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        title="Close view"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="rounded-[20px] border border-[#C9C9C9] dark:border-neutral-700 bg-[#FFFAFA] dark:bg-[#1A1A1A] p-4 xs:p-6 sm:p-8 shadow-sm md:min-h-[334px] flex flex-col gap-3 sm:gap-4 md:gap-[17px]">
                <div className="flex flex-row justify-between items-center w-full gap-2 border-b border-gray-100 dark:border-neutral-700 pb-4">
                    <h1 className="text-base sm:text-lg md:text-[24px] font-medium font-weight-400 font-poppins text-gray-900 dark:text-white flex-1 min-w-0">
                        {viewingNote.title || 'Untitled'}
                    </h1>
                    <span className="text-xs sm:text-sm md:text-[14px] text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0">
                        {format(new Date(viewingNote.createdAt), 'dd-MM-yyyy')}
                    </span>
                </div>

                <div
                    ref={contentRef}
                    className="w-full flex-1 min-h-[150px] resize-none text-[20px] font-poppins font-weight-400 text-gray-800 dark:text-gray-200 overflow-y-auto"
                />

                <div className="flex justify-end mt-auto pt-4">
                    {viewingNote.visibility === 'public' ? (
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full text-sm">
                            <Globe size={14} />
                            <span>Public Note</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full text-sm">
                            <Lock size={14} />
                            <span>Private Note</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
