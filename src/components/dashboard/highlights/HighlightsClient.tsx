'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
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

export default function HighlightsClient() {
    const t = useTranslations('Highlights') // Assuming you have translations, or fallback to hardcoded for now if not
    const { highlights, loadHighlights, removeHighlight, isLoading } = useHighlightsStore()
    const router = useRouter()
    const [selected, setSelected] = useState<string[]>([])
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [highlightToDelete, setHighlightToDelete] = useState<string | null>(null) // null means bulk delete if modal open? no, let's be explicit
    const [isBulkDelete, setIsBulkDelete] = useState(false)
    const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false)

    const { preferredTranslation, updateSettings } = useSettingsStore()

    const versionOptions = [
        { id: 'en', label: 'English version' },
        { id: 'am', label: 'Amharic version' },
        { id: 'gez', label: 'Ge\'ez version' },
        { id: 'tg', label: 'Tigrinya version' },
        { id: 'or', label: 'Afaan Oromoo version' },
    ] as const

    const currentVersionLabel =
        versionOptions.find((opt) => opt.id === preferredTranslation)?.label ?? 'English version'

    // Hardcoded title fallback if translation missing
    // In a real app we'd ensure translations exist
    const title = "Highlights"

    useEffect(() => {
        // Reload highlights (and their verse text) whenever the preferred translation changes
        loadHighlights(preferredTranslation).catch(() => { })
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
            setSelected(highlights.map(h => h._id))
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

    const handleShare = async (highlight: { verseRef: { book: string; chapter: number; verseStart: number; verseCount: number }; text?: string }) => {
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

    const handleVersionChange = async (id: string) => {
        try {
            await updateSettings({ preferredTranslation: id })
        } catch (error) {
            console.error('Failed to update preferred translation:', error)
        } finally {
            setIsVersionDropdownOpen(false)
        }
    }

    return (
        <>
            <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-5">
                        <PencilLine className="h-[40px] w-[40px]" strokeWidth={1} />
                        <h1 className="text-[30px] font-poppins font-normal leading-[90%] tracking-[0.08em] text-black">
                            {title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Select All Checkbox - Functional implementation */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={handleSelectAll}>
                            <div className={`h-5 w-5 rounded-full border border-gray-400 flex items-center justify-center ${selected.length === highlights.length && highlights.length > 0 ? 'bg-blue-500 border-blue-500' : ''}`}>
                                {selected.length === highlights.length && highlights.length > 0 && <div className="h-2 w-2 bg-white rounded-full" />}
                            </div>
                            <span className="text-gray-600 text-sm">Select all</span>
                        </div>

                        <button
                            onClick={handleBulkDelete}
                            disabled={selected.length === 0}
                            className={`p-2 rounded-full hover:bg-gray-100 ${selected.length === 0 ? 'text-gray-300' : 'text-gray-600'}`}
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
                            <div key={i} className="border border-gray-200 rounded-[20px] p-4 md:p-6 bg-white shadow-sm w-full max-w-[813px] min-h-[167px] mx-auto">
                                <div className="flex justify-between items-start mb-4">
                                    <Skeleton className="h-6 w-1/3" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <div className="space-y-2 mb-6">
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
                        <div className="text-center py-20 text-gray-400">
                            No highlights yet. Start reading to add some!
                        </div>
                    ) : (
                        highlights.map((highlight) => (
                            <div key={highlight._id} className="border border-gray-200 rounded-[20px] px-[27px] py-[16px] bg-white shadow-sm relative hover:shadow-md transition-shadow w-full max-w-[813px] min-h-[167px] mx-auto">

                                {/* Card top row with title */}
                                <div className="flex justify-between items-start relative">
                                    <h2 className="text-[24px] font-poppins font-normal leading-[90%] tracking-[0.08em] text-black">
                                        {formatBookName(highlight.verseRef.book)} {highlight.verseRef.chapter}
                                        {highlight.verseRef.verseCount > 1 ? `-${highlight.verseRef.verseStart + highlight.verseRef.verseCount - 1}` : ''}
                                    </h2>

                                    {/* Version selector */}
                                    <div className="absolute top-[16px] right-[0px]">
                                        <button
                                            type="button"
                                            onClick={() => setIsVersionDropdownOpen((open) => !open)}
                                            className="font-inter font-normal text-[14px] leading-[100%] tracking-[0%] text-[#8F8F8F] flex items-center gap-1 hover:text-[#621B1C] transition-colors"
                                        >
                                            {currentVersionLabel}
                                            <span className="text-xs">{isVersionDropdownOpen ? '▲' : '▼'}</span>
                                        </button>

                                        {isVersionDropdownOpen && (
                                            <div className="mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-20">
                                                {versionOptions.map((option) => (
                                                    <button
                                                        key={option.id}
                                                        type="button"
                                                        onClick={() => handleVersionChange(option.id)}
                                                        className={`flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 ${
                                                            option.id === preferredTranslation ? 'text-[#621B1C] font-medium' : 'text-gray-700'
                                                        }`}
                                                    >
                                                        <span>{option.label}</span>
                                                        {option.id === preferredTranslation && (
                                                            <span className="text-xs">✓</span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Verse Text (Placeholder logic as actual text isn't in store, might need to fetch or just show snippet if backend provides. 
                   Looking at store types, we don't store text content in Highlight type, only VerseRef. 
                   Ideally we fetch it, but for now I will show a placeholder or just the reference info as "Click to read" 
                   Wait, the figma shows text. If the backend doesn't return text, I can't show it efficiently without n+1 fetches.
                   I will assume for now we might not have it or I'll check the API response again. 
                   Actually, looking at `api/highlights/route.ts`, it wraps `serverAxiosInstance.get('/highlights')`.
                   Let's assume the backend *might* populate it or we rely on the user navigating. 
                   For the UI sake, I will put a placeholder text or omit if empty. 
                   Wait, the Figma clearly shows text. 
                   If the store `Highlight` type doesn't have it, I can't display it. 
                   I'll check the store type again. `verseRef` has book, chapter, verseStart. 
                   I will add a specific note about this limitation or just display the reference nicely.
                   actually I can try to see if there is `text` or `content` in the raw response in store but it wasn't typed.
                   Let's just strictly follow current types.
               */}
                                <p className="font-inter font-normal text-[14px] leading-[100%] tracking-[0%] text-gray-600 mt-[19px] max-w-[777px] mb-4 line-clamp-3">
                                    {highlight.text || <span className="italic text-gray-400">Click "Edit" to view full context.</span>}
                                </p>


                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2 mt-2">
                                    <button
                                        onClick={() => handleNavigateToVerse(highlight.verseRef.book, highlight.verseRef.chapter, highlight.verseRef.verseStart)}
                                        className="h-10 w-10 flex items-center justify-center rounded-full bg-[#621B1C] text-white hover:bg-[#4a1415] transition-colors"
                                        title="Read / Edit"
                                    >
                                        <FilePenLine className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleShare(highlight)}
                                        className="h-10 w-10 flex items-center justify-center rounded-full bg-[#621B1C] text-white hover:bg-[#4a1415] transition-colors"
                                        title="Share"
                                    >
                                        <ExternalLink className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(highlight._id)}
                                        className="h-10 w-10 flex items-center justify-center rounded-full bg-[#621B1C] text-white hover:bg-[#4a1415] transition-colors"
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
                            <DialogTitle>Delete Highlight{isBulkDelete ? 's' : ''}</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete {isBulkDelete ? `${selected.length} highlights` : 'this highlight'}? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div >

        </>
    )
}
