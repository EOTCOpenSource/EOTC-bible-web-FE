'use client'

import Link from 'next/link'
import { Frown } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default  function NotFound() {
    const t= useTranslations('GlobalNotFound')
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <Frown className="w-14 h-14 text-gray-500 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">{t('title')}</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        {t('description')}
      </p>
      <Link
        href="/"
        className="rounded-full bg-black text-white px-5 py-2 text-sm hover:bg-neutral-800 transition"
      >
        {t('goHome')}
      </Link>
    </div>
  )
}
