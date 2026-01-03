import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"

export const NoteDetailSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto w-full space-y-6">
            <div className="flex items-center gap-2 text-gray-400">
                <ArrowLeft className="w-4 h-4" />
                <Skeleton className="h-4 w-32" />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                    <Skeleton className="h-8 md:h-10 w-3/4 mb-4" />

                    <div className="flex flex-wrap gap-4">
                        <Skeleton className="h-6 w-32 rounded-md" />
                        <Skeleton className="h-6 w-24 rounded-md" />
                        <Skeleton className="h-6 w-24 rounded-md" />
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-4">
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
