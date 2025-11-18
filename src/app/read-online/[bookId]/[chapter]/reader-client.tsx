'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import clsx from 'clsx'
import { VerseActionMenu } from '@/components/reader/VerseActionMenu'
import { useHighlightsStore } from '@/stores/highlightsStore'
import { hexToHighlightColor, getHighlightInlineColor } from '@/lib/highlight-utils'
import { useEffect, useMemo } from 'react'
import type { VerseRef } from '@/stores/types'

interface ReaderClientProps {
  bookData: any
  chapterData: any
  prevChapter: number | null
  nextChapter: number | null
  bookId: string
}

export default function ReaderClient({
  bookData,
  chapterData,
  prevChapter,
  nextChapter,
  bookId,
}: ReaderClientProps) {
  const { open: isSidebarOpen } = useSidebar()
  const { highlights, loadHighlights, addHighlight, removeHighlight } = useHighlightsStore()

  // Load highlights on mount and when bookId/chapter changes
  useEffect(() => {
    loadHighlights()
  }, [bookId, chapterData.chapter, loadHighlights])

  // Create a map of highlights for current chapter for quick lookup
  const highlightsMap = useMemo(() => {
    const map = new Map<number, { id: string; color: string }>()
    
    
    highlights.forEach((highlight) => {
      // Skip invalid highlights
      if (!highlight || !highlight._id) {
        console.warn('[highlightsMap] Skipping invalid highlight:', highlight)
        return
      }
      
      // Handle both backend format (bookId, chapter, verseStart) and frontend format (verseRef)
      // Type assertion to handle potential backend format during transformation
      const h = highlight as any
      const book = highlight.verseRef?.book || h.bookId
      const chapter = highlight.verseRef?.chapter ?? h.chapter
      const verseStart =
        highlight.verseRef?.verseStart ?? highlight.verseRef?.verse ?? h.verseStart ?? h.verse
      const verseCount = highlight.verseRef?.verseCount ?? h.verseCount ?? 1
      const color = highlight.color
      
      // Skip if required fields are missing
      if (!book || !chapter || !verseStart || !color) {
        console.warn('[highlightsMap] Skipping highlight with missing fields:', {
          book,
          chapter,
          verseStart,
          verseCount,
          color,
        })
        return
      }
      
      // Normalize bookId for comparison (backend might return different format)
      const normalizedBook = book.toLowerCase().replace(/\s+/g, '-')
      const normalizedBookId = bookId.toLowerCase().replace(/\s+/g, '-')
      
      // Match highlight to current book and chapter
      if (normalizedBook === normalizedBookId && chapter === chapterData.chapter) {
        const hexColor = getHighlightInlineColor(color)
        for (let i = 0; i < verseCount; i++) {
          const verseNumber = verseStart + i
          map.set(verseNumber, {
            id: highlight._id,
            color: hexColor,
          })
        }
      }
    })
    
    return map
  }, [highlights, bookId, chapterData.chapter])

  const handleNote = (verse: number | string, text: string) => {
    // TODO: Implement note dialog - could use a modal/dialog component
  }

  const handleHighlight = async (
    verseRange: { start: number; end: number; count: number },
    _selectedText: string,
    colorHex?: string,
  ) => {
    const verseStart = verseRange.start
    if (!verseStart) return

    const verseRef: VerseRef = {
      book: bookId,
      chapter: chapterData.chapter,
      verseStart,
      verseCount: verseRange.count || 1,
    }

    // Check if verse is already highlighted
    const existingHighlight = highlightsMap.get(verseStart)

    if (existingHighlight) {
      await removeHighlight(existingHighlight.id)
      await loadHighlights()
      return
    }

    if (!colorHex) return

    const highlightColor = hexToHighlightColor(colorHex)
    await addHighlight(verseRef, highlightColor)
    await loadHighlights()
  }

  return (
    <div className="relative h-full w-full">
      {/* Previous Chapter Arrow */}
      <div
        className={clsx(
          'fixed top-1/2 z-10 -translate-y-1/2 transition-all duration-200',
          isSidebarOpen ? 'left-[312px]' : 'left-32',
        )}
      >
        {prevChapter ? (
          <Link
            href={`/read-online/${bookId}/${prevChapter}`}
            className="block rounded-md bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
        ) : (
          <div className="cursor-not-allowed rounded-md bg-gray-200 p-2 opacity-50 dark:bg-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </div>
        )}
      </div>

      {/* Verse Content */}
      <div
        className={clsx(
          'mx-auto max-w-5xl px-4 py-4 transition-all duration-200 sm:py-6 md:py-8',
          isSidebarOpen ? 'md:px-20' : 'md:px-16',
        )}
      >
        <h1 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
          {bookData.book_name_am + ' ' + chapterData.chapter}
        </h1>

        {chapterData.sections.map((section: any, sectionIndex: number) => {
          const sectionId = `section-${chapterData.chapter}-${sectionIndex}`

          return (
            <div key={sectionIndex}>
              {section.title && (
                <h3 className="mt-4 mb-2 text-center text-lg font-bold sm:text-xl">
                  {section.title}
                </h3>
              )}
              <div id={sectionId} className="text-justify text-base sm:text-lg">
                {section.verses.map((verse: any) => (
                  <VerseActionMenu
                    key={verse.verse}
                    verseNumber={verse.verse}
                    verseText={verse.text}
                    bookId={bookId} // <-- send slug, the real backend ID
                    bookName={bookData.book_name_am} // optional, for UI only
                    chapter={chapterData.chapter}
                    containerId={sectionId}
                    onNote={handleNote}
                    onHighlight={handleHighlight}
                    highlightColor={highlightsMap.get(verse.verse)?.color}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Next Chapter Arrow */}
      <div
        className={clsx(
          'fixed top-1/2 right-8 z-10 -translate-y-1/2',
          isSidebarOpen ? 'mr-6' : 'mr-24',
        )}
      >
        {nextChapter ? (
          <Link
            href={`/read-online/${bookId}/${nextChapter}`}
            className="block rounded-md bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <ChevronRight className="h-6 w-6" />
          </Link>
        ) : (
          <div className="cursor-not-allowed rounded-md bg-gray-200 p-2 opacity-50 dark:bg-gray-800">
            <ChevronRight className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  )
}