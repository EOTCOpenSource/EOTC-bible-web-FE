'use client'

import * as React from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { usePlanStore, ReadingPlan } from '@/stores/usePlanStore'
import { CalendarIcon, PlusIcon, EditIcon, Trash2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { set } from 'zod'

interface PlanDialogFormProps {
  initialData?: ReadingPlan
}

export const PlanDialogForm: React.FC<PlanDialogFormProps> = ({ initialData }) => {
  const { createPlan, updatePlan, deletePlan, isLoading } = usePlanStore()

  const [open, setOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const [name, setName] = React.useState(initialData?.name || '')
  const [startBook, setStartBook] = React.useState(initialData?.startBook || '')
  const [startChapter, setStartChapter] = React.useState(1)
  const [endBook, setEndBook] = React.useState(initialData?.endBook || '')
  const [endChapter, setEndChapter] = React.useState(1)
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    initialData ? new Date(initialData.createdAt) : undefined,
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
        {/* <DialogTrigger asChild> // Remove the trigger to prevent both dialog open at once */}
        {initialData ? (
          <div className='absolute top-3 right-5 flex flex-col items-center gap-2'>
            <p>Mon - Fri</p>
            <div className="flex gap-6 px-4">
              <EditIcon className="cursor-pointer text-red-800" onClick={() => setOpen(true)} />
              <Trash2Icon className="cursor-pointer text-red-800" onClick={() => setDeleteOpen(true)} />
            </div>
          </div>
        ) : (
          <Button onClick={() => setOpen(true)} className="bg-red-900 hover:bg-red-800" size="lg">
            <PlusIcon /> New Plan
          </Button>
        )}
        {/* </DialogTrigger> */}

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{initialData ? 'Edit Reading Plan' : 'Create Reading Plan'}</DialogTitle>
            <p className="text-muted-foreground">
              Name, books, chapters, start date, and duration are required.
            </p>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Input placeholder="Plan name" value={name} onChange={(e) => setName(e.target.value)} />

            <Select value={startBook} onValueChange={setStartBook}>
              <SelectTrigger>
                <SelectValue placeholder="Start book" />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.book_name_en} value={book.book_name_en}>
                    {book.book_name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              min={1}
              placeholder="Start chapter"
              value={startChapter}
              onChange={(e) => setStartChapter(Number(e.target.value))}
            />

            <Select value={endBook} onValueChange={setEndBook}>
              <SelectTrigger>
                <SelectValue placeholder="End book" />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.book_name_en} value={book.book_name_en}>
                    {book.book_name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              min={1}
              placeholder="End chapter"
              value={endChapter}
              onChange={(e) => setEndChapter(Number(e.target.value))}
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn('justify-start text-left', !startDate && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : 'Start date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
              </PopoverContent>
            </Popover>

            <Input
              type="number"
              min={1}
              placeholder="Duration (days)"
              value={durationInDays}
              onChange={(e) => setDurationInDays(Number(e.target.value))}
            />

            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading
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

      {/* ===== DELETE CONFIRMATION DIALOG ===== */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Reading Plan?</DialogTitle>
            <p className="text-muted-foreground">
              This action cannot be undone. This will permanently delete
              <strong> "{initialData?.name}"</strong>.
            </p>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
