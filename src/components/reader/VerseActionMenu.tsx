'use client'

import { Bookmark, MessageSquare, Share2, Copy, Highlighter, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useState, useEffect, useRef, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useBookmarksStore } from '@/stores/bookmarksStore'
import { useHighlightsStore } from '@/stores/highlightsStore'
import { hexToHighlightColor } from '@/lib/highlight-utils'
import type { VerseRef } from '@/stores/types'

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
}

type SelectedVerseRange = {
  start: number
  end: number
  count: number
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
}: VerseActionMenuProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState('')
  const getDefaultRange = (): SelectedVerseRange => {
    const numericVerse = typeof verseNumber === 'number' ? verseNumber : parseInt(verseNumber, 10)
    const safeVerse = Number.isFinite(numericVerse) ? numericVerse : 0
    return {
      start: safeVerse,
      end: safeVerse,
      count: 1,
    }
  }

  const [selectedVerses, setSelectedVerses] = useState<SelectedVerseRange>(getDefaultRange)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const verseRef = useRef<HTMLSpanElement>(null)
  const initialPositionSet = useRef(false)

  const { addBookmark } = useBookmarksStore()
  const { highlights, addHighlight, changeColor } = useHighlightsStore()

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
      const verseNumber = Number(range.start)
      if (!Number.isFinite(verseNumber)) return false

      const count = Number(verseCount) || 1
      return verseNumber >= verseStart && verseNumber < verseStart + count
    })
  }, [bookId, chapter, highlights, selectedVerses])

  const verseReference = `${bookName} ${chapter}:${verseNumber}`.trim()

  const highlightColors = ['#621B1C', '#FFE062', '#3BAD49', '#FF4B26', '#5778C5', '#704A6A']

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
      const isUnauthorized = error?.response?.status === 401
      console.error('Failed to apply highlight:', error)
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
  const getSelectedVerseRange = (selection: Selection) => {
    if (!selection || selection.rangeCount === 0) return null

    const range = selection.getRangeAt(0)
    const container = document.getElementById(containerId)

    if (!container) return null

    // Get all verse spans within the container
    const verseSpans = Array.from(container.querySelectorAll('[data-verse]'))
    const selectedVerses: number[] = []

    verseSpans.forEach((span) => {
      const verseNum = parseInt((span as HTMLElement).dataset.verse || '0', 10)

      // Check if this verse span intersects with the selection
      if (selection.containsNode(span, true)) {
        selectedVerses.push(verseNum)
      }
    })

    if (selectedVerses.length === 0) {
      // Fallback: try to find verse from the selection's ancestor
      const startVerse = findVerseNumber(range.startContainer)
      const endVerse = findVerseNumber(range.endContainer)

      if (startVerse) selectedVerses.push(startVerse)
      if (endVerse && endVerse !== startVerse) selectedVerses.push(endVerse)
    }

    if (selectedVerses.length === 0) return null

    // Sort and get range
    selectedVerses.sort((a, b) => a - b)

    return {
      start: selectedVerses[0],
      end: selectedVerses[selectedVerses.length - 1],
      count: selectedVerses[selectedVerses.length - 1] - selectedVerses[0] + 1,
    }
  }
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
            setMenuPosition({
              top: rect.top + window.scrollY - 50,
              left: rect.left + window.scrollX + rect.width / 2,
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
  }, [containerId, verseNumber])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
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
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
      } catch (error) {
        console.error('Failed to add bookmark:', error)
      }
    }
    resetSelectionState()
  }

  const handleNote = () => {
    const noteText =
      selectedVerses.count > 1
        ? `Verses ${selectedVerses.start}-${selectedVerses.end}: ${selectedText}`
        : selectedText || verseText

    onNote?.(selectedVerses.start, noteText)
    resetSelectionState()
  }

  const resetSelectionState = () => {
    setShowMenu(false)
    setShowColorPicker(false)
    setSelectedVerses(getDefaultRange())
    initialPositionSet.current = false
    window.getSelection()?.removeAllRanges()
  }

  return (
    <>
      <span ref={verseRef} data-verse={verseNumber} id={`v${verseNumber}`}>
        <sup className="mr-1 text-xs sm:text-xs md:text-xs">{verseNumber}</sup>
        <span
          className={cn(
            'transition-colors duration-200',
            highlightColor && 'rounded px-1 py-0.5',
            shouldAnimate && 'highlight-verse-animation',
          )}
          style={
            highlightColor
              ? {
                  backgroundColor: highlightColor,
                  opacity: 0.6,
                }
              : undefined
          }
        >
          {verseText}{' '}
        </span>
      </span>

      {showMenu && (
        <div
          data-verse-menu="true"
          className="animate-in fade-in slide-in-from-top-2 fixed z-50 duration-200"
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
    </>
  )
}
