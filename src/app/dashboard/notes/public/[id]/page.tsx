'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, User, Book } from 'lucide-react'
import { format } from 'date-fns'
import type { Note } from '@/stores/useNotesStore'
import React from 'react'
import { NoteDetailSkeleton } from '@/components/skeletons/NoteDetailSkeleton'

export default function PublicNoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params as { id: string }
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/notes/public/${id}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch note')
        }

        const noteData = data.data?.note || data.data || data

        // Transform logic (reused)
        let transformedNote = noteData
        if (!noteData.title && noteData.content) {
          const parts = noteData.content.split('\n\n')
          if (parts.length > 1) {
            transformedNote = {
              ...noteData,
              title: parts[0].trim(),
              content: parts.slice(1).join('\n\n'),
            }
          } else {
            const firstLine = noteData.content.split('\n')[0]?.trim()
            transformedNote = {
              ...noteData,
              title: firstLine || 'Untitled',
              content: noteData.content,
            }
          }
        }

        setNote(transformedNote)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchNote()
    }
  }, [id])

  if (loading) {
    return <NoteDetailSkeleton />
  }

  if (error || !note) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error || 'Note not found'}</p>
        <button
          onClick={() => router.back()}
          className="text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Public Notes
      </button>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#1A1A1A]">
        <div className="border-b border-gray-100 bg-gray-50/50 p-6 md:p-8 dark:border-neutral-800 dark:bg-neutral-800/50">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
            {note.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            {note.bookId && note.chapter && (
              <div className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-white px-2 py-1 dark:border-neutral-700 dark:bg-[#2A2A2A]">
                <Book className="h-4 w-4" />
                <span>
                  {note.bookId} {note.chapter}:{note.verseStart}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>
                {note.createdAt ? format(new Date(note.createdAt), 'MMMM d, yyyy') : 'Unknown date'}
              </span>
            </div>
            {note.userId?.name && (
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{note.userId.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none p-6 md:p-8">
          <div className="font-serif text-lg leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-gray-200">
            {note.content}
          </div>
        </div>
      </div>
    </div>
  )
}
