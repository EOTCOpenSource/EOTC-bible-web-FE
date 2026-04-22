'use client'

import { Share2, Bookmark, Copy, Highlighter, MessageSquare, Check } from 'lucide-react'
import { AddNoteModal } from '@/components/notes/AddNoteModal'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useBookmarksStore } from '@/stores/bookmarksStore'
import { useHighlightsStore } from '@/stores/highlightsStore'
import { useUserStore } from '@/lib/stores/useUserStore'
import { hexToHighlightColor } from '@/lib/highlight-utils'
import type { VerseRef } from '@/stores/types'
import { useTheme } from 'next-themes'

export type SelectedVerseRange = {
  start: number
  end: number
  count: number
}

interface VerseActionMenuProps {
  verseNumber: number | string
  verseText: string
  bookId: string
  bookName: string
  chapter: number | string
  containerId: string
  onNote?: (verse: number | string, text: string) => void
  onBookmark?: (verse: number | string) => void
  onHighlight?: (verse: number | string, color: string) => void
  highlightColor?: string
  highlightId?: string
  shouldAnimate?: boolean
  searchQuery?: string
  isRead?: boolean
  /** Controlled selection range (managed by parent for multi-verse support) */
  selectedRange?: SelectedVerseRange | null
  /** Called when the user clicks this verse */
  onVerseClick?: (verseNum: number, clientX: number, clientY: number) => void
  /** When true the action menu is visible (parent decides) */
  showMenu?: boolean
  menuPosition?: { top: number; left: number }
  onCloseMenu?: () => void
}

const VERSE_MENU_APPROX_WIDTH = 280
const VERSE_MENU_APPROX_HEIGHT = 56
const VERSE_MENU_EDGE_PADDING = 12

export const clampVerseMenuPosition = (clientX: number, clientY: number) => {
  const halfWidth = VERSE_MENU_APPROX_WIDTH / 2
  const minLeft = halfWidth + VERSE_MENU_EDGE_PADDING
  const maxLeft = Math.max(minLeft, window.innerWidth - halfWidth - VERSE_MENU_EDGE_PADDING)

  const preferredTop = clientY - 64
  const fallbackTop = clientY + 24
  const unclampedTop = preferredTop < VERSE_MENU_EDGE_PADDING ? fallbackTop : preferredTop
  const minTop = VERSE_MENU_EDGE_PADDING
  const maxTop = Math.max(minTop, window.innerHeight - VERSE_MENU_APPROX_HEIGHT - VERSE_MENU_EDGE_PADDING)

  return {
    left: Math.min(maxLeft, Math.max(minLeft, clientX)),
    top: Math.min(maxTop, Math.max(minTop, unclampedTop)),
  }
}

