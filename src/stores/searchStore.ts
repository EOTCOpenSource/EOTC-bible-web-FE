import { create } from 'zustand'
import type { SearchResult } from '@/lib/search-types'

interface SearchState {
  isLoading: boolean
  searchResults: SearchResult[]
  selectedResultIndex: number | null
  
  setLoading: (loading: boolean) => void
  setSearchResults: (results: SearchResult[]) => void
  setSelectedResultIndex: (index: number | null) => void
  clearResults: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  isLoading: false,
  searchResults: [],
  selectedResultIndex: null,

  setLoading: (loading) => set({ isLoading: loading }),
  setSearchResults: (results) => set({ searchResults: results, selectedResultIndex: null }),
  setSelectedResultIndex: (index) => set({ selectedResultIndex: index }),
  clearResults: () => set({ searchResults: [], selectedResultIndex: null }),
}))
