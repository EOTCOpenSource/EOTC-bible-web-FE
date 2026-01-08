'use client'

import * as React from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { books } from '@/data/data'
import { usePlanStore } from '@/stores/usePlanStore'
import { CalendarIcon, PlusIcon, EditIcon, Trash2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReadingPlan } from '@/stores/types'

interface PlanDialogFormProps {
  initialData?: ReadingPlan
}

export const PlanDialogForm: React.FC<PlanDialogFormProps> = ({ initialData }) => {
  const { createPlan, fetchPlans, updatePlan, deletePlan, isFetching } = usePlanStore()

  const [open, setOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const [name, setName] = React.useState(initialData?.name || '')
  const [startBook, setStartBook] = React.useState(initialData?.startBook || '')
  const [startChapter, setStartChapter] = React.useState(1)
  const [endBook, setEndBook] = React.useState(initialData?.endBook || '')
  const [endChapter, setEndChapter] = React.useState(1)
  const [startDate, setStartDate] = React.useState<Date>(
    initialData?.createdAt ? new Date(initialData.createdAt) : new Date()
  )
  const [durationInDays, setDurationInDays] = React.useState(initialData?.durationInDays || 1)

  const handleSubmit = async () => {
    if (!startDate) return

    const payload = {
      name,
      startBook,
      startChapter,
      endBook,
      endChapter,
      startDate: format(startDate, 'yyyy-MM-dd'),
      durationInDays,
    }

    if (initialData) {
      await updatePlan(initialData._id, payload)
    } else {
      await createPlan(payload)
      await fetchPlans()
    }

    setOpen(false)
  }

  const handleDelete = async () => {
    if (!initialData) return
    await deletePlan(initialData._id)
    setDeleteOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {initialData ? (
          <div className="absolute top-3 right-5 flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">Mon – Fri</p>
            <div className="flex gap-5">
              <EditIcon className="cursor-pointer text-red-800" onClick={() => setOpen(true)} />
              <Trash2Icon className="cursor-pointer text-red-800" onClick={() => setDeleteOpen(true)} />
            </div>
          </div>
        ) : (
          <Button onClick={() => setOpen(true)} className="bg-red-900 hover:bg-red-800 h-11">
            <PlusIcon className="mr-2 h-4 w-4" /> New Plan
          </Button>
        )}

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {initialData ? 'Edit Reading Plan' : 'Create Reading Plan'}
            </DialogTitle>
            <p className="text-muted-foreground text-sm">
              Fill in the details below to set up your reading plan.
            </p>
          </DialogHeader>

          <div className="grid gap-5 py-4">

            {/* PLAN NAME */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Plan name</label>
              <Input
                className="h-11"
                placeholder="e.g. Morning Reading"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* START BOOK + CHAPTER */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Start book</label>
                <Select value={startBook} onValueChange={setStartBook}>
                  <SelectTrigger size={'lg'} className="w-full">
                    <SelectValue placeholder="Genesis" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.book_name_en} value={book.book_name_en}>
                        {book.book_name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Chapter</label>
                <Input
                  className="h-11"
                  type="number"
                  min={1}
                  placeholder="1"
                  value={startChapter}
                  onChange={(e) => setStartChapter(Number(e.target.value))}
                />
              </div>
            </div>

            {/* END BOOK + CHAPTER */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">End book</label>
                <Select value={endBook} onValueChange={setEndBook}>
                  <SelectTrigger className="w-full" size={'lg'}>
                    <SelectValue placeholder="Exodus" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.book_name_en} value={book.book_name_en}>
                        {book.book_name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Chapter</label>
                <Input
                  className="h-11"
                  type="number"
                  min={1}
                  placeholder="20"
                  value={endChapter}
                  onChange={(e) => setEndChapter(Number(e.target.value))}
                />
              </div>
            </div>

            {/* START DATE + DURATION */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Start date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'h-11 w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Duration (days)</label>
                <Input
                  className="h-11"
                  type="number"
                  min={1}
                  placeholder="30"
                  value={durationInDays}
                  onChange={(e) => setDurationInDays(Number(e.target.value))}
                />
              </div>
            </div>

            {/* SUBMIT */}
            <Button onClick={handleSubmit} disabled={isFetching} className="h-11">
              {isFetching
                ? initialData
                  ? 'Updating...'
                  : 'Creating...'
                : initialData
                  ? 'Update Plan'
                  : 'Create Plan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Reading Plan?</DialogTitle>
            <p className="text-muted-foreground text-sm">
              This action cannot be undone. This will permanently delete
              <strong> “{initialData?.name}”</strong>.
            </p>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isFetching}>
              {isFetching ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
