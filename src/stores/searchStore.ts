import { create } from 'zustand'
import type { SearchResult } from '@/lib/search-types'

interface SearchState {
  isLoading: boolean
  searchResults: SearchResult[]
  selectedResultIndex: number | null
  selectedTestament: 'all' | 'old' | 'new'
  selectedBook: number | null
  
  setLoading: (loading: boolean) => void
  setSearchResults: (results: SearchResult[]) => void
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

  setLoading: (loading) => set({ isLoading: loading }),
  setSearchResults: (results) => set({ searchResults: results, selectedResultIndex: null }),
  setSelectedResultIndex: (index) => set({ selectedResultIndex: index }),
  setSelectedTestament: (testament) => set({ selectedTestament: testament, selectedBook: null }),
  setSelectedBook: (bookNumber) => set({ selectedBook: bookNumber }),
  clearResults: () => set({ searchResults: [], selectedResultIndex: null }),
  clearFilters: () => set({ selectedTestament: 'all', selectedBook: null }),
}))
