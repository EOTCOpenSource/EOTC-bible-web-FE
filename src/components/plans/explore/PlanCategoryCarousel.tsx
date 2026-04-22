'use client'

import { useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

type Category = {
  key: string
  titleKey: 'featuredTitle' | 'wholeBibleTitle' | 'encouragementTitle' | 'wisdomTitle' | 'hardTimesTitle'
  imageSrc: string
  href: string
}

const categories: Category[] = [
  {
    key: 'featured',
    titleKey: 'featuredTitle',
    imageSrc: '/plans/plan1.png',
    href: '#featured',
  },
  {
    key: 'whole-bible',
    titleKey: 'wholeBibleTitle',
    imageSrc: '/plans/plan2.png',
    href: '#whole-bible',
  },
  {
    key: 'encouragement',
    titleKey: 'encouragementTitle',
    imageSrc: '/plans/plan4.png',
    href: '#encouragement',
  },
  {
    key: 'wisdom',
    titleKey: 'wisdomTitle',
    imageSrc: '/plans/plan3.png',
    href: '#wisdom',
  },
  {
    key: 'hard-times',
    titleKey: 'hardTimesTitle',
    imageSrc: '/plans/plan6.png',
    href: '#encouragement',
  },
]

export function PlanCategoryCarousel() {
  const t = useTranslations('PlansExplore')
  const scrollerRef = useRef<HTMLDivElement>(null)

  const canScroll = useMemo(() => categories.length > 0, [])

  const scrollBy = (dir: 'left' | 'right') => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -420 : 420, behavior: 'smooth' })
  }

  return (
    <div className="relative w-full">
      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pr-2"
      >
        {categories.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className={cn(
              'relative flex-shrink-0 overflow-hidden rounded-xl border border-black/10 dark:border-neutral-700 bg-white dark:bg-neutral-800',
              'w-[152px] h-[86px] sm:w-[170px] sm:h-[96px]',
            )}
          >
            <Image
              src={c.imageSrc}
              alt={t(c.titleKey)}
              fill
              className="object-cover"
              sizes="170px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute left-2 bottom-2 right-2 text-white">
              <div className="text-xs font-semibold leading-tight">{t(c.titleKey)}</div>
              <div className="text-[10px] text-white/80">{t('viewPlans')}</div>
            </div>
          </Link>
        ))}
      </div>

      {canScroll && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy('left')}
            className="h-9 w-9 rounded-md bg-[#FFFCDB] dark:bg-neutral-700 border border-black/10 dark:border-neutral-600 flex items-center justify-center hover:bg-[#fff7b8] dark:hover:bg-neutral-600 dark:text-neutral-100"
            aria-label={t('scrollLeft')}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy('right')}
            className="h-9 w-9 rounded-md bg-[#FFFCDB] dark:bg-neutral-700 border border-black/10 dark:border-neutral-600 flex items-center justify-center hover:bg-[#fff7b8] dark:hover:bg-neutral-600 dark:text-neutral-100"
            aria-label={t('scrollRight')}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

