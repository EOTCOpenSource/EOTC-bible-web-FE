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
            const parts = viewingNote.content.split('\n\n')
            // If we have parts, the content is the rest, otherwise it's the whole content if title logic differs, 
            // but usually the store/list logic handles title separation. 
            // Let's rely on what the list does or just display viewingNote.content as is if it contains the title too?
            // In NoteEditor: 
            // const parts = editingNote.content.split('\n\n')
            // setTitle(editingNote.title || parts[0])
            // innerHTML = parts.slice(1).join('\n\n')

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
                <h2 className="text-[20px] bg-[ #000000B2] font-poppins font-weight-400 h-[29px]">
                    View Note
                </h2>
                <div className="flex items-center gap-3 ml-auto">
                    <button
                        onClick={handleEdit}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit note"
                    >
                        <SquarePen size={20} />
                    </button>
                    <button
                        onClick={() => setViewingNote(null)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Close view"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="rounded-[20px] border border-[#C9C9C9] bg-[#FFFAFA] p-4 xs:p-6 sm:p-8 shadow-sm md:min-h-[334px] flex flex-col gap-3 sm:gap-4 md:gap-[17px]">
                <div className="flex flex-row justify-between items-center w-full gap-2 border-b border-gray-100 pb-4">
                    <h1 className="text-base sm:text-lg md:text-[24px] font-medium font-weight-400 font-poppins text-gray-900 flex-1 min-w-0">
                        {viewingNote.title || 'Untitled'}
                    </h1>
                    <span className="text-xs sm:text-sm md:text-[14px] text-gray-400 whitespace-nowrap flex-shrink-0">
                        {format(new Date(viewingNote.createdAt), 'dd-MM-yyyy')}
                    </span>
                </div>

                <div
                    ref={contentRef}
                    className="w-full flex-1 min-h-[150px] resize-none text-[20px] font-poppins font-weight-400 text-gray-800 overflow-y-auto"
                />

                <div className="flex justify-end mt-auto pt-4">
                    {viewingNote.visibility === 'public' ? (
                        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                            <Globe size={14} />
                            <span>Public Note</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            <Lock size={14} />
                            <span>Private Note</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
