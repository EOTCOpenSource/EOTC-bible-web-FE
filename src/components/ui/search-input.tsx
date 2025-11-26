'use client'

import { useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  placeholder?: string
  className?: string
  containerClassName?: string
  variant?: 'default' | 'compact'
  autoFocus?: boolean
  onDebouncedChange?: (value: string) => void
  debounceDelay?: number
}

export function SearchInput({
  placeholder = 'Search...',
  className,
  containerClassName,
  variant = 'default',
  autoFocus = false,
  onDebouncedChange,
  debounceDelay = 300,
}: SearchInputProps) {
  const { searchQuery, setSearchQuery, clearSearch } = useUIStore()
  const debouncedQuery = useDebounce(searchQuery, debounceDelay)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (onDebouncedChange) {
      onDebouncedChange(debouncedQuery)
    }
  }, [debouncedQuery, onDebouncedChange])

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
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      clearSearch()
    }
  }

  return (
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
  )
}
