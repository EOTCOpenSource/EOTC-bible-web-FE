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
    const matchingVerses: SearchResult[] = []
    const matchingBooks: SearchResult[] = []
    const bookCounts: { [bookNumber: number]: { count: number; bookName: string; bookNameAm: string } } = {}

    // Filter books based on testament and book selection
    let filteredBooks = books
    if (testament && testament !== 'all') {
      filteredBooks = books.filter((b) => b.testament === testament)
    }
    if (bookNumber) {
      filteredBooks = books.filter((b) => b.book_number === bookNumber)
    }

    const queryLower = query.toLowerCase()

    // Check for book name matches using Fuse.js
    const bookItems = filteredBooks.map((book) => ({
      type: 'book' as const,
      book_number: book.book_number,
      book_name_en: book.book_name_en,
      book_name_am: book.book_name_am,
      book_short_name_en: book.book_short_name_en,
    }))

    const bookFuse = new Fuse(bookItems, {
      keys: [
        { name: 'book_name_en', weight: 0.8 },
        { name: 'book_name_am', weight: 0.8 },
        { name: 'book_short_name_en', weight: 0.7 },
      ],
      threshold: 0.3,
      includeScore: true,
    })

    const bookResults = bookFuse.search(query, { limit: 10 })

    // Read all Bible books and find exact verse matches
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
                  const textLower = text.toLowerCase()
                  
                  // Use exact text matching (includes) for verses
                  if (text.includes(query) || textLower.includes(queryLower)) {
                    bookMatchCount++
                    matchingVerses.push({
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
                  }
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

    // Format results
    const formatted: SearchResult[] = []

    // First add matching books with match counts
    bookResults.forEach((result) => {
      const bookCount = bookCounts[result.item.book_number]
      matchingBooks.push({
        ...result.item,
        matchCount: bookCount?.count || 0,
      })
    })

    // Also add books that have verse matches but weren't found by book name search
    Object.keys(bookCounts).forEach((bookNumStr) => {
      const bookNum = parseInt(bookNumStr)
      if (!matchingBooks.find((b) => b.book_number === bookNum)) {
        const bookInfo = filteredBooks.find((b) => b.book_number === bookNum)
        if (bookInfo) {
          matchingBooks.push({
            type: 'book',
            book_number: bookInfo.book_number,
            book_name_en: bookInfo.book_name_en,
            book_name_am: bookInfo.book_name_am,
            book_short_name_en: bookInfo.book_short_name_en,
            matchCount: bookCounts[bookNum].count,
          })
        }
      }
    })

    // Sort books by book number (Biblical order)
    matchingBooks.sort((a, b) => a.book_number - b.book_number)
    formatted.push(...matchingBooks)

    // Sort ALL matching verses by book number, chapter, and verse (Biblical order)
    matchingVerses.sort((a, b) => {
      if (a.book_number !== b.book_number) {
        return a.book_number - b.book_number
      }
      if (a.chapter !== b.chapter) {
        return (a.chapter || 0) - (b.chapter || 0)
      }
      return (a.verse || 0) - (b.verse || 0)
    })

    // Apply per-book limit after sorting
    const versesByBook: { [key: number]: SearchResult[] } = {}
    matchingVerses.forEach((verse) => {
      const bookNum = verse.book_number
      if (!versesByBook[bookNum]) {
        versesByBook[bookNum] = []
      }
      if (versesByBook[bookNum].length < perBookLimit) {
        versesByBook[bookNum].push(verse)
      }
    })

    // Add verses in Biblical order
    const sortedBookNumbers = Object.keys(versesByBook)
      .map((n) => parseInt(n))
      .sort((a, b) => a - b)

    sortedBookNumbers.forEach((bookNum) => {
      formatted.push(...versesByBook[bookNum])
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
