'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X, Filter, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/stores/uiStore'
import { useSearchStore } from '@/stores/searchStore'
import { useDebounce } from 'use-debounce'
import { searchBibleWithCounts } from '@/lib/bible-search'
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

export const SearchInput = ({
  placeholder = 'Search...',
  className,
  containerClassName,
  variant = 'default',
  autoFocus = false,
  onDebouncedChange,
  debounceDelay = 300,
  showResults = false,
}: SearchInputProps) =>{
  // Global state - shared across all components
  const { searchQuery, setSearchQuery, clearSearch } = useUIStore()
  const { searchResults, setSearchResultsWithCounts, isLoading, setLoading, selectedTestament, setSelectedTestament, selectedBook, setSelectedBook, totalMatches, bookCounts } = useSearchStore()
  const router = useRouter()
  
  // Local state - unique to this component instance
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [debouncedQuery] = useDebounce(searchQuery, debounceDelay)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleResultClick = (result: any) => {
    const bookData = books.find((b) => b.book_number === result.book_number)
    if (!bookData) return
    const bookId = bookData.book_name_en.replace(/ /g, "-").toLowerCase()
    const chapter = result.chapter || 1
    const verse = result.verse || 1
    const encodedSearch = encodeURIComponent(searchQuery)
    router.push(`/read-online/${bookId}/${chapter}?search=${encodedSearch}#v${verse}`)
    clearSearch()
    setShowDropdown(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Perform search when debounced query changes
  useEffect(() => {
    if (!showResults) {
      setShowDropdown(false)
      return
    }

    if (!debouncedQuery.trim()) {
      setSearchResultsWithCounts([], 0, {})
      setShowDropdown(false)
      return
    }

    setLoading(true)
    setShowDropdown(true)

    searchBibleWithCounts(
      debouncedQuery,
      100,
      selectedTestament === 'all' ? undefined : selectedTestament,
      selectedBook,
      15
    )
      .then((response) => {
        setSearchResultsWithCounts(response.results, response.totalMatches, response.bookCounts)
      })
      .catch((error) => {
        console.error('Search error:', error)
        setSearchResultsWithCounts([], 0, {})
      })
      .finally(() => {
        setLoading(false)
      })

    if (onDebouncedChange) {
      onDebouncedChange(debouncedQuery)
    }
  }, [debouncedQuery, showResults, setSearchResultsWithCounts, setLoading, selectedTestament, selectedBook, onDebouncedChange])

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // When search query is cleared from outside, hide dropdown
  useEffect(() => {
    if (!searchQuery.trim()) {
      setShowDropdown(false)
    }
  }, [searchQuery])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClear = () => {
    clearSearch()
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  const handleFocus = () => {
    if (showResults && searchQuery.trim()) {
      setShowDropdown(true)
    }
  }

  const getNoResultsMessage = () => {
    if (selectedBook) {
      const selectedBookData = books.find((b) => b.book_number === selectedBook)
      return `No matches in ${selectedBookData?.book_name_en}`
    }
    if (selectedTestament !== 'all') {
      const testamentName = selectedTestament === 'old' ? 'Old Testament' : 'New Testament'
      return `No matches in ${testamentName}`
    }
    return 'No results found in Bible'
  }

  const getSuggestionMessage = () => {
    if (searchQuery.length < 2) {
      return 'Type at least 2 characters to search'
    }
    if (selectedBook || selectedTestament !== 'all') {
      return 'Try adjusting your filters or search term'
    }
    return 'Try different keywords or check spelling'
  }

  const getFilteredBooks = () => {
    if (selectedTestament === 'all') return books
    return books.filter((b) => b.testament === selectedTestament)
  }

  const shouldShowDropdown = showResults && searchQuery.trim() !== '' && showDropdown

  return (
    <div ref={containerRef} className="relative w-full">

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
            value={searchQuery}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={placeholder}
            className={cn(
              'h-full flex-1 bg-gray-100 px-2 sm:px-3 md:px-4 py-2 focus:outline-none',
              className,
            )}
          />
          <div className="flex h-full items-center gap-1 px-1 sm:px-2">
            {searchQuery && (
              <button
                onClick={handleClear}
                className="flex items-center justify-center rounded-md p-1 sm:p-2 bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 hover:text-gray-900 cursor-pointer"
                aria-label="Clear search"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Panel - Below Search */}
      {showResults && searchQuery.trim() && showDropdown && (
        <div className="absolute top-full -left-2 right-0 mt-4 bg-white border rounded-lg shadow-md z-40">
          {/* Filter Header */}
          <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50 rounded-t-lg">
            <Filter size={16} className="text-red-900" />
            <span className="text-xs sm:text-sm font-semibold text-gray-700">Refine your search</span>
          </div>
          
          {/* Filter Options */}
          <div className="p-2 md:p-3 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 items-start sm:items-center">
            {/* Testament Filter */}
            <div className="flex gap-0.5 sm:gap-1 md:gap-2 w-full sm:w-auto">
            {['all', 'old', 'new'].map((test) => (
              <button
                key={test}
                onClick={() => setSelectedTestament(test as 'all' | 'old' | 'new')}
                className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded text-xs sm:text-sm md:text-base font-medium transition-colors ${
                  selectedTestament === test
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
              value={selectedBook || ''}
              onChange={(e) => setSelectedBook(e.target.value ? parseInt(e.target.value) : null)}
              className="px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded text-xs sm:text-sm md:text-base border border-gray-300 hover:border-gray-400 focus:border-red-900 focus:outline-none cursor-pointer w-full sm:w-auto"
            >
              <option value="">All Books</option>
              {getFilteredBooks().map((book: any) => (
                <option key={book.book_number} value={book.book_number}>
                  {book.book_name_en}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Search Results Dropdown */}
      {shouldShowDropdown && (
        <div className="absolute top-full left-0 right-0 max-h-96 overflow-y-auto rounded-lg border bg-white shadow-lg z-50" style={{marginTop: searchQuery.trim() && showResults ? '175px' : '3px'}}>
          {/* Loading State */}
          {isLoading && (
            <div className="p-6 text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-900 border-t-transparent"></div>
              </div>
              <p className="text-gray-600 text-sm mt-2">Searching Bible...</p>
            </div>
          )}

          {/* No Results State */}
          {!isLoading && searchResults.length === 0 && (
            <div className="p-6 text-center">
              <div className="inline-block mb-3">
                <div className="text-3xl">📖</div>
              </div>
              <p className="text-gray-900 font-medium text-sm mb-1">{getNoResultsMessage()}</p>
              <p className="text-gray-500 text-xs">{getSuggestionMessage()}</p>
              {(selectedBook || selectedTestament !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedTestament('all')
                    setSelectedBook(null)
                  }}
                  className="mt-3 text-xs text-red-900 hover:text-red-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Results State */}
          {!isLoading && searchResults.length > 0 && (
            <div>
              <div className="px-3 py-2 bg-gray-50 border-b text-xs text-gray-600 flex items-center justify-between">
                <span>
                  Showing {searchResults.length} of <strong>{totalMatches.toLocaleString()}</strong> verses
                </span>
                {totalMatches > searchResults.length && (
                  <button
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`)
                      setShowDropdown(false)
                    }}
                    className="flex items-center gap-1 text-red-900 hover:text-red-700 font-medium"
                  >
                    Show All <ChevronRight size={14} />
                  </button>
                )}
              </div>
              <div className="divide-y max-h-80 overflow-y-auto">
                {searchResults.map((result, idx) => (
                  <div
                    key={`${result.type}-${result.book_number}-${result.chapter}-${result.verse}-${idx}`}
                    onClick={() => handleResultClick(result)}
                    className="cursor-pointer p-3 hover:bg-red-50 transition-colors border-l-4 border-l-transparent hover:border-l-red-900"
                  >
                    {result.type === 'book' ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-red-900 text-base">{result.book_name_en}</div>
                          {result.book_name_am && (
                            <div className="text-sm text-gray-600 mt-1">{result.book_name_am}</div>
                          )}
                        </div>
                        {result.matchCount && result.matchCount > 0 && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                            {result.matchCount.toLocaleString()} verses
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-red-900 text-sm">
                            {result.book_short_name_en} {result.chapter}:{result.verse}
                          </span>
                          {bookCounts[result.book_number] && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              {bookCounts[result.book_number].count} verses in {result.book_short_name_en}
                            </span>
                          )}
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
              {/* Show All Button at Bottom */}
              {totalMatches > searchResults.length && (
                <div className="p-3 border-t bg-gray-50">
                  <button
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`)
                      setShowDropdown(false)
                    }}
                    className="w-full py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    Show All {totalMatches.toLocaleString()} Verses <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