export const VerseActionMenu = ({
  verseNumber,
  verseText,
  bookId,
  bookName,
  chapter,
  containerId,
  onNote,
  highlightColor,
  highlightId,
  shouldAnimate = false,
  searchQuery,
  isRead = false,
  selectedRange,
  onVerseClick,
  showMenu = false,
  menuPosition = { top: 0, left: 0 },
  onCloseMenu,
}: VerseActionMenuProps) => {
  const { resolvedTheme } = useTheme()

  const highlightStyle = useMemo(() => {
    if (!highlightColor) return undefined

    const normalized = highlightColor.trim().toUpperCase()
    const withoutAlpha = normalized.length === 9 ? normalized.slice(0, 7) : normalized
    const isYellow = withoutAlpha === '#FFE062'

    const isDark =
      resolvedTheme === 'dark' ||
      (resolvedTheme == null && document?.documentElement?.classList?.contains('dark'))

    if (isYellow && isDark) {
      return { backgroundColor: highlightColor, color: '#111827' } as const
    }

    return { backgroundColor: highlightColor } as const
  }, [highlightColor, resolvedTheme])

  const numericVerse = typeof verseNumber === 'number' ? verseNumber : parseInt(verseNumber as string, 10)

  // Derive whether THIS verse is within the selected range
  const isSelected =
    showMenu &&
    selectedRange != null &&
    numericVerse >= selectedRange.start &&
    numericVerse <= selectedRange.end

  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)

  const router = useRouter()

  const { addBookmark } = useBookmarksStore()
  const { highlights, addHighlight, changeColor } = useHighlightsStore()
  const { user, loadSession } = useUserStore()

  const renderTextWithHighlight = (text: string, query?: string) => {
    if (!query || !text.toLowerCase().includes(query.toLowerCase())) {
      return text
    }

    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))

    return parts.map((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return (
          <mark key={index} className="search-word-highlight">
            {part}
          </mark>
        )
      }
      return part
    })
  }

  // Load session on mount if not already loaded
  useEffect(() => {
    if (!user) {
      loadSession().catch(() => {
        // User not authenticated, but they can still read
      })
    }
  }, [user, loadSession])

  const isAuthenticated = () => !!user

  const redirectToLogin = () => {
    const currentPath = window.location.pathname + window.location.search + window.location.hash
    sessionStorage.setItem('redirectAfterLogin', currentPath)
    router.push('/login')
  }

  const existingHighlightForSelection = useMemo(() => {
    const chapterNumber = Number(chapter)
    if (!bookId || !Number.isFinite(chapterNumber)) return null

    const range = selectedRange ?? { start: numericVerse, end: numericVerse, count: 1 }

    return highlights.find((highlight) => {
      if (!highlight?.verseRef) return false
      const { book, chapter: highlightChapter, verseStart, verseCount } = highlight.verseRef
      if (!book || !Number.isFinite(highlightChapter) || !Number.isFinite(verseStart)) return false
      if (book.toLowerCase() !== bookId.toLowerCase() || highlightChapter !== chapterNumber) return false

      const currentVerseStart = Number(range.start)
      if (!Number.isFinite(currentVerseStart)) return false

      const count = Number(verseCount) || 1
      return currentVerseStart >= verseStart && currentVerseStart < verseStart + count
    })
  }, [bookId, chapter, highlights, selectedRange, numericVerse])

  const verseReference = `${bookName} ${chapter}:${verseNumber}`.trim()

  const highlightColors = ['#B61F21', '#FFE062', '#3BAD49', '#FF6A00', '#5778C5', '#704A6A']

  const handleHighlightSelection = async (colorHex: string) => {
    const range = selectedRange ?? { start: numericVerse, end: numericVerse, count: 1 }
    const verseRef: VerseRef = {
      book: bookId,
      chapter: Number(chapter) || 1,
      verseStart: Number(range.start),
      verseCount: Number(range.count) || 1,
    }

    const color = hexToHighlightColor(colorHex)

    try {
      const resolvedHighlightId = highlightId || existingHighlightForSelection?._id
      if (highlightId) {
        await changeColor(highlightId, color)
      } else if (resolvedHighlightId) {
        await changeColor(resolvedHighlightId, color)
      } else {
        await addHighlight(verseRef, color)
      }
      onCloseMenu?.()
      setShowColorPicker(false)
    } catch (error: any) {
      console.error('Failed to apply highlight:', error)
      if (error?.response?.status === 401 || error?.status === 401) {
        redirectToLogin()
      }
    }
  }

  const handleCopy = async () => {
    const range = selectedRange ?? { start: numericVerse, end: numericVerse, count: 1 }
    let textToCopy: string

    if (range.count > 1) {
      textToCopy = `${bookName} ${chapter}:${range.start}-${range.end}\n"${verseText}"`
    } else {
      textToCopy = `${verseReference}\n${verseText}`
    }

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    const range = selectedRange ?? { start: numericVerse, end: numericVerse, count: 1 }
    let textToShare: string

    if (range.count > 1) {
      textToShare = `${bookName} ${chapter}:${range.start}-${range.end}\n"${verseText}"`
    } else {
      textToShare = `${verseReference}\n${verseText}`
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title:
            range.count > 1
              ? `${bookName} ${chapter}:${range.start}-${range.end}`
              : verseReference,
          text: textToShare,
        })
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err)
        }
      }
    } else {
      handleCopy()
    }
  }

  const handleBookmark = async () => {
    const range = selectedRange ?? { start: numericVerse, end: numericVerse, count: 1 }
    if (bookId && chapter) {
      try {
        await addBookmark({
          book: bookId,
          chapter: Number(chapter),
          verseStart: Number(range.start),
          verseCount: Number(range.count),
        })
        onCloseMenu?.()
      } catch (error: any) {
        console.error('Failed to add bookmark:', error)
        if (error?.response?.status === 401 || error?.status === 401) {
          redirectToLogin()
        }
      }
    }
  }

  const handleNote = () => {
    if (!isAuthenticated()) {
      redirectToLogin()
      return
    }
    const range = selectedRange ?? { start: numericVerse, end: numericVerse, count: 1 }
    const noteText =
      range.count > 1
        ? `Verses ${range.start}-${range.end}: ${verseText}`
        : verseText

    onNote?.(range.start, noteText)
    setIsNoteModalOpen(true)
  }

  // Single click handler — delegates to parent
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onVerseClick?.(numericVerse, e.clientX, e.clientY)
  }

  // Close color picker whenever the menu closes
  useEffect(() => {
    if (!showMenu) setShowColorPicker(false)
  }, [showMenu])

  const range = selectedRange ?? { start: numericVerse, end: numericVerse, count: 1 }

  return (
    <>
      <span
        data-verse={verseNumber}
        id={`v${verseNumber}`}
        onClick={handleClick}
        className={cn(
          'cursor-pointer transition-colors',
          isSelected &&
            'bg-primary/20 dark:bg-primary/60 dark:ring-1 dark:ring-primary/40 rounded px-1 -mx-1',
        )}
      >
        <sup className="mr-1 text-xs sm:text-xs md:text-xs">{verseNumber}</sup>
        <span
          className={cn(
            'transition-colors duration-200 relative',
            highlightColor && 'rounded px-1 py-0.5',
            shouldAnimate && 'highlight-verse-animation',
            isRead && 'read-verse',
          )}
          style={highlightStyle}
        >
          {renderTextWithHighlight(verseText, searchQuery)}
          {isRead && (
            <span className="absolute -right-3 top-0.5 text-[10px] text-green-600 dark:text-green-400 opacity-60">
              ✓
            </span>
          )}{' '}
        </span>
      </span>

      {/* The floating menu is rendered only by the "anchor" verse (the first selected) */}
      {showMenu && numericVerse === range.start && (
        <div
          data-verse-menu="true"
          className="animate-in fade-in slide-in-from-top-2 fixed z-[100] duration-200"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="bg-background border-border relative inline-flex items-center gap-1 rounded-lg border p-1.5 shadow-lg">
            <TooltipProvider delayDuration={100}>
              {/* Highlight */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 h-8 w-8"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  >
                    <Highlighter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Highlight</span>
                </TooltipContent>
              </Tooltip>

              {/* Color picker */}
              {showColorPicker && (
                <div className="absolute top-[115%] left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-full bg-white p-2 pb-3 shadow-lg dark:bg-neutral-800">
                  {highlightColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleHighlightSelection(color)}
                      className="h-6 w-6 rounded-full border border-gray-300 transition hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}

              {/* Bookmark */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 h-8 w-8"
                    onClick={handleBookmark}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>
                    Bookmark{' '}
                    {range.count > 1
                      ? `verses ${range.start}-${range.end}`
                      : `verse ${range.start}`}
                  </span>
                </TooltipContent>
              </Tooltip>

              {/* Copy */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'hover:bg-primary/10 h-8 w-8',
                      copied && 'bg-green-100 dark:bg-green-900',
                    )}
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </TooltipContent>
              </Tooltip>

              {/* Share */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'hover:bg-primary/10 h-8 w-8',
                      shared && 'bg-blue-100 dark:bg-blue-900',
                    )}
                    onClick={handleShare}
                  >
                    {shared ? (
                      <Check className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{shared ? 'Shared!' : 'Share'}</span>
                </TooltipContent>
              </Tooltip>

              {/* Notes */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 h-8 w-8"
                    onClick={handleNote}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Note</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false)
          onCloseMenu?.()
        }}
        verseContext={{
          book: bookName,
          chapter: Number(chapter),
          verse: Number(range.start),
          text: verseText,
        }}
      />
    </>
  )
}
