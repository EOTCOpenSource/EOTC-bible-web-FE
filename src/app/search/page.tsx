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
      selectedBook ? 200 : 50,
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
    const bookId = bookData.book_name_en.replace(/ /g, '-').toLowerCase()
    const chapter = result.chapter || 1
    const verse = result.verse || 1
    const searchQuery = encodeURIComponent(query)
    router.push(`/read-online/${bookId}/${chapter}?search=${searchQuery}#v${verse}`)
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Search size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-700">No search query</h2>
          <p className="mt-2 text-gray-500">Enter a search term to find verses</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 rounded-lg bg-[#4C0E0F] px-4 py-2 text-white hover:bg-red-800"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="search-page-bg min-h-screen">
      <div className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="mb-4 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Search Results for "{query}"</h1>
              {!isLoading && (
                <p className="text-sm text-gray-600">
                  Found in <strong>{totalMatches.toLocaleString()}</strong> verses across the Bible
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[#4C0E0F]" />
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
                  className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                    selectedTestament === test
                      ? 'bg-[#4C0E0F] text-white'
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
              className="rounded border border-gray-300 px-3 py-1 text-sm hover:border-gray-400 focus:border-[#4C0E0F] focus:outline-none"
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

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="sticky top-32 rounded-lg border bg-white p-4">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                <BookOpen size={18} className="text-[#4C0E0F]" />
                Verses by Book
              </h3>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 animate-pulse rounded bg-gray-100" />
                  ))}
                </div>
              ) : (
                <div className="max-h-96 space-y-1 overflow-y-auto">
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
                        className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm transition-colors ${
                          selectedBook === book.bookNumber
                            ? 'bg-red-100 text-[#4C0E0F]'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <span className="truncate">{book.bookName}</span>
                        <span className="ml-2 flex-shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
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
                  className="mt-3 text-sm font-medium text-[#4C0E0F] hover:text-red-700"
                >
                  Clear book filter
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="rounded-lg border bg-white p-8 text-center">
                <div className="inline-block">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4C0E0F] border-t-transparent"></div>
                </div>
                <p className="mt-4 text-gray-600">Searching Bible...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-lg border bg-white p-8 text-center">
                <div className="mb-4 text-4xl">📖</div>
                <h3 className="text-lg font-semibold text-gray-900">No results found</h3>
                <p className="mt-2 text-gray-500">Try different keywords or adjust your filters</p>
              </div>
            ) : (
              <div className="rounded-lg border bg-white">
                <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-600">
                    Showing {displayedResults.length} of {results.length} results
                    {selectedBook && (
                      <span className="ml-2 text-[#4C0E0F]">
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
                      className="cursor-pointer border-l-4 border-l-transparent p-4 transition-colors hover:border-l-[#4C0E0F] hover:bg-red-50"
                    >
                      {result.type === 'book' ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-semibold text-[#4C0E0F]">
                              {result.book_name_en}
                            </div>
                            {result.book_name_am && (
                              <div className="mt-1 text-sm text-gray-600">
                                {result.book_name_am}
                              </div>
                            )}
                          </div>
                          {result.matchCount && result.matchCount > 0 && (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                              {result.matchCount.toLocaleString()} verses
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-[#4C0E0F]">
                              {result.book_name_en} {result.chapter}:{result.verse}
                            </span>
                            {result.section_title && (
                              <span className="rounded bg-red-50 px-2 py-0.5 text-xs text-red-700">
                                {result.section_title}
                              </span>
                            )}
                          </div>
                          <div className="leading-relaxed text-gray-700">{result.text}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {hasMore && (
                  <div className="border-t bg-gray-50 p-4">
                    <button
                      onClick={() => setDisplayLimit((prev) => prev + 50)}
                      className="w-full rounded-lg bg-[#4C0E0F] py-2 font-medium text-white transition-colors hover:bg-red-800"
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
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4C0E0F] border-t-transparent"></div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
