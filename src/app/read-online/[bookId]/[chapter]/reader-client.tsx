'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import clsx from 'clsx'
import { VerseActionMenu } from '@/components/reader/VerseActionMenu'
import { useHighlightsStore } from '@/stores/highlightsStore'
import { hexToHighlightColor, getHighlightInlineColor } from '@/lib/highlight-utils'
import { useEffect, useMemo } from 'react'
import type { HighlightColor, VerseRef } from '@/stores/types'

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
  const { highlights, loadHighlights, addHighlight, changeColor } = useHighlightsStore()

  // Load highlights when bookId or chapter changes
  useEffect(() => {
    loadHighlights()
  }, [bookId, chapterData.chapter, loadHighlights])

  // Map highlights for quick lookup per verse
  const highlightsMap = useMemo(() => {
    const map = new Map<
      number,
      { _id: string; colorHex: string; colorName: HighlightColor; verseCount: number }
    >()

    highlights.forEach((highlight) => {
      if (!highlight || !highlight._id) return

      const h = highlight as any
      const highlightVerseRef = h.verseRef || highlight.verseRef
      const highlightBookId =
        h.bookId || highlightVerseRef?.book || highlightVerseRef?.bookId || h.book || ''
      const chapterValue = highlightVerseRef?.chapter ?? h.chapter
      const verseStartValue =
        highlightVerseRef?.verseStart ?? highlightVerseRef?.verse ?? h.verseStart ?? h.verse
      const verseCountValue = highlightVerseRef?.verseCount ?? h.verseCount ?? 1
      const chapter = Number(chapterValue)
      const verseStart = Number(verseStartValue)
      const verseCount = Number(verseCountValue) || 1
      const colorName = highlight.color as HighlightColor

      if (!highlightBookId || !Number.isFinite(chapter) || !Number.isFinite(verseStart) || !colorName)
        return

      const normalizedBook = highlightBookId.toString().toLowerCase().replace(/\s+/g, '-')
      const normalizedBookId = bookId.toString().toLowerCase().replace(/\s+/g, '-')

      if (normalizedBook === normalizedBookId && chapter === chapterData.chapter) {
        const hexColor = getHighlightInlineColor(colorName)
        for (let i = 0; i < verseCount; i++) {
          const verseNumber = verseStart + i
          map.set(verseNumber, {
            _id: highlight._id, // FIXED: use _id
            colorHex: hexColor,
            colorName,
            verseCount,
          })
        }
      }
    })

    return map
  }, [highlights, bookId, chapterData.chapter])

  const handleNote = (verse: number | string, text: string) => {
    // TODO: Implement note dialog
  }

  const handleHighlight = async (
    verseRange: { start: number; end: number; count: number },
    _selectedText: string,
    colorHex?: string
  ) => {
    const verseStart = verseRange.start
    if (!verseStart || !colorHex) return

    const existingHighlight = highlightsMap.get(verseStart)
    const newColor = hexToHighlightColor(colorHex)

    if (existingHighlight) {
      // Only update if real backend ID and color is different
      if (!existingHighlight._id.startsWith('temp-') && newColor !== existingHighlight.colorName) {
        try {
          await changeColor(existingHighlight._id, newColor)
          await loadHighlights()
        } catch (err) {
          console.error('Error updating highlight:', err)
        }
      }
    } else {
      const verseRef: VerseRef = {
        book: bookId,
        chapter: chapterData.chapter,
        verseStart,
        verseCount: verseRange.count || 1,
      }
      try {
        await addHighlight(verseRef, newColor)
        await loadHighlights()
      } catch (err) {
        console.error('Error adding highlight:', err)
      }
    }
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
                    bookId={bookId}
                    bookName={bookData.book_name_am}
                    chapter={chapterData.chapter}
                    containerId={sectionId}
                    onNote={handleNote}
                    onHighlight={handleHighlight}
                    highlightColor={highlightsMap.get(verse.verse)?.colorHex}
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
