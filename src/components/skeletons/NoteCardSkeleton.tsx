import { Skeleton } from '@/components/ui/skeleton'

export const NoteCardSkeleton = () => {
  return (
    <div className="flex min-h-[91px] w-full flex-col items-start justify-between gap-3 rounded-[20px] border border-[#C9C9C9] bg-[#FFFBFB] p-3 min-[375px]:flex-row min-[375px]:items-center min-[375px]:gap-0 sm:p-4 md:p-6">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4 md:gap-6">
        <Skeleton className="h-[35px] w-[30px] flex-shrink-0 rounded-lg sm:h-[40px] sm:w-[35px] md:h-[45px] md:w-[40px]" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-6 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
        </div>
      </div>

      <div className="ml-auto flex flex-shrink-0 flex-row items-center gap-2 min-[375px]:flex-col min-[375px]:items-end min-[375px]:gap-1">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="hidden h-4 w-16 rounded-md min-[375px]:block" />
      </div>
    </div>
  )
}
