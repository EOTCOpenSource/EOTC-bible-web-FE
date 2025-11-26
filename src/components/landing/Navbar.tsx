'use client'

import { useUIStore } from '@/stores/uiStore'
import { ArrowUpRight, Menu, Moon, Search, User, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { LanguageSelector } from '../shared/language-selector'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useEffect } from 'react'
import { SearchInput } from '../ui/search-input'

const Navbar = () => {
  const { isNavMenuOpen, isNavSearchOpen, toggleNavMenu, toggleNavSearch, isReadOnlineSidebarOpen, closeNavMenu } = useUIStore()
  const t = useTranslations('Navigation')
  const pathname = usePathname()
  const isReaderPage = pathname.includes('/read-online')

  const showFullNavbar = !isReaderPage || (isReaderPage && !isReadOnlineSidebarOpen)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isNavMenuOpen) {
            closeNavMenu();
        }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNavMenuOpen, closeNavMenu]);

  return (
    <div className={clsx(
      "fixed top-4 left-1/2 z-30 w-full max-w-7xl -translate-x-1/2 px-4 transition-all duration-300",
      isReaderPage && isReadOnlineSidebarOpen && "md:w-[calc(100%-300px)] md:left-[calc(50%+150px)]"
    )}>
      <div className="h-14 rounded-md bg-white px-4 py-2 shadow-lg backdrop-blur-sm md:px-8">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="EOTCBible Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">{t('siteName')}</span>
            </Link>
            <div className="hidden items-center space-x-8 md:flex">
              <Link href="/read-online" className="text-black hover:text-gray-900">
                {t('bible')}
              </Link>
              <Link href="#" className="text-black hover:text-gray-900">
                {t('plans')}
              </Link>
              <Link href="#" className="text-black hover:text-gray-900">
                {t('notes')}
              </Link>
            </div>
          </div>

          {/* Right Section - Full */}
          <div className={clsx("hidden items-center justify-between space-x-4 md:flex", !showFullNavbar && "!hidden")}>
            <SearchInput placeholder={t('search')} showResults={true} />

            <button className="flex h-[42px] w-fit items-center space-x-2 rounded-lg bg-red-900 py-2 pr-2 pl-6 text-white md:w-fit">
              <span>{t('getApp')}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-white p-1 text-red-900">
                <ArrowUpRight size={20} />
              </div>
            </button>

            <Link href="/login">
              <button className="h-[42px] rounded-lg border border-red-900 bg-white px-6 py-2 text-red-900 hover:bg-red-900 hover:text-white">
                {t('login')}
              </button>
            </Link>

            <div className="flex h-[42px] items-center space-x-2 rounded-md border p-1">
              <button className="rounded-full p-2 hover:bg-gray-200">
                <Moon size={20} />
              </button>

              <LanguageSelector />

              <button className="rounded-full p-2 hover:bg-gray-200">
                <User size={20} />
              </button>
            </div>
          </div>

          {/* Right Section - Narrow (for reader page with sidebar) */}
          <div className={clsx("hidden", !showFullNavbar && "md:flex items-center space-x-4")}>
            <SearchInput placeholder={t('search')} containerClassName="w-48" variant="compact" />

            <Link href="/login">
                <button className="h-[42px] rounded-lg border border-red-900 bg-white px-6 py-2 text-red-900 hover:bg-red-900 hover:text-white">
                    {t('login')}
                </button>
            </Link>

            <div className="relative">
                <button onClick={toggleNavMenu}>
                    <Menu size={24} />
                </button>
                {isNavMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-auto rounded-md bg-white p-4 shadow-lg">
                        <div className="flex flex-col space-y-4">
                            <button className="flex h-[42px] w-fit items-center space-x-2 rounded-lg bg-red-900 py-2 pr-2 pl-6 text-white">
                              <span>{t('getApp')}</span>
                              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-white p-1 text-red-900">
                                <ArrowUpRight size={20} />
                              </div>
                            </button>
                            <div className="flex h-[42px] items-center space-x-2 rounded-md border p-1">
                              <button className="rounded-full p-2 hover:bg-gray-200">
                                <Moon size={20} />
                              </button>
                              <LanguageSelector />
                              <button className="rounded-full p-2 hover:bg-gray-200">
                                <User size={20} />
                              </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center space-x-4 md:hidden">
            <button onClick={toggleNavSearch} className="rounded-lg bg-red-900 p-2 text-white">
              <Search size={24} />
            </button>
            <button onClick={toggleNavMenu}>
              {isNavMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isNavMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white rounded-md mt-2 shadow-lg md:hidden">
              <div className="flex flex-col p-4 space-y-2">
                  <Link href="/read-online" className="text-black hover:text-gray-900 py-2">
                      {t('bible')}
                  </Link>
                  <Link href="#" className="text-black hover:text-gray-900 py-2">
                      {t('plans')}
                  </Link>
                  <Link href="#" className="text-black hover:text-gray-900 py-2">
                      {t('notes')}
                  </Link>
                  <div className="border-t my-2"></div>
                  <Link href="/login">
                    <button className="w-full text-left h-[42px] rounded-lg border border-red-900 bg-white px-6 py-2 text-red-900 hover:bg-red-900 hover:text-white">
                      {t('login')}
                    </button>
                  </Link>
              </div>
          </div>
      )}

      {/* Mobile Search */}
      {isNavSearchOpen && (
          <div className="absolute top-full left-0 w-full bg-white rounded-md mt-2 shadow-lg p-4 md:hidden">
            <div className="flex items-center gap-2">
              <SearchInput
                placeholder={t('search')}
                containerClassName="flex-1"
                autoFocus
              />
              <button
                onClick={toggleNavSearch}
                className="rounded-lg p-2 hover:bg-gray-100"
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </div>
          </div>
      )}
    </div>
  )
}

export default Navbar