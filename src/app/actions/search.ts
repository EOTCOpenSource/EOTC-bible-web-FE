'use server'

import { promises as fs } from 'fs'
import path from 'path'
import Fuse from 'fuse.js'
import { SearchResult, BibleBook } from '@/lib/search-types'
import { books } from '@/data/data'

export async function performBibleSearch(
  query: string,
  limit: number = 50,
  testament?: 'all' | 'old' | 'new',
  bookNumber?: number | null
): Promise<SearchResult[]> {
  if (!query.trim()) return []

  try {
    const bibleDataPath = path.join(process.cwd(), 'src', 'data', 'bible-data')
    const searchItems: SearchResult[] = []

    // Filter books based on testament and book selection
    let filteredBooks = books
    if (testament && testament !== 'all') {
      filteredBooks = books.filter((b) => b.testament === testament)
    }
    if (bookNumber) {
      filteredBooks = books.filter((b) => b.book_number === bookNumber)
    }

    // Start with book titles
    searchItems.push(
      ...filteredBooks.map((book) => ({
        type: 'book' as const,
        book_number: book.book_number,
        book_name_en: book.book_name_en,
        book_name_am: book.book_name_am,
        book_short_name_en: book.book_short_name_en,
      }))
    )

    // Read all Bible books and index verses
    const files = await fs.readdir(bibleDataPath)
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const jsonPath = path.join(bibleDataPath, file)
          const fileContent = await fs.readFile(jsonPath, 'utf8')
          const bookData: BibleBook = JSON.parse(fileContent)
          const bookInfo = filteredBooks.find((b) => b.book_number === bookData.book_number)

          if (bookInfo && bookData.chapters) {
            bookData.chapters.forEach((chapter) => {
              chapter.sections?.forEach((section) => {
                section.verses?.forEach((verse) => {
                  searchItems.push({
                    type: 'verse',
                    book_number: bookData.book_number,
                    book_name_en: bookData.book_name_en,
                    book_name_am: bookData.book_name_am,
                    book_short_name_en: bookData.book_short_name_en,
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
          console.error(`Failed to load Bible book file: ${file}`, error)
        }
      }
    }

    // Create Fuse index
    const fuse = new Fuse(searchItems, {
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

    // Perform search
    const results = fuse.search(query, { limit: limit * 2 })

    // Deduplicate and format results
    const seen = new Set<string>()
    const formatted: SearchResult[] = []

    // First add books
    results.forEach((result) => {
      if (result.item.type === 'book') {
        const key = `book-${result.item.book_number}`
        if (!seen.has(key)) {
          seen.add(key)
          formatted.push(result.item)
        }
      }
    })

    // Then add verses (max 5 per book)
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
      formatted.push(...verses)
    })

    return formatted.slice(0, limit)
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}
