'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useSearchStore } from '@/stores/searchStore'
import { useDebounce } from 'use-debounce'
import { searchBible } from '@/lib/bible-search'
import { cn } from '@/lib/utils'

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
  const { searchQuery, setSearchQuery, clearSearch } = useUIStore()
  const { searchResults, setSearchResults, isLoading, setLoading } = useSearchStore()
  const [debouncedQuery] = useDebounce(searchQuery, debounceDelay)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  // Trigger fuzzy search on debounced query
  useEffect(() => {
    if (debouncedQuery.trim() && showResults) {
      setLoading(true)
      searchBible(debouncedQuery, 20)
        .then((results) => {
          setSearchResults(results)
          setShowDropdown(true)
        })
        .catch((error) => console.error('Search error:', error))
        .finally(() => setLoading(false))
    } else {
      setSearchResults([])
      setShowDropdown(false)
    }

    if (onDebouncedChange) {
      onDebouncedChange(debouncedQuery)
    }
  }, [debouncedQuery, onDebouncedChange, showResults, setSearchResults, setLoading])

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

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
      clearSearch()
      setShowDropdown(false)
    }
  }

  const handleFocus = () => {
    if (searchQuery.trim() && showResults) {
      setShowDropdown(true)
    }
  }

  return (
    <div className="relative w-full">
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
              'h-full w-full bg-gray-100 px-4 py-2 pr-8 focus:outline-none',
              className,
            )}
          />
          {searchQuery && (
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
      {showResults && showDropdown && (searchResults.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-96 overflow-y-auto rounded-lg border bg-white shadow-lg z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : (
            <div className="divide-y">
              {searchResults.map((result, idx) => (
                <div
                  key={`${result.type}-${result.book_number}-${result.chapter}-${result.verse}-${idx}`}
                  className="cursor-pointer p-3 hover:bg-gray-100 transition-colors"
                >
                  {result.type === 'book' ? (
                    <div className="font-semibold text-red-900">
                      {result.book_name_en}
                      {result.book_name_am && <span className="text-sm ml-2">({result.book_name_am})</span>}
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold text-sm text-red-900">
                        {result.book_short_name_en} {result.chapter}:{result.verse}
                        {result.section_title && <span className="text-xs ml-2 opacity-70">— {result.section_title}</span>}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">{result.text}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
