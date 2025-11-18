'use client'

import React, { useEffect, useMemo } from 'react'
import { useBookmarksStore } from '@/stores/bookmarksStore'
import { BibleBook } from '@/stores/types'

interface GroupedBookmarks {
  [book: string]: {
    chapter: number
    verses: { verseStart: number; verseCount: number; text: string }[]
  }[]
}

const BookmarksPage = () => {
  const { bookmarks, bibleBooks, loadBookmarks, isLoading, error, clearError } =
    useBookmarksStore()

  useEffect(() => {
    loadBookmarks()
  }, [loadBookmarks])

  const getVerseText = (
    bibleBook: BibleBook | undefined,
    chapter: number,
    verseStart: number,
    verseCount: number,
  ) => {
    if (!bibleBook) {
      return 'Loading...'
    }

    const chapterData = bibleBook.chapters.find((c) => c.chapter === chapter)
    if (!chapterData) {
      return 'Chapter not found'
    }

    const verses = chapterData.sections
      .flatMap((s) => s.verses)
      .slice(verseStart - 1, verseStart - 1 + verseCount)
      .map((v) => v.text)
      .join(' ')

    return verses
  }

  // Group bookmarks by book and chapter
  const groupedBookmarks = useMemo(() => {
    const grouped: GroupedBookmarks = {}

    bookmarks.forEach((b) => {
      if (!grouped[b.bookId]) {
        grouped[b.bookId] = []
      }
      const existingChapter = grouped[b.bookId].find((c) => c.chapter === b.chapter)
      const verseText = getVerseText(
        bibleBooks.get(b.bookId),
        b.chapter,
        b.verseStart,
        b.verseCount,
      )
      if (existingChapter) {
        existingChapter.verses.push({
          verseStart: b.verseStart,
          verseCount: b.verseCount,
          text: verseText,
        })
      } else {
        grouped[b.bookId].push({
          chapter: b.chapter,
          verses: [
            {
              verseStart: b.verseStart,
              verseCount: b.verseCount,
              text: verseText,
            },
          ],
        })
      }
    })

    // Optional: sort books alphabetically and chapters numerically
    for (const book of Object.keys(grouped)) {
      grouped[book].sort((a, b) => a.chapter - b.chapter)
      grouped[book].forEach((c) => {
        c.verses.sort((v1, v2) => v1.verseStart - v2.verseStart)
      })
    }

    return grouped
  }, [bookmarks, bibleBooks])

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Bookmarks</h1>

      {/* Error */}
      {error && (
        <div className="mb-4 text-red-500">
          {error} <button onClick={clearError}>Clear</button>
        </div>
      )}

      {/* Loading */}
      {isLoading && <p>Loading bookmarks...</p>}

      {/* No bookmarks */}
      {!isLoading && bookmarks.length === 0 && <p>No bookmarks yet.</p>}

      {/* List bookmarks */}
      {!isLoading && bookmarks.length > 0 && (
        <div>
          {Object.entries(groupedBookmarks).map(([book, chapters]) => (
            <div key={book} className="mb-6">
              <h2 className="mb-2 text-xl font-semibold capitalize">{book}</h2>
              {chapters.map((chapterData) => (
                <div key={chapterData.chapter} className="mb-2 ml-4">
                  <strong>Chapter {chapterData.chapter}:</strong>{' '}
                  {chapterData.verses.map((v, i) => (
                    <div key={i} className="ml-4">
                      <p className="font-semibold">
                        {v.verseCount > 1
                          ? `${v.verseStart}-${v.verseStart + v.verseCount - 1}`
                          : `${v.verseStart}`}
                      </p>
                      <p>{v.text}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BookmarksPage
