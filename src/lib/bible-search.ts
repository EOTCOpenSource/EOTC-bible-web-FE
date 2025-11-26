import Fuse from 'fuse.js'
import { books } from '@/data/data'
import type { SearchResult, BibleBook } from './search-types'

let fuseIndex: Fuse<SearchResult> | null = null
let searchItems: SearchResult[] = []

// Build search index from all Bible books
async function buildSearchIndex(): Promise<Fuse<SearchResult>> {
  if (fuseIndex) return fuseIndex

  // Start with book titles
  searchItems = books.map((book) => ({
    type: 'book' as const,
    book_number: book.book_number,
    book_name_en: book.book_name_en,
    book_name_am: book.book_name_am,
    book_short_name_en: book.book_short_name_en,
  }))

  // Import all Bible books dynamically and index verses
  for (const book of books) {
    try {
      const bibleBook = await import(`@/data/bible-data/${book.file_name}.json`)
      const bookData: BibleBook = bibleBook.default || bibleBook

      if (bookData.chapters) {
        bookData.chapters.forEach((chapter) => {
          chapter.sections?.forEach((section) => {
            section.verses?.forEach((verse) => {
              searchItems.push({
                type: 'verse',
                book_number: book.book_number,
                book_name_en: book.book_name_en,
                book_name_am: book.book_name_am,
                book_short_name_en: book.book_short_name_en,
                chapter: chapter.chapter,
                verse: verse.verse,
                text: verse.text,
                section_title: section.title,
              })
            })
          })
        })
      }
    } catch (error) {
      console.error(`Failed to load Bible book: ${book.file_name}`, error)
    }
  }

  // Create Fuse index with options
  fuseIndex = new Fuse(searchItems, {
    keys: [
      { name: 'book_name_en', weight: 0.8 },
      { name: 'book_name_am', weight: 0.8 },
      { name: 'book_short_name_en', weight: 0.7 },
      { name: 'text', weight: 0.6 },
      { name: 'section_title', weight: 0.5 },
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2,
    useExtendedSearch: true,
  })

  return fuseIndex
}

// Search Bible content
export async function searchBible(query: string, limit: number = 50): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const fuse = await buildSearchIndex()
  const results = fuse.search(query, { limit })

  // Deduplicate: group verses by book, show unique books first
  const seen = new Set<string>()
  const filtered: SearchResult[] = []

  // First add books (deduplicated)
  results.forEach((result) => {
    if (result.item.type === 'book') {
      const key = `book-${result.item.book_number}`
      if (!seen.has(key)) {
        seen.add(key)
        filtered.push(result.item)
      }
    }
  })

  // Then add verses (limit to 5 per book to avoid overwhelming results)
  const versesByBook: { [key: number]: SearchResult[] } = {}
  results.forEach((result) => {
    if (result.item.type === 'verse') {
      const bookNum = result.item.book_number
      if (!versesByBook[bookNum]) {
        versesByBook[bookNum] = []
      }
      if (versesByBook[bookNum].length < 5) {
        versesByBook[bookNum].push(result.item)
      }
    }
  })

  Object.values(versesByBook).forEach((verses) => {
    filtered.push(...verses)
  })

  return filtered.slice(0, limit)
}

// Get suggestions for autocomplete
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
