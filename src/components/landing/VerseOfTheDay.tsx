'use client'

import React, { useEffect } from 'react'
import { Heart, Sun, ArrowUpRight, Bookmark, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useDailyVerseStore } from '@/stores/dailyVerseStore'
import { useProgressStore } from '@/stores/progressStore'
import { useUserStore } from '@/lib/stores/useUserStore'
import { useBookmarksStore } from '@/stores/bookmarksStore'

const VerseOfTheDay = () => {
  const t = useTranslations('VerseOfTheDay')
  const {
    verse,
    isLoading,
    loadDailyVerse,
    stats,
    initStats,
    toggleLike,
    toggleShare,
    toggleBookmark,
  } = useDailyVerseStore()
  const { progress, loadProgress } = useProgressStore()
  const { isLoggedIn } = useUserStore()
  const { addBookmark } = useBookmarksStore()

  useEffect(() => {
    loadDailyVerse().catch(() => {})
    if (isLoggedIn) {
      loadProgress().catch(() => {})
    }
  }, [loadDailyVerse, loadProgress, isLoggedIn])

  useEffect(() => {
    initStats(t('likes'), t('shares'), t('bookmarks'))
  }, [t, initStats])

  const continueReadingHref = isLoggedIn
    ? progress.lastRead
      ? `/read-online/${progress.lastRead.book}/${progress.lastRead.chapter}#v${progress.lastRead.verseStart}`
      : '/read-online'
    : '/login'

  const votdHref = verse
    ? `/read-online/${verse.bookId}/${verse.chapter}#v${verse.verse}`
    : '#'

  const renderStat = (num: number | undefined, original: string) => {
    if (num === undefined) return original
    if (num % 100 !== 0) {
      return num.toLocaleString()
    }
    return original
  }

  const handleShare = async () => {
    toggleShare()
    const shareText = `"${verse?.text}"\n\n${verse?.reference}`
    const shareUrl = window.location.href

    if (navigator.share && verse) {
      try {
        await navigator.share({
          title: t('title'),
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.error('Error sharing', err)
      }
    } else {
      // Fallback: Copy to clipboard if Web Share API is not supported
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        alert('Verse copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy text', err)
      }
    }
  }

  const handleBookmark = async () => {
    toggleBookmark()
    // If the user isn't logged in, they just get the visual local interaction.
    // If they are logged in and they are ADDING a bookmark (not un-bookmarking), we save to DB.
    if (isLoggedIn && verse && !stats?.userBookmarked) {
      try {
        await addBookmark({
          book: verse.bookId,
          chapter: verse.chapter,
          verseStart: verse.verse,
          verseCount: 1,
        })
      } catch (err) {
        console.error('Failed to save real bookmark:', err)
      }
    }
  }

  return (
    <section className="bg-[#FFFBF5] py-20 dark:bg-neutral-900">
      <div className="container mx-auto flex flex-col items-center px-4 md:flex-row">
        <div className="w-full md:w-1/2 md:pr-12">
          <div className="mb-4 flex items-center">
            <Sun className="mr-3 text-[#621B1C] dark:text-red-400" size={32} />
            <h2 className="text-3xl font-bold text-[#621B1C] dark:text-red-400">{t('title')}</h2>
          </div>
          {isLoading ? (
            <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
              Loading daily verse...
            </p>
          ) : verse ? (
            <>
              <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                {verse.text}
              </p>
              <p className="mt-4 font-semibold text-amber-800 dark:text-amber-400">
                {verse.reference}
              </p>
            </>
          ) : (
            <>
              <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                {t('verse')}
              </p>
              <p className="mt-4 font-semibold text-amber-800 dark:text-amber-400">
                {t('reference')}
              </p>
            </>
          )}
          <div className="mt-8 flex select-none items-center space-x-8 text-gray-500 dark:text-gray-400">
            <div
              onClick={toggleLike}
              className={`flex cursor-pointer items-center space-x-2 rounded-sm border p-2 transition-colors ${
                stats?.userLiked
                  ? 'border-red-500 bg-red-100 text-red-600 dark:border-red-500 dark:bg-red-900/30 dark:text-red-400'
                  : 'border-transparent bg-red-100/50 hover:bg-red-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700'
              }`}
            >
              <Heart size={20} className={stats?.userLiked ? 'fill-current' : ''} />
              <span>{renderStat(stats?.likes, t('likes'))}</span>
            </div>
            <div
              onClick={handleShare}
              className={`flex cursor-pointer items-center space-x-2 rounded-sm border p-2 transition-colors ${
                stats?.userShared
                  ? 'border-blue-500 bg-blue-100 text-blue-600 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'border-transparent bg-red-100/50 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700'
              }`}
            >
              <Send size={20} className={stats?.userShared ? 'fill-current' : ''} />
              <span>{renderStat(stats?.shares, t('shares'))}</span>
            </div>
            <div
              onClick={handleBookmark}
              className={`flex cursor-pointer items-center space-x-2 rounded-sm border p-2 transition-colors ${
                stats?.userBookmarked
                  ? 'border-amber-500 bg-amber-100 text-amber-600 dark:border-amber-500 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'border-transparent bg-red-100/50 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700'
              }`}
            >
              <Bookmark size={20} className={stats?.userBookmarked ? 'fill-current' : ''} />
              <span>{renderStat(stats?.bookmarks, t('bookmarks'))}</span>
            </div>
          </div>
          <div className="mt-10 flex space-x-4">
            <Link
              href={continueReadingHref}
              className="flex items-center space-x-2 rounded-lg bg-[#392D2D] py-2 pr-2 pl-6 text-white transition-colors hover:bg-black"
            >
              <span>{t('continueReading')}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-white p-1 text-[#392D2D]">
                <ArrowUpRight size={20} />
              </div>
            </Link>
            <Link
              href={votdHref}
              className="flex items-center space-x-2 rounded-lg border border-[#392D2D] bg-white py-2 pr-2 pl-6 text-[#4C0E0F] transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700"
            >
              <span>{t('archive')}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#392D2D] p-1 text-white">
                <ArrowUpRight size={20} />
              </div>
            </Link>
          </div>
        </div>
        <div className="mt-8 w-full md:mt-0 md:w-1/2">
          <Image
            src="/verse-of-the-day-image.png"
            alt={t('alt')}
            width={600}
            height={400}
            priority
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}

export default VerseOfTheDay
