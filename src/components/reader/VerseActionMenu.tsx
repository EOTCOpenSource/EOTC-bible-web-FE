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
  isRead?: boolean // Whether this verse has been read (for visual feedback)
}

type SelectedVerseRange = {
  start: number
  end: number
  count: number
}

const VERSE_MENU_APPROX_WIDTH = 280
const VERSE_MENU_APPROX_HEIGHT = 56
const VERSE_MENU_EDGE_PADDING = 12

const clampVerseMenuPosition = (clientX: number, clientY: number) => {
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
}: VerseActionMenuProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState('')
  const { resolvedTheme } = useTheme()
  const highlightStyle = useMemo(() => {
    if (!highlightColor) return undefined

    const normalized = highlightColor.trim().toUpperCase()
    const withoutAlpha = normalized.length === 9 ? normalized.slice(0, 7) : normalized
    const isYellow = withoutAlpha === '#FFE062'

    const isDark =
      resolvedTheme === 'dark' ||
      (resolvedTheme == null && document?.documentElement?.classList?.contains('dark'))

    // Keep the exact background color, but ensure yellow remains readable in dark mode.
    // Only affects yellow; all other highlight colors remain untouched.
    if (isYellow && isDark) {
      return { backgroundColor: highlightColor, color: '#111827' } as const
    }

    return { backgroundColor: highlightColor } as const
  }, [highlightColor, resolvedTheme])
  const getDefaultRange = useCallback((): SelectedVerseRange => {
    const numericVerse = typeof verseNumber === 'number' ? verseNumber : parseInt(verseNumber, 10)
    const safeVerse = Number.isFinite(numericVerse) ? numericVerse : 0
    return {
      start: safeVerse,
      end: safeVerse,
      count: 1,
    }
  }, [verseNumber])

  const [selectedVerses, setSelectedVerses] = useState<SelectedVerseRange>(getDefaultRange)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)

  const verseRef = useRef<HTMLSpanElement>(null)
  const initialPositionSet = useRef(false)
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

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user
  }

  // Redirect to login and save return URL
  const redirectToLogin = () => {
    const currentPath = window.location.pathname + window.location.search + window.location.hash
    // Store the intended destination
    sessionStorage.setItem('redirectAfterLogin', currentPath)
    router.push('/login')
  }

  const existingHighlightForSelection = useMemo(() => {
    const chapterNumber = Number(chapter)
    if (!bookId || !Number.isFinite(chapterNumber)) return null

    return highlights.find((highlight) => {
      if (!highlight?.verseRef) return false
      const { book, chapter: highlightChapter, verseStart, verseCount } = highlight.verseRef
      if (!book || !Number.isFinite(highlightChapter) || !Number.isFinite(verseStart)) return false
      if (book.toLowerCase() !== bookId.toLowerCase() || highlightChapter !== chapterNumber)
        return false

      const range = selectedVerses ?? getDefaultRange()
      const currentVerseStart = Number(range.start)
      if (!Number.isFinite(currentVerseStart)) return false

      const count = Number(verseCount) || 1
      return currentVerseStart >= verseStart && currentVerseStart < verseStart + count
    })
  }, [bookId, chapter, highlights, selectedVerses, getDefaultRange])

  const verseReference = `${bookName} ${chapter}:${verseNumber}`.trim()

  // Keep these in sync with the actual stored colors (HighlightColor -> hex) so the rendered highlight
  // exactly matches the user-selected color in both light and dark mode.
  const highlightColors = ['#B61F21', '#FFE062', '#3BAD49', '#FF6A00', '#5778C5', '#704A6A']

  const handleHighlightSelection = async (colorHex: string) => {
    const verseRange = selectedVerses ?? getDefaultRange()
    const verseRef: VerseRef = {
      book: bookId,
      chapter: Number(chapter) || 1,
      verseStart: Number(verseRange.start),
      verseCount: Number(verseRange.count) || 1,
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
      resetSelectionState()
    } catch (error: any) {
      console.error('Failed to apply highlight:', error)
      // If unauthorized error from API, redirect to login
      if (error?.response?.status === 401 || error?.status === 401) {
        redirectToLogin()
      }
    }
  }

  // Helper function to find verse number from a DOM node
  const findVerseNumber = (node: Node | null): number | null => {
    let current = node as HTMLElement | null
    while (current && current !== document.body) {
      if (current.dataset && current.dataset.verse) {
        return parseInt(current.dataset.verse, 10)
      }
      current = current.parentElement
    }
    return null
  }

  // Helper function to get all selected verse numbers
  const getSelectedVerseRange = useCallback((selection: Selection) => {
    if (!selection || selection.rangeCount === 0) return null

    const range = selection.getRangeAt(0)
    const container = document.getElementById(containerId)

    if (!container) return null

    // Get all verse spans within the container
    const verseSpans = Array.from(container.querySelectorAll('[data-verse]'))
    const selectedVersesList: number[] = []

    verseSpans.forEach((span) => {
      const verseNum = parseInt((span as HTMLElement).dataset.verse || '0', 10)

      // Check if this verse span intersects with the selection
      if (selection.containsNode(span, true)) {
        selectedVersesList.push(verseNum)
      }
    })

    if (selectedVersesList.length === 0) {
      // Fallback: try to find verse from the selection's ancestor
      const startVerse = findVerseNumber(range.startContainer)
      const endVerse = findVerseNumber(range.endContainer)

      if (startVerse) selectedVersesList.push(startVerse)
      if (endVerse && endVerse !== startVerse) selectedVersesList.push(endVerse)
    }

    if (selectedVersesList.length === 0) return null

    // Sort and get range
    selectedVersesList.sort((a, b) => a - b)

    return {
      start: selectedVersesList[0],
      end: selectedVersesList[selectedVersesList.length - 1],
      count: selectedVersesList[selectedVersesList.length - 1] - selectedVersesList[0] + 1,
    }
  }, [containerId])
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) {
        setShowMenu(false)
        setShowColorPicker(false)
        setSelectedVerses(getDefaultRange())
        initialPositionSet.current = false
        return
      }

      const selectedTextContent = selection.toString().trim()
      const container = document.getElementById(containerId)

      if (container && selectedTextContent) {
        const range = selection.getRangeAt(0)
        const selectionContainer = range.commonAncestorContainer
        const isWithinContainer = container.contains(
          selectionContainer.nodeType === Node.TEXT_NODE
            ? selectionContainer.parentNode
            : selectionContainer,
        )

        if (isWithinContainer) {
          setSelectedText(selectedTextContent)
          // Get the verse range
          const verseRange = getSelectedVerseRange(selection)
          if (verseRange) {
            setSelectedVerses({
              start: verseRange.start,
              end: verseRange.end,
              count: verseRange.count,
            })
          } else {
            // Fallback to current verse if we can't determine range
            setSelectedVerses(getDefaultRange())
          }

          if (!initialPositionSet.current) {
            const rect = range.getBoundingClientRect()
            const clientX = rect.left + rect.width / 2
            const clientY = rect.top
            const position = clampVerseMenuPosition(clientX, clientY)
            setMenuPosition({
              top: position.top,
              left: position.left,
            })
            initialPositionSet.current = true
          }

          setShowMenu(true)
        } else {
          setShowMenu(false)
          setShowColorPicker(false)
          setSelectedVerses(getDefaultRange())
          initialPositionSet.current = false
        }
      } else {
        setShowMenu(false)
        setShowColorPicker(false)
        setSelectedVerses(getDefaultRange())
        initialPositionSet.current = false
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [containerId, getDefaultRange, getSelectedVerseRange])

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (showMenu) {
        const menuElement = document.querySelector('[data-verse-menu="true"]')
        if (menuElement && !menuElement.contains(e.target as Node)) {
          const selection = window.getSelection()
          if (!selection || selection.toString().trim() === '') {
            setShowMenu(false)
            setShowColorPicker(false)
          }
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [showMenu])

  const handleCopy = async () => {
    let textToCopy: string

    if (selectedVerses.count > 1) {
      textToCopy = `${bookName} ${chapter}:${selectedVerses.start}-${selectedVerses.end}\n"${selectedText}"`
    } else {
      textToCopy = selectedText
        ? `${verseReference}\n"${selectedText}"`
        : `${verseReference}\n${verseText}`
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
    let textToShare: string

    if (selectedVerses.count > 1) {
      textToShare = `${bookName} ${chapter}:${selectedVerses.start}-${selectedVerses.end}\n"${selectedText}"`
    } else {
      textToShare = selectedText
        ? `${verseReference}\n"${selectedText}"`
        : `${verseReference}\n${verseText}`
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title:
            selectedVerses.count > 1
              ? `${bookName} ${chapter}:${selectedVerses.start}-${selectedVerses.end}`
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
    if (bookId && chapter) {
      try {
        await addBookmark({
          book: bookId,
          chapter: Number(chapter),
          verseStart: Number(selectedVerses.start),
          verseCount: Number(selectedVerses.count),
        })
        resetSelectionState()
      } catch (error: any) {
        console.error('Failed to add bookmark:', error)
        // If unauthorized error from API, redirect to login
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

    const noteText =
      selectedVerses.count > 1
        ? `Verses ${selectedVerses.start}-${selectedVerses.end}: ${selectedText}`
        : selectedText || verseText

    onNote?.(selectedVerses.start, noteText)
    setIsNoteModalOpen(true)
  }

  const resetSelectionState = () => {
    setShowMenu(false)
    setShowColorPicker(false)
    setSelectedVerses(getDefaultRange())
    initialPositionSet.current = false
    window.getSelection()?.removeAllRanges()
  }

  const pressTimer = useRef<NodeJS.Timeout | null>(null)
  const isPressing = useRef(false)
  const pressStartPoint = useRef<{ x: number; y: number } | null>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    // If text is being selected natively on desktop, don't interrupt
    const selection = window.getSelection()
    if (selection && selection.toString().trim().length > 0) return

    isPressing.current = true
    const clientX = e.clientX
    const clientY = e.clientY
    pressStartPoint.current = { x: clientX, y: clientY }

    pressTimer.current = setTimeout(() => {
      if (!isPressing.current) return

      const verseNum = typeof verseNumber === 'number' ? verseNumber : parseInt(verseNumber as string, 10)
      setSelectedVerses({ start: verseNum, end: verseNum, count: 1 })
      setSelectedText(verseText)

      // Calculate position so the menu appears right above the user's finger
      setMenuPosition(clampVerseMenuPosition(clientX, clientY))

      setShowMenu(true)
    }, 500) // 500ms long press delay
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPressing.current || !pressStartPoint.current) return
    const dx = Math.abs(e.clientX - pressStartPoint.current.x)
    const dy = Math.abs(e.clientY - pressStartPoint.current.y)
    // Allow small finger jitter on mobile without canceling the long-press
    if (dx > 10 || dy > 10) cancelPress()
  }

  const cancelPress = () => {
    isPressing.current = false
    pressStartPoint.current = null
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
  }

  return (
    <>
      <span
        ref={verseRef}
        data-verse={verseNumber}
        id={`v${verseNumber}`}
        onPointerDown={handlePointerDown}
        onPointerUp={cancelPress}
        onPointerMove={handlePointerMove}
        onPointerCancel={cancelPress}
        onPointerLeave={cancelPress}
        onContextMenu={(e) => { e.preventDefault(); cancelPress() }}
        className={cn(
          'cursor-pointer select-none transition-colors',
          showMenu &&
            'bg-primary/20 dark:bg-primary/60 dark:ring-1 dark:ring-primary/40 rounded px-1 -mx-1',
        )}
        style={{
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
          touchAction: 'manipulation',
        }}
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

      {showMenu && (
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

              {/* Color picker  */}
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
                    {selectedVerses.count > 1
                      ? `verses ${selectedVerses.start}-${selectedVerses.end}`
                      : `verse ${selectedVerses.start}`}
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
          resetSelectionState()
        }}
        verseContext={{
          book: bookName,
          chapter: Number(chapter),
          verse: Number(selectedVerses.start),
          text: selectedText || verseText,
        }}
      />
    </>
  )
}
