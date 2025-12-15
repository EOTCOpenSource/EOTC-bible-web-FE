'use server'

import { promises as fs } from 'fs'
import path from 'path'
import Fuse from 'fuse.js'
import { SearchResult, SearchResponse, BibleBook } from '@/lib/search-types'
import { books } from '@/data/data'

export async function performBibleSearch(
  query: string,
  limit: number = 50,
  testament?: 'all' | 'old' | 'new',
  bookNumber?: number | null,
  perBookLimit: number = 10
): Promise<SearchResult[]> {
  const response = await performBibleSearchWithCounts(query, limit, testament, bookNumber, perBookLimit)
  return response.results
}

export async function performBibleSearchWithCounts(
  query: string,
  limit: number = 50,
  testament?: 'all' | 'old' | 'new',
  bookNumber?: number | null,
  perBookLimit: number = 10
): Promise<SearchResponse> {
  if (!query.trim()) return { results: [], totalMatches: 0, bookCounts: {} }

  try {
    const bibleDataPath = path.join(process.cwd(), 'src', 'data', 'bible-data')
    const searchItems: SearchResult[] = []
    const bookCounts: { [bookNumber: number]: { count: number; bookName: string; bookNameAm: string } } = {}

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
    const queryLower = query.toLowerCase()
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const jsonPath = path.join(bibleDataPath, file)
          const fileContent = await fs.readFile(jsonPath, 'utf8')
          const bookData: BibleBook = JSON.parse(fileContent)
          const bookInfo = filteredBooks.find((b) => b.book_number === bookData.book_number)

          if (bookInfo && bookData.chapters) {
            let bookMatchCount = 0
            
            bookData.chapters.forEach((chapter) => {
              chapter.sections?.forEach((section) => {
                section.verses?.forEach((verse) => {
                  // Count exact matches for this word in the verse
                  const textLower = verse.text?.toLowerCase() || ''
                  if (textLower.includes(queryLower) || verse.text?.includes(query)) {
                    bookMatchCount++
                  }
                  
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
            
            if (bookMatchCount > 0) {
              bookCounts[bookData.book_number] = {
                count: bookMatchCount,
                bookName: bookData.book_name_en,
                bookNameAm: bookData.book_name_am,
              }
            }
          }
        } catch (error) {
          console.error(`Failed to load Bible book file: ${file}`, error)
        }
      }
    }

    // Calculate total matches
    const totalMatches = Object.values(bookCounts).reduce((sum, b) => sum + b.count, 0)

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

    // Perform search with higher internal limit
    const results = fuse.search(query, { limit: Math.max(limit * 3, 500) })

    // Deduplicate and format results
    const seen = new Set<string>()
    const formatted: SearchResult[] = []

    // First add books with match counts
    results.forEach((result) => {
      if (result.item.type === 'book') {
        const key = `book-${result.item.book_number}`
        if (!seen.has(key)) {
          seen.add(key)
          const bookCount = bookCounts[result.item.book_number]
          formatted.push({
            ...result.item,
            matchCount: bookCount?.count || 0,
          })
        }
      }
    })

    // Then add verses (configurable per book limit)
    const versesByBook: { [key: number]: SearchResult[] } = {}
    results.forEach((result) => {
      if (result.item.type === 'verse') {
        const bookNum = result.item.book_number
        if (!versesByBook[bookNum]) {
          versesByBook[bookNum] = []
        }
        if (versesByBook[bookNum].length < perBookLimit) {
          versesByBook[bookNum].push(result.item)
        }
      }
    })

    Object.values(versesByBook).forEach((verses) => {
      formatted.push(...verses)
    })

    return {
      results: formatted.slice(0, limit),
      totalMatches,
      bookCounts,
    }
  } catch (error) {
    console.error('Search error:', error)
    return { results: [], totalMatches: 0, bookCounts: {} }
  }
}

export async function countWordOccurrences(
  query: string,
  testament?: 'all' | 'old' | 'new',
  bookNumber?: number | null
): Promise<{ total: number; bookCounts: { [bookNumber: number]: { count: number; bookName: string; bookNameAm: string } } }> {
  if (!query.trim()) return { total: 0, bookCounts: {} }

  try {
    const bibleDataPath = path.join(process.cwd(), 'src', 'data', 'bible-data')
    const bookCounts: { [bookNumber: number]: { count: number; bookName: string; bookNameAm: string } } = {}

    let filteredBooks = books
    if (testament && testament !== 'all') {
      filteredBooks = books.filter((b) => b.testament === testament)
    }
    if (bookNumber) {
      filteredBooks = books.filter((b) => b.book_number === bookNumber)
    }

    const files = await fs.readdir(bibleDataPath)
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const jsonPath = path.join(bibleDataPath, file)
          const fileContent = await fs.readFile(jsonPath, 'utf8')
          const bookData: BibleBook = JSON.parse(fileContent)
          const bookInfo = filteredBooks.find((b) => b.book_number === bookData.book_number)

          if (bookInfo && bookData.chapters) {
            let bookMatchCount = 0
            
            bookData.chapters.forEach((chapter) => {
              chapter.sections?.forEach((section) => {
                section.verses?.forEach((verse) => {
                  const text = verse.text || ''
                  // Count occurrences of the word in this verse
                  const matches = text.split(query).length - 1
                  bookMatchCount += matches
                })
              })
            })
            
            if (bookMatchCount > 0) {
              bookCounts[bookData.book_number] = {
                count: bookMatchCount,
                bookName: bookData.book_name_en,
                bookNameAm: bookData.book_name_am,
              }
            }
          }
        } catch (error) {
          console.error(`Failed to load Bible book file: ${file}`, error)
        }
      }
    }

    const total = Object.values(bookCounts).reduce((sum, b) => sum + b.count, 0)
    return { total, bookCounts }
  } catch (error) {
    console.error('Count error:', error)
    return { total: 0, bookCounts: {} }
  }
}
