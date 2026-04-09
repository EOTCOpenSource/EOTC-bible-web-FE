'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import clsx from 'clsx'
import { VerseActionMenu } from '@/components/reader/VerseActionMenu'
import { useHighlightsStore } from '@/stores/highlightsStore'
import { getHighlightInlineColor } from '@/lib/highlight-utils'
import { useEffect, useMemo, useRef, useState, TouchEvent } from 'react'
import type { HighlightColor } from '@/stores/types'
import { useSearchParams, useRouter } from 'next/navigation'
import type { VerseReadEvent } from '@/hooks/useReadingTracker'
import { useProgressStore } from '@/stores/progressStore'
import { useReadingTracker } from '@/hooks/useReadingTracker'

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
  const router = useRouter()
  const searchParams = useSearchParams()

  const { highlights, loadHighlights } = useHighlightsStore()
  const { progress, markChapterRead, syncVerseReadings, flushVerseQueue } = useProgressStore()
  const [animatedVerses, setAnimatedVerses] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState<string | null>(null)

  // SWIPE STATE
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50

  // Reading tracker - detects if user is actually reading
  const { setCurrentVerse, isVerseRead } = useReadingTracker({
    minReadDuration: 5000, // 5 seconds minimum on a verse to count as "read"
    minEngagementEvents: 2, // require multiple interactions while on a verse
    engagementWindow: 20000, // keep counting while user is plausibly reading
    idleTimeout: 30000, // 30 seconds of no activity = idle
    syncInterval: 10000, // Sync progress every 10 seconds
    onSyncProgress: async (verses) => {
      // Track chapter completion based on accumulated real reading.
      maybeMarkChapterCompleteFromReads(verses)
      await syncVerseReadings(verses)
    },
  })

  const chapterTotalVerses = useMemo(() => {
    return (
      chapterData.sections?.reduce((sum: number, s: any) => sum + (s.verses?.length || 0), 0) ?? 0
    )
  }, [chapterData.sections])

  const chapterReadStatsRef = useRef<{
    verseKeys: Set<number>
    activeMs: number
    completed: boolean
    reachedBottom: boolean
  }>({
    verseKeys: new Set<number>(),
    activeMs: 0,
    completed: false,
    reachedBottom: false,
  })

  useEffect(() => {
    chapterReadStatsRef.current = {
      verseKeys: new Set<number>(),
      activeMs: 0,
      completed: false,
      reachedBottom: false,
    }
  }, [bookId, chapterData.chapter])

  const isChapterAlreadyRead = useMemo(() => {
    const chapters = progress.chaptersRead?.[bookId] || []
    return chapters.includes(chapterData.chapter)
  }, [progress.chaptersRead, bookId, chapterData.chapter])

  const maybeCompleteChapter = async () => {
    if (chapterReadStatsRef.current.completed) return
    if (isChapterAlreadyRead) {
      chapterReadStatsRef.current.completed = true
      return
    }

    const uniqueVerses = chapterReadStatsRef.current.verseKeys.size
    const activeMs = chapterReadStatsRef.current.activeMs
    const minVerses = Math.max(3, Math.min(12, Math.ceil(chapterTotalVerses * 0.12)))

    // Two paths to completion:
    // - User reached near bottom AND demonstrated some reading.
    // - User stayed and read enough even without reaching bottom (e.g., very long/short screens).
    const passViaBottom =
      chapterReadStatsRef.current.reachedBottom && activeMs >= 45_000 && uniqueVerses >= minVerses
    const passViaTime = activeMs >= 120_000 && uniqueVerses >= Math.max(6, Math.ceil(minVerses * 1.5))

    if (!passViaBottom && !passViaTime) return

    try {
      await markChapterRead(bookId, chapterData.chapter)
      chapterReadStatsRef.current.completed = true
    } catch {
      // ignore; backend/auth errors handled by store
    }
  }

  const maybeMarkChapterCompleteFromReads = (verses: VerseReadEvent[]) => {
    if (!verses || verses.length === 0) return
    for (const v of verses) {
      if (v.bookId !== bookId) continue
      if (v.chapter !== chapterData.chapter) continue
      chapterReadStatsRef.current.verseKeys.add(v.verse)
      chapterReadStatsRef.current.activeMs += v.readDuration || 0
    }
    void maybeCompleteChapter()
  }

  // Verse visibility tracking (IntersectionObserver) - detects which verse is being viewed
  useEffect(() => {
    const verseElements = Array.from(document.querySelectorAll<HTMLElement>('[id^="v"]')).filter(
      (el) => /^v\d+$/.test(el.id),
    )

    if (verseElements.length === 0) return

    let current: number | null = null
    const ratios = new Map<number, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id
          const verseNum = parseInt(id.slice(1), 10)
          if (!Number.isFinite(verseNum)) continue

          if (!entry.isIntersecting) {
            ratios.delete(verseNum)
            continue
          }

          ratios.set(verseNum, entry.intersectionRatio)
        }

        let bestVerse: number | null = null
        let bestRatio = 0
        for (const [verseNum, ratio] of ratios.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestVerse = verseNum
          }
        }

        // Long verses can have low ratios; keep this threshold permissive.
        if (!bestVerse || bestRatio < 0.12) return

        if (current !== bestVerse) {
          current = bestVerse
          setCurrentVerse(bookId, chapterData.chapter, bestVerse)
        }
      },
      {
        root: null,
        // Focus on the middle band of the screen (like "what I'm reading now")
        rootMargin: '-20% 0px -20% 0px',
        threshold: [0, 0.05, 0.1, 0.15, 0.25, 0.5, 0.75, 1],
      },
    )

    for (const el of verseElements) observer.observe(el)

    return () => observer.disconnect()
  }, [bookId, chapterData.chapter, setCurrentVerse])

  useEffect(() => {
    flushVerseQueue().catch(() => {})
    loadHighlights()
  }, [bookId, chapterData.chapter, flushVerseQueue, loadHighlights])

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const maxScroll = doc.scrollHeight - doc.clientHeight
      if (maxScroll <= 0) return
      const pct = doc.scrollTop / maxScroll
      if (pct >= 0.9) {
        chapterReadStatsRef.current.reachedBottom = true
        void maybeCompleteChapter()
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [bookId, chapterData.chapter])


  useEffect(() => {
    const hash = window.location.hash
    const search = searchParams.get('search')

    if (search) {
      setSearchQuery(search)
    }

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

        // Clear search highlight after 15 seconds
        setTimeout(() => {
          setSearchQuery(null)
        }, 15000)
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
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && nextChapter) {
      router.push(`/read-online/${bookId}/${nextChapter}`)
    }
    if (isRightSwipe && prevChapter) {
      router.push(`/read-online/${bookId}/${prevChapter}`)
    }
  }

  const handleBookmark = (verse: number | string) => {
    console.log('Bookmark verse:', verse)
    // TODO: Implement bookmark logic - save to localStorage or database
  }

  const handleNote = (verse: number | string, text: string) => {
    console.log('Add note to verse:', verse, 'Text:', text)
    // TODO: Implement note dialog - could use a modal/dialog component
  }

  return (
    <div
      className="relative h-full w-full"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* LEFT ARROW */}
      <div
        className={clsx(
          'fixed top-1/2 z-10 -translate-y-1/2 transition-all',
          isSidebarOpen ? 'left-2 md:left-[312px]' : 'left-2 md:left-8 lg:left-32',
        )}
      >
        {prevChapter ? (
          <Link
            href={`/read-online/${bookId}/${prevChapter}`}
            className="block rounded-md bg-gray-200 dark:bg-gray-300 p-2 hover:bg-gray-300 dark:hover:bg-white text-black transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
        ) : (
          <div className="cursor-not-allowed rounded-md bg-gray-200 dark:bg-gray-300 p-2 opacity-50 text-black">
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
        <h1 className="mb-4 text-center text-2xl font-bold sm:text-3xl dark:text-white">
          {bookData.book_name_am + ' ' + chapterData.chapter}
        </h1>

        {chapterData.sections.map((section: any, sIndex: number) => {
          const sectionId = `section-${chapterData.chapter}-${sIndex}`

          return (
            <div key={sIndex}>
              {section.title && (
                <h3 className="mt-4 mb-2 text-center text-lg font-bold sm:text-xl dark:text-gray-200">
                  {section.title}
                </h3>
              )}

              <div id={sectionId} className="text-justify text-base sm:text-lg dark:text-gray-300 prose prose-gray dark:prose-invert max-w-none">
                {section.verses.map((verse: any) => {
                  const isRead = isVerseRead(bookId, chapterData.chapter, verse.verse)
                  return (
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
                      searchQuery={searchQuery || undefined}
                      isRead={isRead}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* RIGHT ARROW */}
      <div
        className={clsx(
          'fixed top-1/2 z-10 -translate-y-1/2 transition-all',
          isSidebarOpen ? 'right-2 md:right-6 lg:right-24' : 'right-2 md:right-8 lg:right-32',
        )}
      >
        {nextChapter ? (
          <Link
            href={`/read-online/${bookId}/${nextChapter}`}
            className="block rounded-md bg-gray-200 dark:bg-gray-300 p-2 hover:bg-gray-300 dark:hover:bg-white text-black transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </Link>
        ) : (
          <div className="cursor-not-allowed rounded-md bg-gray-200 dark:bg-gray-300 p-2 opacity-50 text-black">
            <ChevronRight className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  )
}
