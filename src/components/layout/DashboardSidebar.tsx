'use client'

import { Book, Calendar, Home, NotebookPen, PenLine, Globe, Trophy } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useTranslations } from 'next-intl'

const DashboardSidebar = () => {
  const pathname = usePathname()
  const t = useTranslations('Navigation')

  const getLinkClass = (path: string) => {
    const isActive = pathname === path
    const baseStyle =
      'flex justify-center md:justify-start items-center gap-2 w-full rounded-md md:px-6 py-1 text-lg transition-colors'
    const activeStyle = 'md:bg-[#4C0E0F] md:text-white text-[#4C0E0F] dark:md:bg-red-900/40 dark:text-red-400'
    const inactiveStyle =
      'text-black dark:text-gray-300 hover:text-[#4C0E0F] dark:hover:text-red-400 md:hover:bg-[#4C0E0F] md:hover:text-white dark:md:hover:bg-red-900/40'

    return `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
  }

  return (
    <nav className="m-3 hidden md:flex rounded-xl border-[1.5px] dark:border-neutral-800 py-1 sm:mx-6 md:h-screen md:flex-col md:gap-2 md:border-0 md:py-4 md:pb-2">
      <Link href="/dashboard" className={getLinkClass('/dashboard')}>
        <Home size={20} />
        <p className="hidden md:block">{t('home')}</p>
      </Link>
      <Link href="/dashboard/highlights" className={getLinkClass('/dashboard/highlights')}>
        <PenLine size={20} />
        <p className="hidden md:block">{t('highlights')}</p>
      </Link>
      <Link href="/dashboard/notes" className={getLinkClass('/dashboard/notes')}>
        <NotebookPen size={20} />
        <p className="hidden md:block">{t('notes')}</p>
      </Link>

      <Link href="/dashboard/plans" className={getLinkClass('/dashboard/plans')}>
        <Calendar size={20} />
        <p className="hidden md:block">{t('plans')}</p>
      </Link>
      <Link href="/dashboard/bookmarks" className={getLinkClass('/dashboard/bookmarks')}>
        <Book size={20} />
        <p className="hidden md:block">{t('bookmarks')}</p>
      </Link>
      <Link href="/dashboard/notes/public" className={getLinkClass('/dashboard/notes/public')}>
        <Globe size={20} />
        <p className="hidden md:block">{t('community')}</p>
      </Link>
    </nav>
  )
}

export default DashboardSidebar
