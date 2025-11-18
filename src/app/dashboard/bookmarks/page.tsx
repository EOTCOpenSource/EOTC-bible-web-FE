'use client'

import React, { useEffect, useMemo } from 'react'
import { useBookmarksStore } from '@/stores/bookmarksStore'

interface GroupedBookmarks {
  [book: string]: {
    chapter: number
    verses: { verseStart: number; verseCount: number }[]
  }[]
}

const BookmarksPage = () => {
  const { bookmarks, loadBookmarks, isLoading, error, clearError } = useBookmarksStore()

  useEffect(() => {
    loadBookmarks()
  }, [loadBookmarks])

  // Group bookmarks by book and chapter
  const groupedBookmarks = useMemo(() => {
    const grouped: GroupedBookmarks = {}

    bookmarks.forEach((b) => {
      if (!grouped[b.verseRef.book]) {
        grouped[b.verseRef.book] = []
      }
      const existingChapter = grouped[b.verseRef.book].find((c) => c.chapter === b.verseRef.chapter)
      if (existingChapter) {
        existingChapter.verses.push({
          verseStart: b.verseRef.verseStart,
          verseCount: b.verseRef.verseCount,
        })
      } else {
        grouped[b.verseRef.book].push({
          chapter: b.verseRef.chapter,
          verses: [{ verseStart: b.verseRef.verseStart, verseCount: b.verseRef.verseCount }],
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
  }, [bookmarks])

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
                  {chapterData.verses
                    .map((v) =>
                      v.verseCount > 1
                        ? `${v.verseStart}-${v.verseStart + v.verseCount - 1}`
                        : `${v.verseStart}`,
                    )
                    .join(', ')}
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
