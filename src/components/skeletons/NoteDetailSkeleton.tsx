import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft } from 'lucide-react'

export const NoteDetailSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex items-center gap-2 text-gray-400">
        <ArrowLeft className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/50 p-6 md:p-8">
          <Skeleton className="mb-4 h-8 w-3/4 md:h-10" />

          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
        </div>

        <div className="space-y-4 p-6 md:p-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  )
}
