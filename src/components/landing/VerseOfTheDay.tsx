'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Heart, Sun, ArrowUpRight, Bookmark, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useDailyVerseStore } from '@/stores/dailyVerseStore'
import { useProgressStore } from '@/stores/progressStore'
import { useUserStore } from '@/lib/stores/useUserStore'
import { useBookmarksStore } from '@/stores/bookmarksStore'

const HEART_PARTICLES = 14

const HeartConfetti = ({ burstId }: { burstId: number }) => {
  const particles = useMemo(() => {
    return Array.from({ length: HEART_PARTICLES }, () => {
      const angle = Math.random() * Math.PI * 2
      const distance = 28 + Math.random() * 36
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance - (18 + Math.random() * 18)
      const rotate = -35 + Math.random() * 70
      const delay = Math.random() * 40
      const duration = 520 + Math.random() * 220
      const scale = 0.85 + Math.random() * 0.6
      return { x, y, rotate, delay, duration, scale }
    })
  }, [burstId])

  return (
    <span className="heart-confetti" aria-hidden="true">
      {particles.map((p, idx) => (
        <span
          key={idx}
          className="heart-confetti__particle"
          style={
            {
              ['--x' as any]: `${p.x}px`,
              ['--y' as any]: `${p.y}px`,
              ['--r' as any]: `${p.rotate}deg`,
              ['--d' as any]: `${p.delay}ms`,
              ['--t' as any]: `${p.duration}ms`,
              ['--s' as any]: p.scale,
            } as React.CSSProperties
          }
        >
          ♥
        </span>
      ))}
    </span>
  )
}

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
  const [likeBurstId, setLikeBurstId] = useState(0)

  useEffect(() => {
    loadDailyVerse().catch(() => { })
    if (isLoggedIn) {
      loadProgress().catch(() => { })
    }
  }, [loadDailyVerse, loadProgress, isLoggedIn])

  useEffect(() => {
    initStats(t('likes'), t('shares'), t('bookmarks'))
  }, [t, initStats])

  const continueReadingHref = progress.lastRead
    ? `/read-online/${progress.lastRead.book}/${progress.lastRead.chapter}#v${progress.lastRead.verseStart}`
    : verse
      ? `/read-online/${verse.bookId}/${verse.chapter}#v${verse.verse}`
      : '/read-online/1/1#v1'

  const votdHref = verse ? `/read-online/${verse.bookId}/${verse.chapter}#v${verse.verse}` : '#'

  const renderStat = (num: number | undefined, original: string) => {
    if (num === undefined) return original
    if (num % 100 !== 0) {
      return num.toLocaleString()
    }
    return original
  }

  const handleLikeClick = () => {
    toggleLike()
    setLikeBurstId((n) => n + 1)
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
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/verse-of-the-day-bg.png"
          alt="Verse of the day Background"
          fill
          className="object-cover brightness-110 dark:brightness-50 transition-all duration-700"
          priority
        />
        {/* Light: Very transparent | Dark: Deep near-black */}
        <div className="absolute inset-0 bg-white/20 dark:bg-[#0A0A0A]/85" />
      </div>

      <div className="container relative z-10 mx-auto flex flex-col items-center px-4 lg:flex-row">
        <div className="w-full lg:w-1/2 lg:pr-12">
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
          <div className="mt-8 flex items-center space-x-8 text-gray-500 select-none dark:text-gray-400">
            <div
              onClick={handleLikeClick}
              className={`relative flex cursor-pointer items-center space-x-2 overflow-visible rounded-sm border p-2 transition-colors ${stats?.userLiked
                  ? 'border-red-500 bg-red-100 text-red-600 dark:border-red-500 dark:bg-red-900/30 dark:text-red-400'
                  : 'border-transparent bg-red-100/50 hover:bg-red-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                }`}
            >
              {likeBurstId > 0 ? <HeartConfetti key={likeBurstId} burstId={likeBurstId} /> : null}
              <Heart size={20} className={stats?.userLiked ? 'fill-current' : ''} />
              <span>{renderStat(stats?.likes, t('likes'))}</span>
            </div>
            <div
              onClick={handleShare}
              className={`flex cursor-pointer items-center space-x-2 rounded-sm border p-2 transition-colors ${stats?.userShared
                  ? 'border-blue-500 bg-blue-100 text-blue-600 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'border-transparent bg-red-100/50 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                }`}
            >
              <Send size={20} className={stats?.userShared ? 'fill-current' : ''} />
              <span>{renderStat(stats?.shares, t('shares'))}</span>
            </div>
            <div
              onClick={handleBookmark}
              className={`flex cursor-pointer items-center space-x-2 rounded-sm border p-2 transition-colors ${stats?.userBookmarked
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
        <div className="mt-8 w-full lg:mt-0 lg:w-1/2">
          <Image
            src="/verse-of-the-day-image.png"
            alt={t('alt')}
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      </div>
    </section>
  )
}

export default VerseOfTheDay
