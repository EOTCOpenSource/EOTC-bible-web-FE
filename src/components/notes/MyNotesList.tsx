'use client'

import { useState, useEffect } from 'react'
import { useNotesStore } from '@/stores/useNotesStore'
import { FileText, SquarePen, ArrowUpRight, Globe, Lock, Filter, Check, BookOpen } from 'lucide-react'
import { format } from 'date-fns'
import { NoteCardSkeleton } from '../skeletons/NoteCardSkeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const MyNotesList = ({
  isExpanded,
  onToggleExpandAction,
}: {
  isExpanded?: boolean
  onToggleExpandAction?: () => void
}) => {
  const notes = useNotesStore((state) => state.notes)
  const fetchNotes = useNotesStore((state) => state.fetchNotes)
  const isLoading = useNotesStore((state) => state.isLoading)
  const setEditingNote = useNotesStore((state) => state.setEditingNote)
  const setViewingNote = useNotesStore((state) => state.setViewingNote)

  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('private')
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null)

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const displayNotes = Array.isArray(notes) ? notes : []

  const filteredNotes = displayNotes.filter((note) => {
    if (filter === 'all') return true
    if (filter === 'public') return note.visibility === 'public'
    if (filter === 'private') return note.visibility !== 'public'
    return true
  })

  return (
    <div
      className={`xs:mb-3 mt-3 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-[#FFFAFA] dark:bg-[#1A1A1A] p-3 shadow-sm transition-all duration-300 sm:mt-4 sm:mb-4 sm:p-4 md:mb-6 md:p-6 mb-2${
        isExpanded
          ? 'mb-2 h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px]'
          : ''
      }`}
    >
      <div className="mb-2 flex flex-row items-center justify-between gap-2 sm:mb-3 md:mb-4 lg:mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#4C0E0F] dark:text-red-400 sm:h-5 sm:w-5" />
          <h2 className="font-inter font-weight-500 text-lg leading-none font-medium text-[#621B1C] dark:text-red-400 sm:text-xl md:text-[24px]">
            My Notes
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-2 flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-300 transition-colors hover:text-gray-900 dark:hover:text-white">
                <Filter className="h-3.5 w-3.5" />
                <span className="capitalize">
                  {filter === 'all' ? 'All Notes' : filter + ' Notes'}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[150px] dark:bg-neutral-800 dark:border-neutral-700">
              <DropdownMenuItem
                onClick={() => setFilter('all')}
                className="flex items-center justify-between"
              >
                All Notes
                {filter === 'all' && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilter('public')}
                className="flex items-center justify-between"
              >
                Public Notes
                {filter === 'public' && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilter('private')}
                className="flex items-center justify-between"
              >
                Private Notes
                {filter === 'private' && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {!isExpanded && (
          <button
            onClick={onToggleExpandAction}
            className="font-weight-400 font-poppins flex items-center gap-1 text-[20px] font-[20px] text-black dark:text-white transition-colors sm:text-sm"
          >
            See all <ArrowUpRight className="sm:h-[15px h-[20px] w-[20px] sm:w-[15px] dark:text-white" />
          </button>
        )}
        {isExpanded && (
          <button
            onClick={onToggleExpandAction}
            className="text-xs font-medium text-[#4C0E0F] dark:text-red-400 transition-colors hover:text-red-800 dark:hover:text-red-300 sm:text-sm"
          >
            Back to Editor
          </button>
        )}
      </div>

      <div
        className={`flex flex-col gap-3 overflow-y-auto sm:gap-4 md:gap-[16px] ${isExpanded ? 'max-h-full' : ''}`}
      >
        {isLoading ? (
          Array.from({ length: isExpanded ? 5 : 3 }).map((_, i) => (
            <NoteCardSkeleton key={`skeleton-${i}`} />
          ))
        ) : (
          <>
            {(isExpanded ? filteredNotes : filteredNotes.slice(0, 3)).map((note, index) => {
              // Extract title if not present
              const noteTitle =
                note.title ||
                (() => {
                  const parts = (note.content || '').split('\n\n')
                  if (parts.length > 1) return parts[0]
                  const firstLine = (note.content || '').split('\n')[0]?.trim()
                  return firstLine || 'Untitled'
                })()

              // Build source label for notes created from the Bible reader
              const noteBookId = (note as any).bookId || (note as any).book || ''
              const noteChapter = (note as any).chapter || ''
              const noteVerse = (note as any).verseStart || (note as any).verse || ''
              const isFromReader = noteBookId && noteBookId !== '_dashboard' && noteBookId !== 'GEN'
              const sourceLabel = isFromReader
                ? `${noteBookId}${noteChapter ? ` ${noteChapter}` : ''}${noteVerse ? `:${noteVerse}` : ''}`
                : null

              const handleNoteClick = () => {
                const noteId = note.id || note._id || ''
                if (expandedNoteId === noteId) {
                  setExpandedNoteId(null)
                } else {
                  setExpandedNoteId(noteId as string)
                }
              }

              const handleEditClick = (e: React.MouseEvent) => {
                e.stopPropagation()
                setEditingNote(note)
                setViewingNote(null)
                if (onToggleExpandAction && isExpanded) {
                  onToggleExpandAction()
                }
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }

              return (
                <div
                  key={note.id || note._id || `note-${index}`}
                  className="group flex w-full flex-col gap-3 rounded-[12px] border border-[#C9C9C9] dark:border-neutral-700 bg-[#FFFBFB] dark:bg-[#2A2A2A] p-3 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800 sm:rounded-[16px] sm:p-4 md:rounded-[20px] md:p-6"
                >
                  {/* Card Header (Clickable for Accordion) */}
                  <div 
                    onClick={handleNoteClick}
                    className="flex min-h-[50px] w-full cursor-pointer flex-col items-start justify-between gap-3 min-[375px]:flex-row min-[375px]:items-center min-[375px]:gap-0"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4 md:gap-6">
                      <div className="flex h-[35px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-[#7C2D2D] text-white shadow-sm sm:h-[40px] sm:w-[35px] md:h-[45px] md:w-[40px]">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white sm:text-base md:text-[20px]">
                          {noteTitle}
                        </h3>
                        {sourceLabel && (
                          <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                            <BookOpen size={10} />
                            <span>{sourceLabel}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5">
                        {note.visibility === 'public' ? (
                          <div title="Public Note" className="rounded-full bg-blue-100 p-0.5">
                            <Globe className="h-3 w-3 text-blue-600" />
                          </div>
                        ) : (
                          <div title="Private Note" className="rounded-full bg-gray-100 p-0.5">
                            <Lock className="h-3 w-3 text-gray-400" />
                          </div>
                        )}
                        <p className="font-inter font-weight-400 text-xs font-medium tracking-wider whitespace-nowrap uppercase text-gray-900 dark:text-gray-300 sm:text-sm md:text-[14px]">
                          {format(new Date(note.createdAt), 'dd-MM-yyyy')}
                        </p>
                      </div>
                      <button
                        onClick={handleEditClick}
                        className="p-1 text-gray-400 dark:text-gray-500 transition-all hover:text-gray-900 dark:hover:text-white"
                        aria-label="Edit note"
                      >
                        <SquarePen className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {expandedNoteId === (note.id || note._id) && (
                    <div className="mt-2 w-full border-t border-gray-200 dark:border-neutral-700 pt-4 text-sm sm:text-base text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: note.content }} />
                    </div>
                  )}
                </div>
              )
            })}

            {notes.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-500 sm:py-8 sm:text-base">
                No notes found. Create your first note above!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
