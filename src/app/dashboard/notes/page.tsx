'use client'

import { useState } from 'react'
import { NoteEditor } from '@/components/notes/NoteEditor'
import { NoteViewer } from '@/components/notes/NoteViewer'
import { MyNotesList } from '@/components/notes/MyNotesList'
import { useNotesStore } from '@/stores/useNotesStore'

export default function NotesPage() {
  const [isExpanded, setIsExpanded] = useState(false)
  const viewingNote = useNotesStore((state) => state.viewingNote)

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full">
      {!isExpanded && (
        viewingNote ? <NoteViewer /> : <NoteEditor />
      )}
      <MyNotesList
        isExpanded={isExpanded}
        onToggleExpandAction={() => setIsExpanded(!isExpanded)}
      />
    </div>
  )
}

