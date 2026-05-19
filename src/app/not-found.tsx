'use client'

import Link from 'next/link'
import { Frown } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('GlobalNotFound')
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <Frown className="mb-4 h-14 w-14 text-gray-500" />
      <h2 className="mb-2 text-2xl font-semibold">{t('title')}</h2>
      <p className="mb-6 max-w-md text-gray-600">{t('description')}</p>
      <Link
        href="/"
        className="rounded-full bg-black px-5 py-2 text-sm text-white transition hover:bg-neutral-800"
      >
        {t('goHome')}
      </Link>
    </div>
  )
}
