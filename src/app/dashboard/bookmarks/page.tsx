'use client'

import React, { useEffect } from 'react'
import { useBookmarksStore } from '@/stores/bookmarksStore'
import { BookmarksList } from '@/components/dashboard/bookmarks'
import { useTranslations } from 'next-intl'

const BookmarksPage = () => {
  const { loadBookmarks, clearError } = useBookmarksStore()
  const t = useTranslations('Dashboard')

  useEffect(() => {
    loadBookmarks()
    return () => {
      clearError()
    }
  }, [loadBookmarks, clearError])

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">{t('bookmarksButton')}</h1>
      <BookmarksList />
    </div>
  )
}

export default BookmarksPage
