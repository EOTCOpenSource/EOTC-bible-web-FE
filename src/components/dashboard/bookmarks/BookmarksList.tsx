import React, { useEffect } from 'react'
import { useBookmarksStore } from '@/stores/bookmarksStore'
import BookmarkItem from './BookmarkItem'
import { Skeleton } from '@/components/ui/skeleton'

const BookmarksList: React.FC = () => {
  const { bookmarks, isLoading, error, loadBookmarks, clearError } = useBookmarksStore()

  useEffect(() => {
    loadBookmarks()
    return () => {
      clearError()
    }
  }, [loadBookmarks, clearError])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-2 rounded-lg border p-4 shadow-sm">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (bookmarks.length === 0) {
    return <div className="text-center text-gray-500">No bookmarks yet. Start adding some!</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <BookmarkItem key={bookmark._id} bookmark={bookmark} />
      ))}
    </div>
  )
}

export default BookmarksList
