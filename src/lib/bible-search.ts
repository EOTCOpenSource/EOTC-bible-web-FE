import { performBibleSearch } from '@/app/actions/search'
import type { SearchResult } from './search-types'

export async function searchBible(
  query: string,
  limit: number = 50,
  testament?: 'all' | 'old' | 'new',
  bookNumber?: number | null
): Promise<SearchResult[]> {
  return performBibleSearch(query, limit, testament, bookNumber)
}

export async function getBibleSuggestions(query: string, limit: number = 10): Promise<string[]> {
  if (!query.trim()) return []

  const results = await searchBible(query, limit)
  const suggestions = new Set<string>()

  results.forEach((result) => {
    if (result.type === 'book') {
      suggestions.add(result.book_name_en)
      suggestions.add(result.book_short_name_en)
    }
  })

  return Array.from(suggestions).slice(0, limit)
}
