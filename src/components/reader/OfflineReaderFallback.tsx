'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useOfflineStore } from '@/stores/offlineStore'
import { getBookData } from '@/lib/offlineDb'
import { books as allBooks } from '@/data/data'
import { CloudOff, Download, BookOpen, Loader2, WifiOff } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ReaderClient from '@/app/read-online/[bookId]/[chapter]/reader-client'

interface OfflineReaderFallbackProps {
  bookId: string
  chapter: string
  children: ReactNode
}

/**
 * Wraps the server-rendered reader page.
 *
 * - **Online**: renders `children` (the normal SSR content).
 * - **Offline + book cached**: loads from IndexedDB and renders `ReaderClient`.
 * - **Offline + not cached**: shows a friendly "not available" message.
 *
 * Because the parent `page.tsx` is a server component, when the user is truly
 * offline the server can't render the page at all — Next.js will show its
 * offline error. This component only helps when the page shell *has* been
 * cached (e.g. by the browser's bfcache or a service worker) but the data
 * fetch would fail.  For client-side navigations it intercepts before the
 * server round-trip.
 */
export default function OfflineReaderFallback({
  bookId,
  chapter,
  children,
}: OfflineReaderFallbackProps) {
  const isOnline = useOfflineStore((s) => s.isOnline)
  const downloadedBooks = useOfflineStore((s) => s.downloadedBooks)

  // Local state for routing when offline
  const [offlineBookId, setOfflineBookId] = useState(bookId)
  const [offlineChapter, setOfflineChapter] = useState(chapter)

  const [offlineData, setOfflineData] = useState<{
    bookData: any
    chapterData: any
    prevChapter: number | null
    nextChapter: number | null
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isBookCached = downloadedBooks.includes(offlineBookId)
  const chapterNum = parseInt(offlineChapter, 10)

  // Sync state with props when online (Next.js navigation works)
  useEffect(() => {
    if (isOnline) {
      setOfflineBookId(bookId)
      setOfflineChapter(chapter)
    }
  }, [isOnline, bookId, chapter])

  // Handle offline navigation events emitted by ReaderClient
  useEffect(() => {
    const handleOfflineNavigate = (e: Event) => {
      const customEvent = e as CustomEvent<{ bookId?: string; chapter?: string }>
      if (customEvent.detail.bookId) setOfflineBookId(customEvent.detail.bookId)
      if (customEvent.detail.chapter) setOfflineChapter(customEvent.detail.chapter)
    }

    const handlePopState = () => {
      if (!useOfflineStore.getState().isOnline) {
        // Fallback popstate handling if offline: extract from URL
        const match = window.location.pathname.match(/\/read-online\/([^/]+)\/([^/]+)/)
        if (match) {
          setOfflineBookId(match[1])
          setOfflineChapter(match[2])
        }
      }
    }

    window.addEventListener('offlineNavigate', handleOfflineNavigate)
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('offlineNavigate', handleOfflineNavigate)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  // When offline, try to load from IndexedDB
  useEffect(() => {
    if (isOnline) {
      // Reset offline data when coming back online
      setOfflineData(null)
      setError(null)
      return
    }

    if (!isBookCached) {
      setError('not-downloaded')
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const bookData = await getBookData(bookId)
        if (cancelled) return

        if (!bookData) {
          setError('data-missing')
          return
        }

        const chapterData = bookData.chapters?.find((c: any) => c.chapter === chapterNum)

        if (!chapterData) {
          setError('chapter-missing')
          return
        }

        const totalChapters = bookData.chapters.length
        const prevChapter = chapterNum > 1 ? chapterNum - 1 : null
        const nextChapter = chapterNum < totalChapters ? chapterNum + 1 : null

        setOfflineData({ bookData, chapterData, prevChapter, nextChapter })
      } catch (err) {
        console.error('Failed to load offline data:', err)
        if (!cancelled) setError('load-failed')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isOnline, isBookCached, offlineBookId, chapterNum])

  // ── Online: render server content normally ──
  if (isOnline && !offlineData) {
    return <>{children}</>
  }

  // ── Offline: loading state ──
  if (loading) {
    return <OfflineLoadingState />
  }

  // ── Offline: error states ──
  if (error) {
    return <OfflineErrorState error={error} bookId={bookId} />
  }

  // ── Offline: render from cached data ──
  if (offlineData) {
    return (
      <div className="relative">
        {/* Offline mode badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="pointer-events-none sticky top-20 z-30 flex justify-center"
        >
          <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/90 px-3 py-1 shadow-lg backdrop-blur-md">
            <CloudOff className="h-3 w-3 text-amber-400" />
            <span className="text-xs font-medium text-amber-200">Offline Mode</span>
          </div>
        </motion.div>

        <ReaderClient
          bookData={offlineData.bookData}
          chapterData={offlineData.chapterData}
          prevChapter={offlineData.prevChapter}
          nextChapter={offlineData.nextChapter}
          bookId={offlineBookId}
        />
      </div>
    )
  }

  // Fallback: just render children
  return <>{children}</>
}

// ── Sub-components ──────────────────────────────────────────────────────────

function OfflineLoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/20 to-amber-600/10">
            <BookOpen className="h-8 w-8 text-amber-400" />
          </div>
          <Loader2 className="absolute -right-1 -bottom-1 h-5 w-5 animate-spin text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Loading offline content...</h3>
          <p className="mt-1 text-sm text-gray-400">Reading from your downloaded Bible data</p>
        </div>
      </motion.div>
    </div>
  )
}

function OfflineErrorState({ error, bookId }: { error: string; bookId: string }) {
  const bookMeta = allBooks.find((b) => b.book_name_en.replace(/ /g, '-').toLowerCase() === bookId)
  const bookName = bookMeta?.book_name_en || bookId.replace(/-/g, ' ')

  const messages: Record<string, { title: string; description: string }> = {
    'not-downloaded': {
      title: `${bookName} not available offline`,
      description:
        "This book hasn't been downloaded yet. Connect to the internet or download it from the Offline Manager.",
    },
    'data-missing': {
      title: 'Cached data not found',
      description:
        "The downloaded data appears to be missing. Try re-downloading this book when you're back online.",
    },
    'chapter-missing': {
      title: 'Chapter not found',
      description:
        "This specific chapter wasn't found in the cached data. Try re-downloading the book.",
    },
    'load-failed': {
      title: 'Failed to load offline data',
      description: 'Something went wrong while reading from local storage. Please try again.',
    },
  }

  const msg = messages[error] || messages['load-failed']

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-900/80 to-gray-800/60 p-8 text-center backdrop-blur-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/20 to-red-600/10">
            <WifiOff className="h-8 w-8 text-red-400" />
          </div>

          <h3 className="text-xl font-bold text-white">{msg.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-400">{msg.description}</p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/dashboard/offline"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-500"
            >
              <Download className="h-4 w-4" />
              Open Offline Manager
            </Link>
            <Link
              href="/read-online"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
            >
              <BookOpen className="h-4 w-4" />
              Browse All Books
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
