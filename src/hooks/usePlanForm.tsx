"use client"
import { books } from "@/data/data"
import { ReadingPlan } from "@/stores/types"
import { usePlanStore } from "@/stores/usePlanStore"
import { format } from "date-fns"
import { useTranslations } from "next-intl"
import React from "react"
import { PlanDialogFormProps } from "@/stores/types"


export const usePlanForm = (
  initialData?: ReadingPlan,
  initialValues?: PlanDialogFormProps['initialValues'],
  onCreated?: (plan: ReadingPlan) => void,
) => {
  const t = useTranslations('PlanForm')
  const { createPlan, fetchPlans, updatePlan, deletePlan, isFetching } = usePlanStore()

  const [open, setOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const [formData, setFormData] = React.useState<{
    name: string
    startBook: string
    startChapter: number
    endBook: string
    endChapter: number
    startDate: Date
    durationInDays: number
  }>({
    name: initialData?.name || initialValues?.name || '',
    startBook: initialData?.startBook || initialValues?.startBook || '',
    startChapter: initialValues?.startChapter || 1,
    endBook: initialData?.endBook || initialValues?.endBook || '',
    endChapter: initialValues?.endChapter || 1,
    startDate: initialValues?.startDate 
      ? new Date(initialValues.startDate) 
      : (initialData?.createdAt ? new Date(initialData.createdAt) : new Date()),
    durationInDays: initialData?.durationInDays || initialValues?.durationInDays || 1,
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const validate = React.useCallback((showAll = false) => {
    const newErrors: Record<string, string> = {}
    const { name, startBook, endBook, startChapter, endChapter, durationInDays } = formData

    if (showAll || touched.name || name) if (!name.trim()) newErrors.name = t('nameRequired')
    if (showAll || touched.startBook || startBook) if (!startBook) newErrors.startBook = t('bookRequired')
    if (showAll || touched.endBook || endBook) if (!endBook) newErrors.endBook = t('bookRequired')

    const sBook = books.find((b) => b.book_name_en === startBook)
    if (sBook && (startChapter < 1 || startChapter > sBook.chapters)) {
      newErrors.startChapter = t('chapterRange', { max: sBook.chapters })
    }

    const eBook = books.find((b) => b.book_name_en === endBook)
    if (eBook && (endChapter < 1 || endChapter > eBook.chapters)) {
      newErrors.endChapter = t('chapterRange', { max: eBook.chapters })
    }

    if (durationInDays < 1) newErrors.durationInDays = t('durationMin')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, touched, t])

  React.useEffect(() => {
    validate()
  }, [validate])

  // Auto-adjust chapters when book changes
  React.useEffect(() => {
    const sBook = books.find((b) => b.book_name_en === formData.startBook)
    if (sBook && formData.startChapter > sBook.chapters) {
      updateField('startChapter', sBook.chapters)
    }
  }, [formData.startBook])

  React.useEffect(() => {
    const eBook = books.find((b) => b.book_name_en === formData.endBook)
    if (eBook && formData.endChapter > eBook.chapters) {
      updateField('endChapter', eBook.chapters)
    }
  }, [formData.endBook])

  // Prefill if template changes
  React.useEffect(() => {
    if (initialData || !initialValues) return
    setFormData({
      name: initialValues.name ?? '',
      startBook: initialValues.startBook ?? '',
      startChapter: initialValues.startChapter ?? 1,
      endBook: initialValues.endBook ?? '',
      endChapter: initialValues.endChapter ?? 1,
      startDate: initialValues.startDate ? new Date(initialValues.startDate) : new Date(),
      durationInDays: initialValues.durationInDays ?? 1,
    })
  }, [initialData, initialValues])

  const handleSubmit = async () => {
    if (!validate(true)) return
    if (!formData.startDate) return

    const payload = {
      ...formData,
      startDate: format(formData.startDate, 'yyyy-MM-dd'),
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

  return {
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
  }
}
