'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, User, Book } from 'lucide-react'
import { format } from 'date-fns'
import { useNotesStore } from '@/stores/useNotesStore'
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
                        transformedNote = { ...noteData, title: parts[0].trim(), content: parts.slice(1).join('\n\n') }
                    } else {
                        const firstLine = noteData.content.split('\n')[0]?.trim()
                        transformedNote = { ...noteData, title: firstLine || 'Untitled', content: noteData.content }
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
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-red-500">{error || 'Note not found'}</p>
                <button
                    onClick={() => router.back()}
                    className="text-gray-600 hover:text-gray-900 underline"
                >
                    Go Back
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto w-full space-y-6">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Public Notes
            </button>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{note.title}</h1>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {note.bookId && note.chapter && (
                            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-100">
                                <Book className="w-4 h-4" />
                                <span>{note.bookId} {note.chapter}:{note.verseStart}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{note.createdAt ? format(new Date(note.createdAt), 'MMMM d, yyyy') : 'Unknown date'}</span>
                        </div>
                        {note.userId?.name && (
                            <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                <span>{note.userId.name}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 md:p-8 prose prose-gray max-w-none">
                    <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-gray-800">
                        {note.content}
                    </div>
                </div>
            </div>
        </div>
    )
}
