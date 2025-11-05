'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import clsx from 'clsx'
import { VerseActionMenu } from '@/components/reader/VerseActionMenu'

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

  const handleBookmark = (verse: number | string) => {
    console.log('Bookmark verse:', verse)
    // TODO: Implement bookmark logic - save to localStorage or database
  }

  const handleNote = (verse: number | string, text: string) => {
    console.log('Add note to verse:', verse, 'Text:', text)
    // TODO: Implement note dialog - could use a modal/dialog component
  }

  const handleHighlight = (verse: number | string, selectedText: string) => {
    console.log('Highlight verse:', verse, 'Selected:', selectedText)
    // TODO: Implement highlight logic - save highlight color and position
  }

  return (
    <div className="relative h-full w-full">
      {prevChapter ? (
        <Link
          href={`/read-online/${bookId}/${prevChapter}`}
          className={clsx(
            'fixed top-1/2 z-10 -translate-y-1/2 rounded-md bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700',
            'left-4',
            isSidebarOpen ? 'md:left-[316px]' : 'md:left-4',
          )}
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
      ) : (
        <div
          className={clsx(
            'fixed top-1/2 z-10 -translate-y-1/2 cursor-not-allowed rounded-md bg-gray-200 p-2 opacity-50 dark:bg-gray-800',
            'left-4',
            isSidebarOpen ? 'md:left-[316px]' : 'md:left-4',
          )}
        >
          <ChevronLeft className="h-6 w-6" />
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-4 sm:py-6 md:py-8">
        <h1 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
          {bookData.book_name_am + ' ' + chapterData.chapter}
        </h1>

        <div className="mx-auto max-w-full">
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
                      bookName={bookData.book_name_am}
                      chapter={chapterData.chapter}
                      containerId={sectionId}
                      onBookmark={handleBookmark}
                      onNote={handleNote}
                      onHighlight={handleHighlight}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {nextChapter ? (
        <Link
          href={`/read-online/${bookId}/${nextChapter}`}
          className={clsx(
            'fixed top-1/2 z-10 -translate-y-1/2 rounded-md bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700',
            'right-4',
            'md:right-4',
          )}
        >
          <ChevronRight className="h-6 w-6" />
        </Link>
      ) : (
        <div
          className={clsx(
            'fixed top-1/2 z-10 -translate-y-1/2 cursor-not-allowed rounded-md bg-gray-200 p-2 opacity-50 dark:bg-gray-800',
            'right-4',
            'md:right-4',
          )}
        >
          <ChevronRight className="h-6 w-6" />
        </div>
      )}
    </div>
  )
}
