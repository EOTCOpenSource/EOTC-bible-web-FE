'use client'

import { useEffect, useState } from 'react'
import { useHighlightsStore } from '@/stores/highlightsStore'
import { Trash2, FilePenLine, ExternalLink, PencilLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useSettingsStore } from '@/stores/settingsStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from 'next-intl'

export default function HighlightsClient() {
  const { highlights, loadHighlights, removeHighlight, isLoading } = useHighlightsStore()
  const t = useTranslations('Dashboard')
  const tCommon = useTranslations('Common')
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [highlightToDelete, setHighlightToDelete] = useState<string | null>(null) // null means bulk delete if modal open? no, let's be explicit
  const [isBulkDelete, setIsBulkDelete] = useState(false)

  const { preferredTranslation, updateSettings } = useSettingsStore()

  const title = t('highlightsTitle')

  useEffect(() => {
    // Reload highlights (and their verse text) whenever the preferred translation changes
    loadHighlights(preferredTranslation).catch(() => {})
  }, [loadHighlights, preferredTranslation])

  const handleDelete = async (id: string) => {
    setHighlightToDelete(id)
    setIsBulkDelete(false)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (isBulkDelete) {
      for (const id of selected) {
        await removeHighlight(id)
      }
      setSelected([])
    } else if (highlightToDelete) {
      await removeHighlight(highlightToDelete)
    }
    setDeleteModalOpen(false)
    setHighlightToDelete(null)
    setIsBulkDelete(false)
  }

  const handleSelectAll = () => {
    if (selected.length === highlights.length) {
      setSelected([])
    } else {
      setSelected(highlights.map((h) => h._id))
    }
  }

  const handleBulkDelete = async () => {
    if (selected.length === 0) return
    setIsBulkDelete(true)
    setDeleteModalOpen(true)
  }

  const handleNavigateToVerse = (bookId: string, chapter: number, verse: number) => {
    router.push(`/read-online/${bookId}/${chapter}#v${verse}`)
  }

  const handleShare = async (highlight: {
    verseRef: { book: string; chapter: number; verseStart: number; verseCount: number }
    text?: string
  }) => {
    const bookName = formatBookName(highlight.verseRef.book)
    const ref = `${bookName} ${highlight.verseRef.chapter}:${highlight.verseRef.verseStart}${highlight.verseRef.verseCount > 1 ? `-${highlight.verseRef.verseStart + highlight.verseRef.verseCount - 1}` : ''}`
    const textToShare = `${ref}\n\n"${highlight.text || 'Check out this verse!'}"\n\nRead more at: ${window.location.origin}/read-online/${highlight.verseRef.book}/${highlight.verseRef.chapter}#v${highlight.verseRef.verseStart}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bible Verse: ${ref}`,
          text: textToShare,
          url: `${window.location.origin}/read-online/${highlight.verseRef.book}/${highlight.verseRef.chapter}#v${highlight.verseRef.verseStart}`,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(textToShare)
        toast.success('Verse copied to clipboard')
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  // Helper to format book name
  const formatBookName = (bookId: string) => {
    return bookId.charAt(0).toUpperCase() + bookId.slice(1).replace(/-/g, ' ')
  }

  return (
    <>
      <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
        {/* Header */}
        {/* Header */}
        <div className="mb-6 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3 md:gap-5">
            <PencilLine className="h-[24px] w-[24px] md:h-[30px] md:w-[30px]" strokeWidth={1} />
            <h5 className="font-poppins text-[20px] leading-[90%] font-normal tracking-[0.08em] text-black md:text-[25px] dark:text-white">
              {title}
            </h5>
          </div>

          <div className="flex items-center gap-4">
            {/* Select All Checkbox - Functional implementation */}
            <div className="flex cursor-pointer items-center gap-2" onClick={handleSelectAll}>
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border border-gray-400 dark:border-gray-600 ${selected.length === highlights.length && highlights.length > 0 ? 'border-blue-500 bg-blue-500' : ''}`}
              >
                {selected.length === highlights.length && highlights.length > 0 && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">{t('selectAll')}</span>
            </div>

            <button
              onClick={handleBulkDelete}
              disabled={selected.length === 0}
              className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 ${selected.length === 0 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-600 dark:text-gray-300'}`}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Highlights List */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            // Skeleton Loader
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="mx-auto min-h-[167px] w-full max-w-[813px] rounded-[20px] border border-gray-200 bg-white p-4 shadow-sm md:p-6 dark:border-neutral-800 dark:bg-[#1A1A1A]"
              >
                <div className="mb-4 flex items-start justify-between">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="mb-6 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            ))
          ) : highlights.length === 0 ? (
            <div className="py-20 text-center text-gray-400">{t('noHighlights')}</div>
          ) : (
            highlights.map((highlight) => (
              <div
                key={highlight._id}
                className="relative mx-auto min-h-[167px] w-full max-w-[813px] rounded-[20px] border border-gray-200 bg-white px-[27px] py-[16px] shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-[#1A1A1A]"
              >
                {/* Card top row with title */}
                <div className="relative flex items-start justify-between">
                  <h2 className="font-poppins text-[24px] leading-[90%] font-normal tracking-[0.08em] text-black dark:text-white">
                    {formatBookName(highlight.verseRef.book)} {highlight.verseRef.chapter}
                    {highlight.verseRef.verseCount > 1
                      ? `-${highlight.verseRef.verseStart + highlight.verseRef.verseCount - 1}`
                      : ''}
                  </h2>
                </div>

                <p className="font-inter mt-[19px] mb-4 line-clamp-3 max-w-[777px] text-[14px] leading-[100%] font-normal tracking-[0%] text-gray-600 dark:text-gray-300">
                  {highlight.text || (
                    <span className="text-gray-400 italic">{t('clickEditContext')}</span>
                  )}
                </p>

                {/* Action Buttons */}
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    onClick={() =>
                      handleNavigateToVerse(
                        highlight.verseRef.book,
                        highlight.verseRef.chapter,
                        highlight.verseRef.verseStart,
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#621B1C] text-white transition-colors hover:bg-[#4a1415]"
                    title="Read / Edit"
                  >
                    <FilePenLine className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleShare(highlight)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#621B1C] text-white transition-colors hover:bg-[#4a1415]"
                    title="Share"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(highlight._id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#621B1C] text-white transition-colors hover:bg-[#4a1415]"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isBulkDelete ? t('deleteHighlights') : t('deleteHighlight')}
              </DialogTitle>
              <DialogDescription>
                {isBulkDelete
                  ? t('confirmDeleteHighlights', { count: selected.length })
                  : t('confirmDeleteHighlight')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                {tCommon('delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
