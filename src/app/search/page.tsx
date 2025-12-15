'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, ArrowLeft, BookOpen, Filter } from 'lucide-react'
import { searchBibleWithCounts } from '@/lib/bible-search'
import type { SearchResult } from '@/lib/search-types'
import { books } from '@/data/data'

interface BookCount {
  count: number
  bookName: string
  bookNameAm: string
}

const SearchPageContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  
  const [results, setResults] = useState<SearchResult[]>([])
  const [totalMatches, setTotalMatches] = useState(0)
  const [bookCounts, setBookCounts] = useState<{ [key: number]: BookCount }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTestament, setSelectedTestament] = useState<'all' | 'old' | 'new'>('all')
  const [selectedBook, setSelectedBook] = useState<number | null>(null)
  const [displayLimit, setDisplayLimit] = useState(50)

  useEffect(() => {
    if (!query) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    searchBibleWithCounts(
      query,
      selectedBook ? 1000 : 500,
      selectedTestament === 'all' ? undefined : selectedTestament,
      selectedBook,
      selectedBook ? 200 : 50
    )
      .then((response) => {
        setResults(response.results)
        setTotalMatches(response.totalMatches)
        setBookCounts(response.bookCounts)
      })
      .catch((error) => {
        console.error('Search error:', error)
        setResults([])
        setTotalMatches(0)
        setBookCounts({})
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [query, selectedTestament, selectedBook])

  const handleResultClick = (result: SearchResult) => {
    const bookData = books.find((b) => b.book_number === result.book_number)
    if (!bookData) return
    const bookId = bookData.book_name_en.replace(/ /g, "-").toLowerCase()
    const chapter = result.chapter || 1
    router.push(`/read-online/${bookId}/${chapter}`)
  }

  const getFilteredBooks = () => {
    if (selectedTestament === 'all') return books
    return books.filter((b) => b.testament === selectedTestament)
  }

  const sortedBookCounts = Object.entries(bookCounts)
    .map(([bookNum, data]) => ({ bookNumber: parseInt(bookNum), ...data }))
    .sort((a, b) => b.count - a.count)

  const displayedResults = results.slice(0, displayLimit)
  const hasMore = results.length > displayLimit

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">No search query</h2>
          <p className="text-gray-500 mt-2">Enter a search term to find verses</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                Search Results for "{query}"
              </h1>
              {!isLoading && (
                <p className="text-sm text-gray-600">
                  Found in <strong>{totalMatches.toLocaleString()}</strong> verses across the Bible
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-red-900" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>
            <div className="flex gap-1">
              {['all', 'old', 'new'].map((test) => (
                <button
                  key={test}
                  onClick={() => {
                    setSelectedTestament(test as 'all' | 'old' | 'new')
                    setSelectedBook(null)
                    setDisplayLimit(50)
                  }}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedTestament === test
                      ? 'bg-red-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {test === 'all' ? 'All' : test === 'old' ? 'Old Testament' : 'New Testament'}
                </button>
              ))}
            </div>
            <select
              value={selectedBook || ''}
              onChange={(e) => {
                setSelectedBook(e.target.value ? parseInt(e.target.value) : null)
                setDisplayLimit(50)
              }}
              className="px-3 py-1 rounded text-sm border border-gray-300 hover:border-gray-400 focus:border-red-900 focus:outline-none"
            >
              <option value="">All Books</option>
              {getFilteredBooks().map((book) => (
                <option key={book.book_number} value={book.book_number}>
                  {book.book_name_en}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-4 sticky top-32">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-red-900" />
                Verses by Book
              </h3>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {sortedBookCounts.length === 0 ? (
                    <p className="text-sm text-gray-500">No matches found</p>
                  ) : (
                    sortedBookCounts.map((book) => (
                      <button
                        key={book.bookNumber}
                        onClick={() => {
                          setSelectedBook(book.bookNumber)
                          setDisplayLimit(50)
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded text-sm flex items-center justify-between transition-colors ${
                          selectedBook === book.bookNumber
                            ? 'bg-red-100 text-red-900'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <span className="truncate">{book.bookName}</span>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium ml-2 flex-shrink-0">
                          {book.count.toLocaleString()} verses
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
              {selectedBook && (
                <button
                  onClick={() => setSelectedBook(null)}
                  className="mt-3 text-sm text-red-900 hover:text-red-700 font-medium"
                >
                  Clear book filter
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-900 border-t-transparent"></div>
                </div>
                <p className="text-gray-600 mt-4">Searching Bible...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-lg font-semibold text-gray-900">No results found</h3>
                <p className="text-gray-500 mt-2">
                  Try different keywords or adjust your filters
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border">
                <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Showing {displayedResults.length} of {results.length} results
                    {selectedBook && (
                      <span className="ml-2 text-red-900">
                        ({bookCounts[selectedBook]?.count || 0} total in this book)
                      </span>
                    )}
                  </span>
                </div>
                <div className="divide-y">
                  {displayedResults.map((result, idx) => (
                    <div
                      key={`${result.type}-${result.book_number}-${result.chapter}-${result.verse}-${idx}`}
                      onClick={() => handleResultClick(result)}
                      className="cursor-pointer p-4 hover:bg-red-50 transition-colors border-l-4 border-l-transparent hover:border-l-red-900"
                    >
                      {result.type === 'book' ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-red-900 text-lg">{result.book_name_en}</div>
                            {result.book_name_am && (
                              <div className="text-sm text-gray-600 mt-1">{result.book_name_am}</div>
                            )}
                          </div>
                          {result.matchCount && result.matchCount > 0 && (
                            <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                              {result.matchCount.toLocaleString()} verses
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-red-900">
                              {result.book_name_en} {result.chapter}:{result.verse}
                            </span>
                            {result.section_title && (
                              <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded">
                                {result.section_title}
                              </span>
                            )}
                          </div>
                          <div className="text-gray-700 leading-relaxed">
                            {result.text}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {hasMore && (
                  <div className="p-4 border-t bg-gray-50">
                    <button
                      onClick={() => setDisplayLimit((prev) => prev + 50)}
                      className="w-full py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
                    >
                      Load More Results
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-900 border-t-transparent"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
