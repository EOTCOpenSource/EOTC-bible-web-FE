'use client'

import React, { useEffect } from 'react'
import PlansList from '@/components/dashboard/plans/PlansList'
import { useProgressStore } from '@/stores/progressStore'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PlanDialogForm } from '@/components/forms/PlanDialogForm'

// TODO: implement plans concept instead of bookmarks page

const BookmarksPage = () => {
  const { loadProgress } = useProgressStore()

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl font-bold">Plans</h1>
        {/* <Button className='bg-[#4C0E0F] hover:bg-red-800 cursor-pointer' size={'lg'}>  */}
        <PlanDialogForm />
        {/* </Button> */}
      </div>
      <PlansList />
    </div>
  )
}

export default BookmarksPage
