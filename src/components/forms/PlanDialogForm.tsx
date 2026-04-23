'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon, PlusIcon, EditIcon, Trash2Icon } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

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
import { cn } from '@/lib/utils'
import { books } from '@/data/data'
import { type ReadingPlan, type PlanDialogFormProps } from '@/stores/types'
import { usePlanForm } from '@/hooks/usePlanForm'



// --- Sub-components ---

interface FormFieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

const FormField: React.FC<FormFieldProps> = ({ label, error, children }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

interface PlanPreviewProps {
  name: string
  startBook: string
  startChapter: number
  endBook: string
  endChapter: number
  startDate: Date
  durationInDays: number
  getBookName: (enName: string) => string
}

const PlanPreview: React.FC<PlanPreviewProps> = ({
  name,
  startBook,
  startChapter,
  endBook,
  endChapter,
  startDate,
  durationInDays,
  getBookName,
}) => {
  const t = useTranslations('PlanForm')
  if (!name && !startBook && !endBook) return null

  return (
    <div className="rounded-lg bg-background p-4 space-y-2 border border-dashed">
      <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
        {t('preview')}
      </p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
          <CalendarIcon size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm truncate">
            {name || t('newPlan')}
          </h4>
          <p className="text-xs text-forground/80">
            {t('reading', {
              startBook: startBook ? getBookName(startBook) : '...',
              startChapter,
              endBook: endBook ? getBookName(endBook) : '...',
              endChapter,
            })}
          </p>
          <p className="text-[11px] text-gray-500/50 mt-0.5">
            {t('starting', {
              date: format(startDate, 'MMM d, yyyy'),
              duration: durationInDays,
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  planName?: string
  isFetching: boolean
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  planName,
  isFetching,
}) => {
  const t = useTranslations('PlanForm')
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">{t('deleteTitle')}</DialogTitle>
          <p className="text-muted-foreground text-sm">
            {t.rich('deleteConfirm', {
              name: planName as string,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isFetching}>
            {isFetching ? t('deleting') : t('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- Main Component ---

export const PlanDialogForm: React.FC<PlanDialogFormProps> = ({
  initialData,
  initialValues,
  defaultOpen = false,
  hideTrigger = false,
  onCreated,
}) => {
  const t = useTranslations('PlanForm')
  const locale = useLocale()
  
  const {
    open,
    setOpen,
    deleteOpen,
    setDeleteOpen,
    formData,
    updateField,
    markTouched,
    errors,
    isFetching,
    handleSubmit,
    handleDelete,
  } = usePlanForm(initialData, initialValues, onCreated)

  React.useEffect(() => {
    if (defaultOpen) setOpen(true)
  }, [defaultOpen, setOpen])

  const getBookName = (bookEnName: string) => {
    const book = books.find((b) => b.book_name_en === bookEnName)
    if (!book) return bookEnName
    return locale === 'am' ? book.book_name_am : book.book_name_en
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {initialData ? (
          <div className="absolute top-3 right-5 flex flex-col items-center gap-2">
            <p className="text-muted-foreground text-sm">{t('weekdays')}</p>
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
            <PlusIcon className="mr-2 h-4 w-4" /> {t('newPlan')}
          </Button>
        )}

        <DialogContent aria-describedby={`${initialData ? 'edit' : 'new'}-plan-desc`} className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{initialData ? t('editPlan') : t('createPlan')}</DialogTitle>
            <p id={`${initialData ? 'edit' : 'new'}-plan-desc`} className="text-muted-foreground text-sm">{t('fillDetails')}</p>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <FormField label={t('planName')} error={errors.name}>
              <Input
                className={cn('h-11', errors.name && 'border-red-500 focus-visible:ring-red-500')}
                placeholder={t('planNamePlaceholder')}
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                onBlur={() => markTouched('name')}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label={t('startBook')} error={errors.startBook}>
                <Select
                  value={formData.startBook}
                  onValueChange={(val) => {
                    updateField('startBook', val)
                    markTouched('startBook')
                  }}
                >
                  <SelectTrigger
                    size={'lg'}
                    className={cn('w-full placeholder-low-opacity', errors.startBook && 'border-red-500')}
                  >
                    <SelectValue placeholder={getBookName('Genesis')} />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.book_name_en} value={book.book_name_en}>
                        {getBookName(book.book_name_en)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label={t('chapter')} error={errors.startChapter}>
                <Input
                  className={cn('h-11', errors.startChapter && 'border-red-500 focus-visible:ring-red-500')}
                  type="number"
                  min={1}
                  value={formData.startChapter}
                  onChange={(e) => updateField('startChapter', Number(e.target.value))}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label={t('endBook')} error={errors.endBook}>
                <Select
                  value={formData.endBook}
                  onValueChange={(val) => {
                    updateField('endBook', val)
                    markTouched('endBook')
                  }}
                >
                  <SelectTrigger
                    className={cn('w-full', errors.endBook && 'border-red-500')}
                    size={'lg'}
                  >
                    <SelectValue placeholder={getBookName('Exodus')} />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.book_name_en} value={book.book_name_en}>
                        {getBookName(book.book_name_en)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label={t('chapter')} error={errors.endChapter}>
                <Input
                  className={cn('h-11', errors.endChapter && 'border-red-500 focus-visible:ring-red-500')}
                  type="number"
                  min={1}
                  value={formData.endChapter}
                  onChange={(e) => updateField('endChapter', Number(e.target.value))}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label={t('startDate')}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'h-11 w-full justify-start text-left font-normal',
                        !formData.startDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, 'PPP') : t('pickDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => date && updateField('startDate', date)}
                    />
                  </PopoverContent>
                </Popover>
              </FormField>

              <FormField label={t('duration')} error={errors.durationInDays}>
                <Input
                  className={cn('h-11', errors.durationInDays && 'border-red-500 focus-visible:ring-red-500')}
                  type="number"
                  min={1}
                  value={formData.durationInDays}
                  onChange={(e) => updateField('durationInDays', Number(e.target.value))}
                />
              </FormField>
            </div>

            <PlanPreview {...formData} getBookName={getBookName} />

            <Button
              onClick={handleSubmit}
              disabled={isFetching || Object.keys(errors).length > 0}
              className="h-11 relative overflow-hidden"
            >
              {isFetching ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {initialData ? t('updating') : t('creating')}
                </div>
              ) : (
                initialData ? t('updateButton') : t('createButton')
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        planName={initialData?.name}
        isFetching={isFetching}
      />
    </>
  )
}
