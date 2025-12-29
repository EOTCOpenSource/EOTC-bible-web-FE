'use client'

import { useEffect } from 'react'
import { useNotesStore } from '@/stores/useNotesStore'
import { FileText, Edit2, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'

export function MyNotesList({ isExpanded, onToggleExpand }: { isExpanded?: boolean; onToggleExpand?: () => void }) {
  const notes = useNotesStore((state) => state.notes)
  const fetchNotes = useNotesStore((state) => state.fetchNotes)
  const isLoading = useNotesStore((state) => state.isLoading)

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const displayNotes = Array.isArray(notes) ? notes : []

  return (
    <div 
      className={`rounded-xl border border-gray-200 bg-[#FFFAFA] p-6 shadow-sm transition-all duration-300 ${
        isExpanded ? 'w-[813px] min-h-[864px]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="text-red-900" size={20} />
          <h2 className="text-lg font-bold text-gray-900">My Notes</h2>
        </div>
        {!isExpanded && (
          <button 
            onClick={onToggleExpand}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            See all <ArrowUpRight size={16} />
          </button>
        )}
        {isExpanded && (
          <button 
            onClick={onToggleExpand}
            className="text-sm font-medium text-red-900 hover:text-red-800 transition-colors"
          >
            Back to Editor
          </button>
        )}
      </div>

      <div className={`flex flex-col gap-[46px]`}>
        {(isExpanded ? displayNotes : displayNotes.slice(0, 3)).map((note) => (
          <div
            key={note.id}
            className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-10 items-center justify-center rounded-lg bg-red-900 text-white shadow-sm">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{note.title}</h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                  {format(new Date(note.createdAt), 'MMM dd')} - {format(new Date(note.updatedAt), 'MMM dd')}
                </p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg shadow-sm transition-all">
              <Edit2 size={16} />
            </button>
          </div>
        ))}
        
        {notes.length === 0 && !isLoading && (
          <p className="text-center py-8 text-gray-500">No notes found. Create your first note above!</p>
        )}
      </div>
    </div>
  )
}
