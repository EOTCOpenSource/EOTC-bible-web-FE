'use client'

import { Bookmark, MessageSquare, Share2, Copy, Highlighter, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface VerseActionMenuProps {
  verseNumber: number | string
  verseText: string
  bookName?: string
  chapter?: number | string
  containerId: string
  onBookmark?: (verse: number | string) => void
  onNote?: (verse: number | string, text: string) => void
  onHighlight?: (verse: number | string, selectedText: string, color?: string) => void
}

export const VerseActionMenu = ({
  verseNumber,
  verseText,
  bookName = '',
  chapter = '',
  containerId,
  onBookmark,
  onNote,
  onHighlight,
}: VerseActionMenuProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const [selectedText, setSelectedText] = useState('')
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const verseRef = useRef<HTMLSpanElement>(null)
  const initialPositionSet = useRef(false)

  const verseReference = `${bookName} ${chapter}:${verseNumber}`.trim()

  const highlightColors = ['#621B1C', '#FFE062', '#3BAD49', '#FF4B26', '#5778C5', '#704A6A']

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) {
        setShowMenu(false)
        setShowColorPicker(false)
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
          initialPositionSet.current = false
        }
      } else {
        setShowMenu(false)
        setShowColorPicker(false)
        initialPositionSet.current = false
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [containerId])

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
    const textToCopy = selectedText
      ? `${verseReference}\n"${selectedText}"`
      : `${verseReference}\n${verseText}`

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    const textToShare = selectedText
      ? `${verseReference}\n"${selectedText}"`
      : `${verseReference}\n${verseText}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: verseReference,
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

  const handleBookmark = () => {
    onBookmark?.(verseNumber)
    setShowMenu(false)
    setShowColorPicker(false)
    initialPositionSet.current = false
    window.getSelection()?.removeAllRanges()
  }

  const handleNote = () => {
    onNote?.(verseNumber, selectedText || verseText)
    setShowMenu(false)
    setShowColorPicker(false)
    initialPositionSet.current = false
    window.getSelection()?.removeAllRanges()
  }

  return (
    <>
      <span ref={verseRef} data-verse={verseNumber}>
        <sup className="mr-1 text-xs sm:text-xs md:text-xs">{verseNumber}</sup>
        <span>{verseText} </span>
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
          <div className="relative bg-background border-border inline-flex items-center gap-1 rounded-lg border p-1.5 shadow-lg">
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
                <div className="absolute left-1/2 top-[115%] z-50 flex -translate-x-1/2 gap-2 rounded-full bg-white p-2 pb-3 shadow-lg dark:bg-neutral-800">
                  {highlightColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        onHighlight?.(verseNumber, selectedText || verseText, color)
                        setShowColorPicker(false)
                        setShowMenu(false)
                        initialPositionSet.current = false
                        window.getSelection()?.removeAllRanges()
                      }}
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
                  <span>Bookmark</span>
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
