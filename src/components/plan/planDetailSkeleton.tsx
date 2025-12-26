'use client'

export const  PlanDetailSkeleton = () =>{
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="flex flex-col lg:flex-row">
              <div className="h-64 w-full lg:h-96 lg:w-[400px] flex-shrink-0 bg-gray-200 animate-pulse" />
              
              <div className="flex flex-1 flex-col space-y-6 p-6 lg:p-8">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                
                <div className="space-y-3">
                  <div className="h-8 w-96 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                </div>
                
                <div className="flex gap-4">
                  <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                
                <div className="border-t border-b border-gray-200 py-4">
                  <div className="flex gap-8">
                    <div className="h-12 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-12 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-12 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="h-10 w-40 bg-red-900 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ReadingViewSkeleton = () => {
  return (
    <div className="mt-12 space-y-6">
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="h-64 w-full bg-gray-200 rounded-lg animate-pulse" />
          <div className="mt-4 space-y-3">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="h-20 w-full bg-gray-200 rounded animate-pulse" />
          <div className="space-y-3">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
