'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import clsx from 'clsx'
import { VerseActionMenu } from '@/components/reader/VerseActionMenu'
import { useHighlightsStore } from '@/stores/highlightsStore'
import { getHighlightInlineColor } from '@/lib/highlight-utils'
import { useEffect, useMemo, useState } from 'react'
import type { HighlightColor } from '@/stores/types'
import { useSearchParams } from 'next/navigation'

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
  const searchParams = useSearchParams()

  const { highlights, loadHighlights } = useHighlightsStore()

  const [animatedVerses, setAnimatedVerses] = useState<Set<number>>(new Set())

  useEffect(() => {
    loadHighlights()
  }, [bookId, chapterData.chapter, loadHighlights])

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const verseCount = parseInt(searchParams.get('verseCount') || '1', 10)
      const verseStart = parseInt(hash.substring(2), 10)

      if (!isNaN(verseStart)) {
        const versesToAnimate = new Set<number>()
        for (let i = 0; i < verseCount; i++) {
          versesToAnimate.add(verseStart + i)
        }
        setAnimatedVerses(versesToAnimate)

        // Scroll after a brief delay to ensure DOM is ready
        setTimeout(() => {
          const firstElement = document.getElementById(`v${verseStart}`)
          if (firstElement) {
            firstElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)

        // Remove animation after 10 seconds
        setTimeout(() => {
          setAnimatedVerses(new Set())
        }, 10000)
      }
    }
  }, [searchParams])

  const highlightsMap = useMemo(() => {
    const map = new Map<
      number,
      { _id: string; colorHex: string; colorName: HighlightColor; verseCount: number }
    >()

    highlights.forEach((highlight) => {
      if (!highlight || !highlight._id) return

      const h = highlight as any
      const verseRef = h.verseRef || {}
      const highlightBookId = h.bookId || verseRef.bookId || verseRef.book || h.book || ''

      const chapter = Number(verseRef.chapter ?? h.chapter)
      const verseStart = Number(verseRef.verseStart ?? verseRef.verse ?? h.verseStart)
      const verseCount = Number(verseRef.verseCount ?? h.verseCount ?? 1)
      const colorName = highlight.color as HighlightColor

      if (!highlightBookId || !Number.isFinite(chapter) || !Number.isFinite(verseStart)) return

      const normalizedBook = highlightBookId.toString().toLowerCase().replace(/\s+/g, '-')
      const normalizedBookId = bookId.toLowerCase().replace(/\s+/g, '-')

      if (normalizedBook === normalizedBookId && chapter === chapterData.chapter) {
        const hexColor = getHighlightInlineColor(colorName)
        for (let i = 0; i < verseCount; i++) {
          map.set(verseStart + i, {
            _id: highlight._id,
            colorHex: hexColor,
            colorName,
            verseCount,
          })
        }
      }
    })

    return map
  }, [highlights, bookId, chapterData.chapter])

  // handlers
  const handleBookmark = (verse: number | string) => {
    console.log('Bookmark verse:', verse)
    // TODO: Implement bookmark logic - save to localStorage or database
  }

  const handleNote = (verse: number | string, text: string) => {
    console.log('Add note to verse:', verse, 'Text:', text)
    // TODO: Implement note dialog - could use a modal/dialog component
  }

  return (
    <div className="relative h-full w-full">
      {/* LEFT ARROW */}
      <div
        className={clsx(
          'fixed top-1/2 z-10 -translate-y-1/2 transition-all',
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

      {/* MAIN CONTENT */}
      <div
        className={clsx(
          'mx-auto max-w-5xl px-4 py-4 transition-all sm:py-6 md:py-8',
          isSidebarOpen ? 'md:px-20' : 'md:px-16',
        )}
      >
        <h1 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
          {bookData.book_name_am + ' ' + chapterData.chapter}
        </h1>

        {chapterData.sections.map((section: any, sIndex: number) => {
          const sectionId = `section-${chapterData.chapter}-${sIndex}`

          return (
            <div key={sIndex}>
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
                    onBookmark={handleBookmark}
                    onNote={handleNote}
                    highlightColor={highlightsMap.get(verse.verse)?.colorHex}
                    highlightId={highlightsMap.get(verse.verse)?._id}
                    shouldAnimate={animatedVerses.has(verse.verse)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* RIGHT ARROW */}
      <div
        className={clsx(
          'fixed top-1/2 right-8 z-10 -translate-y-1/2 transition-all',
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
