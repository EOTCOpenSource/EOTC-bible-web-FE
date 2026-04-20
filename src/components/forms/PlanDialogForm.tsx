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
  initialValues?: {
    name?: string
    startBook?: string
    startChapter?: number
    endBook?: string
    endChapter?: number
    startDate?: Date
    durationInDays?: number
  }
  defaultOpen?: boolean
  hideTrigger?: boolean
  onCreated?: (plan: ReadingPlan) => void
}

export const PlanDialogForm: React.FC<PlanDialogFormProps> = ({
  initialData,
  initialValues,
  defaultOpen = false,
  hideTrigger = false,
  onCreated,
}) => {
  const { createPlan, fetchPlans, updatePlan, deletePlan, isFetching } = usePlanStore()

  const [open, setOpen] = React.useState(defaultOpen)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const [name, setName] = React.useState(initialData?.name || initialValues?.name || '')
  const [startBook, setStartBook] = React.useState(
    initialData?.startBook || initialValues?.startBook || '',
  )
  const [startChapter, setStartChapter] = React.useState(initialValues?.startChapter || 1)
  const [endBook, setEndBook] = React.useState(initialData?.endBook || initialValues?.endBook || '')
  const [endChapter, setEndChapter] = React.useState(initialValues?.endChapter || 1)
  const [startDate, setStartDate] = React.useState<Date>(
    initialValues?.startDate || (initialData?.createdAt ? new Date(initialData.createdAt) : new Date()),
  )
  const [durationInDays, setDurationInDays] = React.useState(
    initialData?.durationInDays || initialValues?.durationInDays || 1,
  )
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const [touched, setTouched] = React.useState<Record<string, boolean>>({})

  const validate = (showAll = false) => {
    const newErrors: Record<string, string> = {}
    if (showAll || touched.name || name) if (!name.trim()) newErrors.name = 'Plan name is required'
    if (showAll || touched.startBook || startBook) if (!startBook) newErrors.startBook = 'Start book is required'
    if (showAll || touched.endBook || endBook) if (!endBook) newErrors.endBook = 'End book is required'

    const sBook = books.find((b) => b.book_name_en === startBook)
    if (sBook && (startChapter < 1 || startChapter > sBook.chapters)) {
      newErrors.startChapter = `Must be between 1 and ${sBook.chapters}`
    }

    const eBook = books.find((b) => b.book_name_en === endBook)
    if (eBook && (endChapter < 1 || endChapter > eBook.chapters)) {
      newErrors.endChapter = `Must be between 1 and ${eBook.chapters}`
    }

    if (durationInDays < 1) newErrors.durationInDays = 'Duration must be at least 1 day'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  React.useEffect(() => {
    validate()
  }, [name, startBook, endBook, startChapter, endChapter, durationInDays, touched])

  // AUTO-ADJUST CHAPTERS
  React.useEffect(() => {
    const sBook = books.find((b) => b.book_name_en === startBook)
    if (sBook && startChapter > sBook.chapters) {
      setStartChapter(sBook.chapters)
    }
  }, [startBook])

  React.useEffect(() => {
    const eBook = books.find((b) => b.book_name_en === endBook)
    if (eBook && endChapter > eBook.chapters) {
      setEndChapter(eBook.chapters)
    }
  }, [endBook])

  React.useEffect(() => {
    if (!defaultOpen) return
    setOpen(true)
  }, [defaultOpen])

  React.useEffect(() => {
    if (initialData) return
    if (!initialValues) return
    // Keep form prefilled if template changes (e.g. via query param).
    setName(initialValues.name ?? '')
    setStartBook(initialValues.startBook ?? '')
    setStartChapter(initialValues.startChapter ?? 1)
    setEndBook(initialValues.endBook ?? '')
    setEndChapter(initialValues.endChapter ?? 1)
    setStartDate(initialValues.startDate ?? new Date())
    setDurationInDays(initialValues.durationInDays ?? 1)
  }, [initialData, initialValues])

  const handleSubmit = async () => {
    if (!validate(true)) return
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
      const created = await createPlan(payload)
      await fetchPlans()
      onCreated?.(created)
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
            <p className="text-muted-foreground text-sm">Mon – Fri</p>
            <div className="flex gap-5">
              <EditIcon className="cursor-pointer text-red-800" onClick={() => setOpen(true)} />
              <Trash2Icon
                className="cursor-pointer text-red-800"
                onClick={() => setDeleteOpen(true)}
              />
            </div>
          </div>
        ) : hideTrigger ? null : (
          <Button onClick={() => setOpen(true)} className="h-11 bg-[#4C0E0F] hover:bg-red-800">
            <PlusIcon className="mr-2 h-4 w-4" /> New Plan
          </Button>
        )}

        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>{initialData ? 'Edit Reading Plan' : 'Create Reading Plan'}</DialogTitle>
            <p className="text-muted-foreground text-sm">
              Fill in the details below to set up your reading plan.
            </p>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* PLAN NAME */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Plan name</label>
              <Input
                className={cn('h-11', errors.name && 'border-red-500 focus-visible:ring-red-500')}
                placeholder="e.g. Morning Reading"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setTouched((t) => ({ ...t, name: true }))
                }}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* START BOOK + CHAPTER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Start book</label>
                <Select
                  value={startBook}
                  onValueChange={(val) => {
                    setStartBook(val)
                    setTouched((t) => ({ ...t, startBook: true }))
                  }}
                  
                >
                  <SelectTrigger
                    size={'lg'}
                    className={cn('w-full', errors.startBook && 'border-red-500')}
                  >
                    <SelectValue placeholder="Genesis" className='placeholder-low-opacity'/>
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.book_name_en} value={book.book_name_en}>
                        {book.book_name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.startBook && <p className="text-xs text-red-500">{errors.startBook}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Chapter</label>
                <Input
                  className={cn(
                    'h-11',
                    errors.startChapter && 'border-red-500 focus-visible:ring-red-500',
                  )}
                  type="number"
                  min={1}
                  placeholder="1"
                  value={startChapter}
                  onChange={(e) => setStartChapter(Number(e.target.value))}
                />
                {errors.startChapter && <p className="text-xs text-red-500">{errors.startChapter}</p>}
              </div>
            </div>

            {/* END BOOK + CHAPTER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">End book</label>
                <Select
                  value={endBook}
                  onValueChange={(val) => {
                    setEndBook(val)
                    setTouched((t) => ({ ...t, endBook: true }))
                  }}
                >
                  <SelectTrigger
                    className={cn('w-full', errors.endBook && 'border-red-500')}
                    size={'lg'}
                  >
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
                {errors.endBook && <p className="text-xs text-red-500">{errors.endBook}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Chapter</label>
                <Input
                  className={cn(
                    'h-11',
                    errors.endChapter && 'border-red-500 focus-visible:ring-red-500',
                  )}
                  type="number"
                  min={1}
                  placeholder="20"
                  value={endChapter}
                  onChange={(e) => setEndChapter(Number(e.target.value))}
                />
                {errors.endChapter && <p className="text-xs text-red-500">{errors.endChapter}</p>}
              </div>
            </div>

            {/* START DATE + DURATION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Start date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'h-11 w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground',
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
                  className={cn(
                    'h-11',
                    errors.durationInDays && 'border-red-500 focus-visible:ring-red-500',
                  )}
                  type="number"
                  min={1}
                  placeholder="30"
                  value={durationInDays}
                  onChange={(e) => setDurationInDays(Number(e.target.value))}
                />
                {errors.durationInDays && (
                  <p className="text-xs text-red-500">{errors.durationInDays}</p>
                )}
              </div>
            </div>

            {/* PLAN PREVIEW */}
            {(name || startBook || endBook) && (
              <div className="rounded-lg bg-slate-50 p-4 space-y-2 border border-dashed border-slate-300">
                <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  Plan Preview
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#4C0E0F]/10 flex items-center justify-center text-[#4C0E0F]">
                    <CalendarIcon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#4C0E0F] text-sm truncate">
                      {name || 'New Plan'}
                    </h4>
                    <p className="text-xs text-slate-600">
                      Reading {startBook || '...'} {startChapter} — {endBook || '...'} {endChapter}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Starting {format(startDate, 'MMM d, yyyy')} • {durationInDays} days
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMIT */}
            <Button
              onClick={handleSubmit}
              disabled={isFetching || Object.keys(errors).length > 0}
              className="h-11 relative overflow-hidden"
            >
              {isFetching ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {initialData ? 'Updating...' : 'Creating...'}
                </div>
              ) : initialData ? (
                'Update Plan'
              ) : (
                'Create Plan'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="">
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
