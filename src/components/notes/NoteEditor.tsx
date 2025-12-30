'use client'

import { useState } from 'react'
import { useNotesStore } from '@/stores/useNotesStore'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react'
import { format } from 'date-fns'

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
    <div className="flex flex-col gap-4 w-full max-w-[813px]">
      <h2 className="text-[20px] font-medium text-[#621B1C]">Write new note</h2>
      <div className="rounded-[20px] border border-[#C9C9C9] bg-[#FFFAFA] p-8 shadow-sm md:min-h-[334px] flex flex-col gap-[17px]">
        <div className="flex justify-between items-start w-full">
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-[28px] font-medium placeholder-gray-300 focus:outline-none bg-transparent text-gray-900"
          />
          <span className="text-[14px] text-gray-400 mt-2">{format(new Date(), 'dd-MM-yyyy')}</span>
        </div>
        
        <textarea
          placeholder="write new note"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full flex-1 resize-none text-[16px] text-gray-600 placeholder-gray-400 focus:outline-none bg-transparent"
        />
        
        <div className="flex flex-col sm:flex-row items-end justify-between mt-auto pt-4 gap-4">
          <div className="flex items-center gap-6 text-gray-500 bg-white/50 px-6 py-2 rounded-full border border-gray-100">
            <button 
              onClick={() => {
                // @ts-ignore
                document.execCommand('justifyLeft')
              }}
              className="hover:text-black transition-colors"
            ><AlignLeft size={20} /></button>
            <button 
              onClick={() => {
                // @ts-ignore
                document.execCommand('justifyCenter')
              }}
              className="hover:text-black transition-colors"
            ><AlignCenter size={20} /></button>
            <button 
              onClick={() => {
                // @ts-ignore
                document.execCommand('justifyRight')
              }}
              className="hover:text-black transition-colors"
            ><AlignRight size={20} /></button>
            <button 
              onClick={() => {
                // @ts-ignore
                document.execCommand('bold')
              }}
              className="hover:text-black transition-colors font-bold"
            ><Bold size={20} /></button>
            <button 
              onClick={() => {
                // @ts-ignore
                document.execCommand('italic')
              }}
              className="hover:text-black transition-colors italic"
            ><Italic size={20} /></button>
            <button 
              onClick={() => {
                // @ts-ignore
                document.execCommand('underline')
              }}
              className="hover:text-black transition-colors underline"
            ><Underline size={20} /></button>
            <button className="hover:text-black transition-colors"><Type size={20} /></button>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isLoading || !title || !content}
            className="flex items-center justify-center rounded-[8px] bg-[#000000] py-[12px] px-[48px] text-[14px] font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors w-full sm:w-[158px] h-[34px]"
          >
            {isLoading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  )
}
