'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import clsx from 'clsx'
import { VerseActionMenu } from '@/components/reader/VerseActionMenu' // <-- imported here

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
            'mx-auto px-2 py-4 sm:px-4 sm:py-6 md:py-8',
            isSidebarOpen ? 'md:ml-[316px]' : 'md:ml-4',
            'max-w-4xl',
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
          {chapterData.sections.map((section: any, sectionIndex: number) => (
            <div key={sectionIndex}>
              {section.title && (
                <h3 className="mt-4 mb-2 text-center text-lg font-bold sm:text-xl">
                  {section.title}
                </h3>
              )}
              <div className="text-justify text-base sm:text-lg">
                {section.verses.map((verse: any) => (
                  <span key={verse.verse} className="group relative inline">
                    <sup className="mr-1 text-xs sm:text-xs md:text-xs">{verse.verse}</sup>
                    <span>{verse.text} </span>
                    <VerseActionMenu verseNumber={verse.verse} verseText={verse.text} />
                  </span>
                ))}
              </div>
            </div>
          ))}
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
