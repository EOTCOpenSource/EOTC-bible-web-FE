'use client'

import React, { useEffect } from 'react'
import PlansList from '@/components/dashboard/plans/PlansList'
import { useProgressStore } from '@/stores/progressStore'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

// TODO: implement plans concept instead of bookmarks page

const BookmarksPage = () => {
  const { loadProgress } = useProgressStore()

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  return (
    <div className="p-4">
        <div className='flex justify-between'>
            <h1 className="mb-4 text-2xl font-bold">Plans</h1>
            <Button className='bg-red-900 hover:bg-red-800 cursor-pointer' size={'lg'}> <PlusIcon /> New Plan</Button>
        </div>
      <PlansList/>
    </div>
  )
}

export default BookmarksPage
