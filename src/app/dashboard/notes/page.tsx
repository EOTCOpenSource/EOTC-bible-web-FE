'use client'

import { useState } from 'react'
import { NoteEditor } from '@/components/notes/NoteEditor'
import { MyNotesList } from '@/components/notes/MyNotesList'

export default function NotesPage() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full">
      {!isExpanded && <NoteEditor />}
      <MyNotesList 
        isExpanded={isExpanded} 
        onToggleExpandAction={() => setIsExpanded(!isExpanded)} 
      />
    </div>
  )
}

