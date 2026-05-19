'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useOfflineStore } from '@/stores/offlineStore'
import { CloudOff, CheckCircle2, Download } from 'lucide-react'
import { useLocale } from 'next-intl'

interface Book {
  name: string
  nameAm: string
  id: string
  book_number: number
  testament: string
}

function BookLink({ book, isDownloaded }: { book: Book; isDownloaded: boolean }) {
  const locale = useLocale()
  return (
    <Link
      href={`/read-online/${book.id}/1`}
      className="group block rounded-md border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-colors hover:bg-gray-50 dark:border-[#521c1f] dark:bg-[#1f090a] dark:text-gray-200 dark:hover:bg-[#4a1c1e]"
    >
      <div className="flex items-center justify-between gap-2">
        <span>{locale === 'am' ? book.nameAm : book.name}</span>
        {isDownloaded && (
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            title="Available offline"
          >
            <CheckCircle2 className="h-3 w-3" />
            <span className="hidden sm:inline">Offline</span>
          </span>
        )}
      </div>
    </Link>
  )
}

function TestamentSection({
  title,
  bookList,
  downloadedBooks,
}: {
  title: string
  bookList: Book[]
  downloadedBooks: string[]
}) {
  const downloadedCount = bookList.filter((b) => downloadedBooks.includes(b.id)).length

  return (
    <div className="flex-1">
      <div className="mb-6 flex items-center justify-center gap-2">
        <span className="font-serif text-2xl text-yellow-600 dark:text-[#C59B4E]">❖</span>
        <h2 className="text-center text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {downloadedCount > 0 && (
        <div className="mb-3 flex items-center justify-center gap-1.5">
          <CloudOff className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            {downloadedCount}/{bookList.length} available offline
          </span>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {bookList.map((book) => (
          <BookLink key={book.id} book={book} isDownloaded={downloadedBooks.includes(book.id)} />
        ))}
      </div>
    </div>
  )
}

export default function ReadOnlineClient() {
  const [oldTestament, setOldTestament] = useState<Book[]>([])
  const [newTestament, setNewTestament] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { downloadedBooks, refreshDownloadedBooks } = useOfflineStore()
  const isOnline = useOfflineStore((s) => s.isOnline)

  useEffect(() => {
    refreshDownloadedBooks()
  }, [refreshDownloadedBooks])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books')
        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }
        const data = await response.json()
        setOldTestament(data.oldTestament)
        setNewTestament(data.newTestament)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching books:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent">
        <p className="text-gray-600 dark:text-gray-400">Loading books...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent">
        <div className="text-center">
          <p className="mb-4 text-red-600 dark:text-red-400">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-reverse min-h-[calc(100vh-80px)] w-full bg-[#FFFDF8] p-6 sm:p-8 md:p-12 dark:bg-[#321315]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
            Online EOTC Bible
          </h1>
          <p className="text-base text-gray-600 sm:text-lg dark:text-gray-300">
            Explore the Ethiopian Bible with 81 books. <br className="hidden sm:block" /> Choose a
            book to start reading.
          </p>
          {downloadedBooks.length > 0 ? (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <CloudOff className="h-3.5 w-3.5" />
              {downloadedBooks.length} book{downloadedBooks.length !== 1 ? 's' : ''} available
              offline
            </div>
          ) : (
            <Link
              href="/dashboard/offline"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#4C0E0F]/10 px-3 py-1 text-xs font-bold text-[#4C0E0F] transition-colors hover:bg-[#4C0E0F]/20 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
            >
              <Download className="h-3.5 w-3.5" />
              Download for offline reading
            </Link>
          )}
        </div>

        {/* Testament Sections - Side by Side on Desktop */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Old Testament Section */}
          {oldTestament.length > 0 && (
            <TestamentSection
              title="Old Testament"
              bookList={oldTestament}
              downloadedBooks={downloadedBooks}
            />
          )}

          {/* New Testament Section */}
          {newTestament.length > 0 && (
            <TestamentSection
              title="New Testament"
              bookList={newTestament}
              downloadedBooks={downloadedBooks}
            />
          )}
        </div>
      </div>
    </div>
  )
}
