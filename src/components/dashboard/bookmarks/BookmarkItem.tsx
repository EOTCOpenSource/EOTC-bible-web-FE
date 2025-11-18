import React, { useEffect, useState } from 'react'
import { BookMark } from '@/stores/types'
import { useBookmarksStore } from '@/stores/bookmarksStore'
import { Button } from '@/components/ui/button'
import { ArrowRight, Trash2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'

interface BookmarkItemProps {
  bookmark: BookMark
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark }) => {
  const { bibleBooks, loadBibleBook, removeBookmark } = useBookmarksStore()
  const [verseText, setVerseText] = useState<string | null>(null)
  const [bookName, setBookName] = useState<string | null>(null)
  const [isLoadingVerse, setIsLoadingVerse] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchVerse = async () => {
      setIsLoadingVerse(true)
      let book = bibleBooks.get(bookmark.bookId)
      if (!book) {
        await loadBibleBook(bookmark.bookId)
        // Re-get the book after loading
        book = useBookmarksStore.getState().bibleBooks.get(bookmark.bookId)
      }

      if (book) {
        setBookName(book.book_name_en)
        const chapterData = book.chapters.find((c) => c.chapter === bookmark.chapter)
        if (chapterData) {
          const allVerses = chapterData.sections.flatMap((s) => s.verses)
          const verseCount = bookmark.verseCount || 1
          const startIndex = allVerses.findIndex((v) => v.verse === bookmark.verseStart)

          if (startIndex !== -1) {
            const verses = allVerses
              .slice(startIndex, startIndex + verseCount)
              .map((v) => v.text)
              .join(' ')
            setVerseText(verses)
          } else {
            setVerseText('Verse not found.')
          }
        }
      }
      setIsLoadingVerse(false)
    }

    fetchVerse()
  }, [bookmark, bibleBooks, loadBibleBook])

  const handleDelete = () => {
    removeBookmark(bookmark._id)
  }

  const handleReadMore = () => {
    router.push(`/read-online/${bookmark.bookId}/${bookmark.chapter}#v${bookmark.verseStart}`)
  }

  const verseRange =
    bookmark.verseCount && bookmark.verseCount > 1
      ? `${bookmark.verseStart}-${bookmark.verseStart + bookmark.verseCount - 1}`
      : bookmark.verseStart

  return (
    <div className="flex flex-col space-y-2 rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {bookName || <Skeleton className="inline-block h-5 w-32" />} {bookmark.chapter}:
          {verseRange}
        </h3>
        <Button variant="ghost" size="icon" onClick={handleDelete} aria-label="Delete bookmark">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
      {isLoadingVerse ? (
        <Skeleton className="h-16 w-full" />
      ) : (
        <p className="line-clamp-3 text-sm text-yellow-600 dark:text-gray-400">
          {verseText || 'Verse not found.'}
        </p>
      )}
      <div className="flex justify-end">
        <Button variant="link" onClick={handleReadMore} className="p-0 text-sm text-yellow-600">
          Read more
          <ArrowRight />
        </Button>
      </div>
    </div>
  )
}

export default BookmarkItem
