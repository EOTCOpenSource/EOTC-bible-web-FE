'use client'

import { useEffect } from 'react'
import { useNotesStore } from '@/stores/useNotesStore'
import { FileText, Edit2, ArrowUpRight, Globe, Lock } from 'lucide-react'
import { format } from 'date-fns'
import { NoteCardSkeleton } from '../skeletons/NoteCardSkeleton'

export function MyNotesList({ isExpanded, onToggleExpandAction }: { isExpanded?: boolean; onToggleExpandAction?: () => void }) {
  const notes = useNotesStore((state) => state.notes)
  const fetchNotes = useNotesStore((state) => state.fetchNotes)
  const isLoading = useNotesStore((state) => state.isLoading)
  const setEditingNote = useNotesStore((state) => state.setEditingNote)

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const displayNotes = Array.isArray(notes) ? notes : []

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-[#FFFAFA] xs:mb-3 sm:mb-4 md:mb-6 p-3 sm:p-4 md:p-6 shadow-sm transition-all duration-300 w-full mb-2${isExpanded ? 'h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] mb-2' : ''
        }`}
    >
      <div className="flex flex-col min-[375px]:flex-row items-start min-[375px]:items-center justify-between mb-2 sm:mb-3 md:mb-4 lg:mb-6 gap-2 min-[375px]:gap-0">
        <div className="flex items-center gap-2">
          <FileText className="text-red-900 w-4 h-4 sm:w-5 sm:h-5" />
          <h2 className="text-lg sm:text-xl md:text-[24px] font-medium font-inter font-weight-500 leading-none text-[#621B1C]">My Notes</h2>
        </div>
        {!isExpanded && (
          <button
            onClick={onToggleExpandAction}
            className="flex items-center gap-1 text-xs sm:text-sm font-medium font-weight-400 font-poppins text-gray-500 hover:text-gray-900 transition-colors"
          >
            See all <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}
        {isExpanded && (
          <button
            onClick={onToggleExpandAction}
            className="text-xs sm:text-sm font-medium text-red-900 hover:text-red-800 transition-colors"
          >
            Back to Editor
          </button>
        )}
      </div>

      <div className={`flex flex-col gap-3 sm:gap-4 md:gap-[16px] overflow-y-auto ${isExpanded ? 'max-h-full' : ''}`}>
        {isLoading ? (
          Array.from({ length: isExpanded ? 5 : 3 }).map((_, i) => (
            <NoteCardSkeleton key={`skeleton-${i}`} />
          ))
        ) : (
          <>
            {(isExpanded ? displayNotes : displayNotes.slice(0, 3)).map((note, index) => {
              // Extract title if not present
              const noteTitle = note.title || (() => {
                const parts = (note.content || '').split('\n\n')
                if (parts.length > 1) return parts[0]
                const firstLine = (note.content || '').split('\n')[0]?.trim()
                return firstLine || 'Untitled'
              })()

              const handleNoteClick = () => {
                setEditingNote(note)
                if (onToggleExpandAction && isExpanded) {
                  onToggleExpandAction()
                }
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }

              return (
                <div
                  key={note.id || note._id || `note-${index}`}
                  onClick={handleNoteClick}
                  className="group flex flex-col min-[375px]:flex-row items-start min-[375px]:items-center justify-between rounded-[12px] sm:rounded-[16px] md:rounded-[20px] border border-[#C9C9C9] bg-[#FFFBFB] p-3 sm:p-4 md:p-6 hover:bg-gray-50 transition-colors w-full min-h-[80px] sm:min-h-[91px] gap-3 min-[375px]:gap-0 cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-1 min-w-0">
                    <div className="flex h-[35px] w-[30px] sm:h-[40px] sm:w-[35px] md:h-[45px] md:w-[40px] items-center justify-center rounded-lg bg-[#7C2D2D] text-white shadow-sm flex-shrink-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-sm sm:text-base md:text-[20px] font-medium text-gray-900 truncate flex-1">{noteTitle}</h3>
                  </div>

                  <div className="flex flex-row min-[375px]:flex-col items-center min-[375px]:items-end gap-2 min-[375px]:gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      {note.visibility === 'public' ? (
                        <div title="Public Note" className="bg-blue-100 p-0.5 rounded-full">
                          <Globe className="w-3 h-3 text-blue-600" />
                        </div>
                      ) : (
                        <div title="Private Note" className="bg-gray-100 p-0.5 rounded-full">
                          <Lock className="w-3 h-3 text-gray-400" />
                        </div>
                      )}
                      <p className="text-xs sm:text-sm md:text-[14px] font-inter font-weight-400 uppercase tracking-wider font-medium whitespace-nowrap">
                        {format(new Date(note.createdAt), 'dd-MM-yyyy')}
                      </p>
                    </div>
                    <button
                      onClick={(e => {
                        e.stopPropagation()
                        handleNoteClick()
                      })}
                      className="p-1 text-gray-400 hover:text-gray-900 transition-all"
                      aria-label="Edit note"
                    >
                      <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )
            })}

            {notes.length === 0 && (
              <p className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-500">No notes found. Create your first note above!</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
