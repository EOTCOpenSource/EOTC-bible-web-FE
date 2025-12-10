import { create } from 'zustand'
import type { SearchResult } from '@/lib/search-types'

interface BookCount {
  count: number
  bookName: string
  bookNameAm: string
}

interface SearchState {
  isLoading: boolean
  searchResults: SearchResult[]
  selectedResultIndex: number | null
  selectedTestament: 'all' | 'old' | 'new'
  selectedBook: number | null
  totalMatches: number
  bookCounts: { [bookNumber: number]: BookCount }
  
  setLoading: (loading: boolean) => void
  setSearchResults: (results: SearchResult[]) => void
  setSearchResultsWithCounts: (results: SearchResult[], totalMatches: number, bookCounts: { [bookNumber: number]: BookCount }) => void
  setSelectedResultIndex: (index: number | null) => void
  setSelectedTestament: (testament: 'all' | 'old' | 'new') => void
  setSelectedBook: (bookNumber: number | null) => void
  clearResults: () => void
  clearFilters: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  isLoading: false,
  searchResults: [],
  selectedResultIndex: null,
  selectedTestament: 'all',
  selectedBook: null,
  totalMatches: 0,
  bookCounts: {},

  setLoading: (loading) => set({ isLoading: loading }),
  setSearchResults: (results) => set({ searchResults: results, selectedResultIndex: null }),
  setSearchResultsWithCounts: (results, totalMatches, bookCounts) => set({ 
    searchResults: results, 
    selectedResultIndex: null,
    totalMatches,
    bookCounts,
  }),
  setSelectedResultIndex: (index) => set({ selectedResultIndex: index }),
  setSelectedTestament: (testament) => set({ selectedTestament: testament, selectedBook: null }),
  setSelectedBook: (bookNumber) => set({ selectedBook: bookNumber }),
  clearResults: () => set({ searchResults: [], selectedResultIndex: null, totalMatches: 0, bookCounts: {} }),
  clearFilters: () => set({ selectedTestament: 'all', selectedBook: null }),
}))
