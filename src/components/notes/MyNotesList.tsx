'use client'

import { useEffect } from 'react'
import { useNotesStore } from '@/stores/useNotesStore'
import { FileText, Edit2, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'

export function MyNotesList({ isExpanded, onToggleExpandAction }: { isExpanded?: boolean; onToggleExpandAction?: () => void }) {
  const notes = useNotesStore((state) => state.notes)
  const fetchNotes = useNotesStore((state) => state.fetchNotes)
  const isLoading = useNotesStore((state) => state.isLoading)

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const displayNotes = Array.isArray(notes) ? notes : []

  return (
    <div 
      className={`rounded-xl border border-gray-200 bg-[#FFFAFA] p-6 shadow-sm transition-all duration-300 w-full max-w-[813px] ${
        isExpanded ? 'min-h-[864px]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="text-red-900" size={20} />
          <h2 className="text-[24px] font-medium leading-none text-[#621B1C] w-[151px] h-[24px]">My Notes</h2>
        </div>
        {!isExpanded && (
          <button 
            onClick={onToggleExpandAction}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            See all <ArrowUpRight size={16} />
          </button>
        )}
        {isExpanded && (
          <button 
            onClick={onToggleExpandAction}
            className="text-sm font-medium text-red-900 hover:text-red-800 transition-colors"
          >
            Back to Editor
          </button>
        )}
      </div>

      <div className={`flex flex-col gap-[16px]`}>
        {(isExpanded ? displayNotes : displayNotes.slice(0, 3)).map((note) => (
          <div
            key={note.id}
            className="group flex items-center justify-between rounded-[20px] border border-[#C9C9C9] bg-[#FFFBFB] p-6 hover:bg-gray-50 transition-colors w-full md:w-[749px] h-[91px]"
          >
            <div className="flex items-center gap-6">
              <div className="flex h-[45px] w-[40px] items-center justify-center rounded-lg bg-[#7C2D2D] text-white shadow-sm">
                <FileText size={24} />
              </div>
              <h3 className="text-[20px] font-medium text-gray-900">{note.title}</h3>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <p className="text-[12px] text-gray-400 uppercase tracking-wider font-medium">
                {format(new Date(note.createdAt), 'dd-MM-yyyy')}
              </p>
              <button className="p-1 text-gray-400 hover:text-gray-900 transition-all">
                <Edit2 size={20} />
              </button>
            </div>
          </div>
        ))}
        
        {notes.length === 0 && !isLoading && (
          <p className="text-center py-8 text-gray-500">No notes found. Create your first note above!</p>
        )}
      </div>
    </div>
  )
}
