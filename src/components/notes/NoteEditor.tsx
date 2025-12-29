'use client'

import { useState } from 'react'
import { useNotesStore } from '@/stores/useNotesStore'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react'

export function NoteEditor() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const { addNote, isLoading } = useNotesStore()

  const handleSave = async () => {
    if (!title || !content) return
    await addNote({ title, content })
    setTitle('')
    setContent('')
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-[#FFFAFA] p-6 shadow-sm  md:w-[813px] md:min-h-[334px] flex flex-col gap-[17px]">
      <h2 className="text-sm font-medium text-gray-500">Write new note</h2>
      <div className="flex flex-col flex-1 gap-[17px]">
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xl font-semibold placeholder-gray-300 focus:outline-none bg-transparent"
        />
        <textarea
          placeholder="write new note"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full flex-1 resize-none text-gray-600 placeholder-gray-300 focus:outline-none bg-transparent"
        />
        
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-100 gap-4">
          <div className="flex flex-wrap items-center text-gray-400 w-full md:w-[756px] h-[34px] justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  // @ts-ignore - document.execCommand is deprecated but still widely supported for simple cases
                  document.execCommand('justifyLeft')
                }}
                className="hover:text-gray-600 transition-colors"
              ><AlignLeft size={18} /></button>
              <button 
                onClick={() => {
                  // @ts-ignore
                  document.execCommand('justifyCenter')
                }}
                className="hover:text-gray-600 transition-colors"
              ><AlignCenter size={18} /></button>
              <button 
                onClick={() => {
                  // @ts-ignore
                  document.execCommand('justifyRight')
                }}
                className="hover:text-gray-600 transition-colors"
              ><AlignRight size={18} /></button>
              <div className="h-4 w-px bg-gray-200 mx-1 hidden sm:block" />
              <button 
                onClick={() => {
                  // @ts-ignore
                  document.execCommand('bold')
                }}
                className="hover:text-gray-600 transition-colors font-bold"
              ><Bold size={18} /></button>
              <button 
                onClick={() => {
                  // @ts-ignore
                  document.execCommand('italic')
                }}
                className="hover:text-gray-600 transition-colors italic"
              ><Italic size={18} /></button>
              <button 
                onClick={() => {
                  // @ts-ignore
                  document.execCommand('underline')
                }}
                className="hover:text-gray-600 transition-colors underline"
              ><Underline size={18} /></button>
              <button className="hover:text-gray-600 transition-colors"><Type size={18} /></button>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isLoading || !title || !content}
            className="flex items-center justify-center gap-[5px] rounded-[8px] bg-[#000000] py-[12px] px-[48px] text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors w-full sm:w-[158px] h-[33.76px] shrink-0"
          >
            {isLoading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  )
}
