'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useSearchStore } from '@/stores/searchStore'
import { useDebounce } from 'use-debounce'
import { searchBible } from '@/lib/bible-search'
import { cn } from '@/lib/utils'
import { books } from '@/data/data'

interface SearchInputProps {
  placeholder?: string
  className?: string
  containerClassName?: string
  variant?: 'default' | 'compact'
  autoFocus?: boolean
  onDebouncedChange?: (value: string) => void
  debounceDelay?: number
  showResults?: boolean
}

export function SearchInput({
  placeholder = 'Search...',
  className,
  containerClassName,
  variant = 'default',
  autoFocus = false,
  onDebouncedChange,
  debounceDelay = 300,
  showResults = false,
}: SearchInputProps) {
  // Local component state - completely isolated
  const [localInput, setLocalInput] = useState('')
  const [localResults, setLocalResults] = useState<any[]>([])
  const [localLoading, setLocalLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [localTestament, setLocalTestament] = useState<'all' | 'old' | 'new'>('all')
  const [localBook, setLocalBook] = useState<number | null>(null)
  
  const [debouncedInput] = useDebounce(localInput, debounceDelay)
  const inputRef = useRef<HTMLInputElement>(null)

  // Search when debounced input changes
  useEffect(() => {
    if (!showResults) {
      setShowDropdown(false)
      return
    }

    if (!debouncedInput.trim()) {
      setLocalResults([])
      setShowDropdown(false)
      return
    }

    setLocalLoading(true)
    setShowDropdown(true)

    searchBible(
      debouncedInput,
      20,
      localTestament === 'all' ? undefined : localTestament,
      localBook
    )
      .then((results) => {
        setLocalResults(results)
      })
      .catch((error) => {
        console.error('Search error:', error)
        setLocalResults([])
      })
      .finally(() => {
        setLocalLoading(false)
      })
  }, [debouncedInput, showResults, localTestament, localBook])

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalInput(e.target.value)
  }

  const handleClear = () => {
    setLocalInput('')
    setLocalResults([])
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  const handleFocus = () => {
    if (showResults && localInput.trim()) {
      setShowDropdown(true)
    }
  }

  const shouldShowDropdown = showResults && localInput.trim() !== '' && showDropdown

  const getFilteredBooks = () => {
    if (localTestament === 'all') return books
    return books.filter((b) => b.testament === localTestament)
  }

  const getNoResultsMessage = () => {
    if (localBook) {
      const bookData = books.find((b) => b.book_number === localBook)
      return `No matches in ${bookData?.book_name_en}`
    }
    if (localTestament !== 'all') {
      const testamentName = localTestament === 'old' ? 'Old Testament' : 'New Testament'
      return `No matches in ${testamentName}`
    }
    return 'No results found in Bible'
  }

  const getSuggestionMessage = () => {
    if (localInput.length < 2) {
      return 'Type at least 2 characters to search'
    }
    if (localBook || localTestament !== 'all') {
      return 'Try adjusting your filters or search term'
    }
    return 'Try different keywords or check spelling'
  }

  return (
    <div className="relative w-full">
      {showResults && (
        <div className="mb-3 flex flex-wrap gap-2">
          {/* Testament Filter */}
          <div className="flex gap-2">
            {['all', 'old', 'new'].map((test) => (
              <button
                key={test}
                onClick={() => setLocalTestament(test as 'all' | 'old' | 'new')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  localTestament === test
                    ? 'bg-red-900 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {test === 'all' ? 'All' : test === 'old' ? 'OT' : 'NT'}
              </button>
            ))}
          </div>

          {/* Book Filter */}
          <select
            value={localBook || ''}
            onChange={(e) => setLocalBook(e.target.value ? parseInt(e.target.value) : null)}
            className="px-3 py-1 rounded text-sm border border-gray-300 hover:border-gray-400 cursor-pointer"
          >
            <option value="">All Books</option>
            {getFilteredBooks().map((book: any) => (
              <option key={book.book_number} value={book.book_number}>
                {book.book_name_en}
              </option>
            ))}
          </select>
        </div>
      )}

      <div
        className={cn(
          'flex items-center overflow-hidden rounded-lg border',
          variant === 'compact' ? 'h-[38px]' : 'h-[42px]',
          containerClassName,
        )}
      >
        <div className="flex h-full items-center bg-red-900 p-3">
          <Search className="text-white" size={variant === 'compact' ? 18 : 20} />
        </div>
        <div className="relative flex h-full flex-1 items-center">
          <input
            ref={inputRef}
            type="text"
            value={localInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={placeholder}
            className={cn(
              'h-full w-full bg-gray-100 px-4 py-2 pr-8 focus:outline-none',
              className,
            )}
          />
          {localInput && (
            <button
              onClick={handleClear}
              className="absolute right-2 rounded-full p-1 hover:bg-gray-200"
              aria-label="Clear search"
            >
              <X size={16} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {shouldShowDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-96 overflow-y-auto rounded-lg border bg-white shadow-lg z-50">
          {/* Loading State */}
          {localLoading && (
            <div className="p-6 text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-900 border-t-transparent"></div>
              </div>
              <p className="text-gray-600 text-sm mt-2">Searching Bible...</p>
            </div>
          )}

          {/* No Results State */}
          {!localLoading && localResults.length === 0 && (
            <div className="p-6 text-center">
              <div className="inline-block mb-3">
                <div className="text-3xl">📖</div>
              </div>
              <p className="text-gray-900 font-medium text-sm mb-1">{getNoResultsMessage()}</p>
              <p className="text-gray-500 text-xs">{getSuggestionMessage()}</p>
              {(localBook || localTestament !== 'all') && (
                <button
                  onClick={() => {
                    setLocalTestament('all')
                    setLocalBook(null)
                  }}
                  className="mt-3 text-xs text-red-900 hover:text-red-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Results State */}
          {!localLoading && localResults.length > 0 && (
            <div>
              <div className="px-3 py-2 bg-gray-50 border-b text-xs text-gray-600">
                {localResults.length} result{localResults.length !== 1 ? 's' : ''} found
              </div>
              <div className="divide-y">
                {localResults.map((result, idx) => (
                  <div
                    key={`${result.type}-${result.book_number}-${result.chapter}-${result.verse}-${idx}`}
                    className="cursor-pointer p-3 hover:bg-red-50 transition-colors border-l-4 border-l-transparent hover:border-l-red-900"
                  >
                    {result.type === 'book' ? (
                      <div>
                        <div className="font-semibold text-red-900 text-base">{result.book_name_en}</div>
                        {result.book_name_am && (
                          <div className="text-sm text-gray-600 mt-1">{result.book_name_am}</div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-red-900 text-sm">
                            {result.book_short_name_en} {result.chapter}:{result.verse}
                          </span>
                          {result.section_title && (
                            <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded">
                              {result.section_title}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-700 leading-relaxed line-clamp-2 pl-1">
                          "{result.text}"
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
