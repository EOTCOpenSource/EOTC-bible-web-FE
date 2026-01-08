'use client'

import { useEffect } from 'react'
import DashboardWidget from './DashboardWidget'
import { useBookmarksStore } from '@/stores/bookmarksStore'
import { useHighlightsStore } from '@/stores/highlightsStore'
import { useNotesStore } from '@/stores/notesStore'
import { useProgressStore } from '@/stores/progressStore'

const StatsRow = () => {
  const { bookmarks, loadBookmarks } = useBookmarksStore()
  const { highlights, loadHighlights } = useHighlightsStore()
  const { notes, loadNotes } = useNotesStore()
  const { progress, loadProgress } = useProgressStore()

  useEffect(() => {
    loadBookmarks().catch(() => {})
    loadHighlights().catch(() => {})
    loadNotes().catch(() => {})
    loadProgress().catch(() => {})
  }, [loadBookmarks, loadHighlights, loadNotes, loadProgress])

  const todayReadingCount = Object.values(progress.chaptersRead || {}).reduce((total, chapters) => {
    return total + chapters.length
  }, 0)

  return (
    <div className='grid grid-cols-4 gap-1 sm:gap-3 w-full'>
      <DashboardWidget name="Today Reading" amount={todayReadingCount} />
      <DashboardWidget name="Highlight" amount={highlights.length} href="/dashboard/highlights" />
      <DashboardWidget name="Notes" amount={notes.length} href="/dashboard/notes" />
      <DashboardWidget name="Bookmarks" amount={bookmarks.length} href="/dashboard/bookmarks" />
    </div>
  )
}

export default StatsRow
