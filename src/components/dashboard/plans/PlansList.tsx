import React, { useEffect } from 'react'
import PlanItem from './PlanItem'
import { Skeleton } from '@/components/ui/skeleton'
import { useProgressStore } from '@/stores/progressStore'

const BookmarksList: React.FC = () => {
  const { progress, loadProgress, clearError, error, isLoading } = useProgressStore()

  useEffect(() => {
    loadProgress()
    return () => {
      clearError()
    }
  }, [loadProgress, clearError])

  if (isLoading) {
    return (
      <div className="flex flex-col w-full gap-4">
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

  const books = Object.entries(progress.chaptersRead)

  if (books.length === 0) {
    return <div className="text-muted-foreground">No reading progress yet.</div>
  }

  return (
    <div className="flex flex-col w-full gap-4">
      {books.map(([bookId, chapters]) => (
        <PlanItem
          key={bookId}
          bookId={bookId}
          chaptersRead={chapters}
          streak={progress.streak}
        />
      ))}
    </div>
  )
}

export default BookmarksList
