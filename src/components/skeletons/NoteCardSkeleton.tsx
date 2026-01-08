import { Skeleton } from "@/components/ui/skeleton"

export const NoteCardSkeleton = () => {
    return (
        <div className="flex flex-col min-[375px]:flex-row items-start min-[375px]:items-center justify-between rounded-[20px] border border-[#C9C9C9] bg-[#FFFBFB] p-3 sm:p-4 md:p-6 w-full min-h-[91px] gap-3 min-[375px]:gap-0">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-1 min-w-0">
                <Skeleton className="h-[35px] w-[30px] sm:h-[40px] sm:w-[35px] md:h-[45px] md:w-[40px] rounded-lg flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-6 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                </div>
            </div>

            <div className="flex flex-row min-[375px]:flex-col items-center min-[375px]:items-end gap-2 min-[375px]:gap-1 flex-shrink-0 ml-auto">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md hidden min-[375px]:block" />
            </div>
        </div>
    )
}
