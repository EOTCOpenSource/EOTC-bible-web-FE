'use client'

import { PublicNotesList } from '@/components/notes/PublicNotesList'

export default function PublicNotesPage() {
    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Community Notes</h1>
                <p className="text-gray-500">Explore notes shared by the community.</p>
            </div>
            <PublicNotesList />
        </div>
    )
}
