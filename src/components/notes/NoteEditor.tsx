'use client'

import { useState, useEffect, useRef } from 'react'
import { useNotesStore } from '@/stores/useNotesStore'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react'
import { format } from 'date-fns'

export function NoteEditor() {
  const { editingNote, setEditingNote, updateNote, addNote, isLoading } = useNotesStore()
  const [title, setTitle] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editingNote) {
      const parts = editingNote.content.split('\n\n')
      if (parts.length > 1) {
        setTitle(editingNote.title || parts[0])
        if (editorRef.current) editorRef.current.innerHTML = parts.slice(1).join('\n\n')
      } else {
        setTitle(editingNote.title || '')
        if (editorRef.current) editorRef.current.innerHTML = editingNote.content
      }
    } else {
      setTitle('')
      if (editorRef.current) editorRef.current.innerHTML = ''
    }
  }, [editingNote])

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) editorRef.current.focus()
  }

  const handleSave = async () => {
    const content = editorRef.current?.innerHTML || ''
    if (!title || !content || content === '<br>' || !content.trim()) return
    
    try {
      if (editingNote) {
        await updateNote(editingNote.id || editingNote._id!, {
          title: title.trim(),
          content: content.trim()
        })
        setEditingNote(null)
      } else {
        const timestamp = Date.now()
        const randomVerse = Math.floor(Math.random() * 1000) + 1
        
        await (addNote as any)({ 
          title: title.trim(), 
          content: content.trim(),
          bookId: 'GEN',
          chapter: Math.floor(timestamp / 1000000) || 1,
          verseStart: randomVerse,
          verseCount: 1
        })
      }
      
      setTitle('')
      if (editorRef.current) editorRef.current.innerHTML = ''
    } catch (err) {
      console.error('Failed to save note:', err)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-[813px]">
      <div className="flex items-center justify-between">
        <h2 className="ext-[20px] bg-[ #000000B2] font-poppins font-weight-400 h-[29px]">
          {editingNote ? 'Edit note' : 'Write new note'}
        </h2>
        {editingNote && (
          <button 
            onClick={() => setEditingNote(null)}
            className="text-sm text-gray-500 hover:text-red-900"
          >
            Cancel Edit
          </button>
        )}
      </div>
      
      <div className="rounded-[20px] border border-[#C9C9C9] bg-[#FFFAFA] p-8 shadow-sm md:min-h-[334px] flex flex-col gap-[17px]">
        <div className="flex justify-between items-start w-full">
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-[24px] font-medium font-weight-400 font-poppins placeholder-gray-300 focus:outline-none bg-transparent text-gray-900"
          />
          <span className="text-[14px] text-gray-400 mt-2">{format(new Date(), 'dd-MM-yyyy')}</span>
        </div>
        
        <div
          ref={editorRef}
          contentEditable
          className="w-full flex-1 min-h-[150px] resize-none text-[20px] bg-[ #000000B2] font-poppins font-weight-400 focus:outline-none bg-transparent overflow-y-auto"
          onInput={(e) => {
            if (e.currentTarget.innerHTML === '') {
              e.currentTarget.innerHTML = ''
            }
          }}
          data-placeholder="write new note"
        />
        
        <div className="flex flex-col sm:flex-row items-end justify-between mt-auto pt-4 gap-4">
          <div className="flex items-center gap-6 text-gray-500 bg-white/50 px-6 py-2 rounded-full border border-gray-100">
            <button 
              onMouseDown={(e) => {
                e.preventDefault()
                handleFormat('justifyLeft')
              }}
              className="hover:text-black transition-colors"
            ><AlignLeft size={20} /></button>
            <button 
              onMouseDown={(e) => {
                e.preventDefault()
                handleFormat('justifyCenter')
              }}
              className="hover:text-black transition-colors"
            ><AlignCenter size={20} /></button>
            <button 
              onMouseDown={(e) => {
                e.preventDefault()
                handleFormat('justifyRight')
              }}
              className="hover:text-black transition-colors"
            ><AlignRight size={20} /></button>
            <button 
              onMouseDown={(e) => {
                e.preventDefault()
                handleFormat('bold')
              }}
              className="hover:text-black transition-colors font-bold"
            ><Bold size={20} /></button>
            <button 
              onMouseDown={(e) => {
                e.preventDefault()
                handleFormat('italic')
              }}
              className="hover:text-black transition-colors italic"
            ><Italic size={20} /></button>
            <button 
              onMouseDown={(e) => {
                e.preventDefault()
                handleFormat('underline')
              }}
              className="hover:text-black transition-colors underline"
            ><Underline size={20} /></button>
            <button className="hover:text-black transition-colors"><Type size={20} /></button>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isLoading || !title}
            className="flex items-center justify-center rounded-[8px] bg-[#000000] py-[12px] px-[48px] text-[14px] font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors w-full sm:w-[158px] h-[34px]"
          >
            {isLoading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
      <style jsx>{`
        [contentEditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          cursor: text;
        }
      `}</style>
    </div>
  )
}
