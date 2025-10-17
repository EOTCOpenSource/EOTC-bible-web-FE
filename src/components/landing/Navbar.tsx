'use client'
import { useUIStore } from '@/stores/uiStore'
import { ArrowUpRight, Globe, Menu, Moon, Search, User, X, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

const languageNames: Record<string, string> = {
  en: 'English',
  am: 'አማርኛ',
}

const Navbar = () => {
  const { isNavMenuOpen, isNavSearchOpen, toggleNavMenu, toggleNavSearch, closeNavSearch } =
    useUIStore()
  const t = useTranslations('Navigation')
  const router = useRouter()
  const currentLocale = useLocale()
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isChangingLanguage, setIsChangingLanguage] = useState(false)

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === currentLocale) return

    setIsChangingLanguage(true)
    setIsLanguageDropdownOpen(false)

    try {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
      setTimeout(() => {
        router.refresh()
      }, 100)
    } catch (error) {
      console.error('Failed to change language:', error)
    } finally {
      setIsChangingLanguage(false)
    }
  }

  return (
    <div className="fixed top-4 left-1/2 z-10 w-full max-w-7xl -translate-x-1/2 px-4">
      <div className="h-14 rounded-md bg-white px-4 py-2 shadow-lg backdrop-blur-sm md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="EOTCBible Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">{t('siteName')}</span>
            </div>
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
          <div className="hidden items-center justify-between space-x-4 md:flex">
            <div className="flex h-[42px] items-center overflow-hidden rounded-lg border">
              <div className="flex h-full items-center bg-red-900 p-3">
                <Search className="text-white" size={20} />
              </div>
              <input
                type="text"
                placeholder={t('search')}
                className="h-full w-full bg-gray-100 px-4 py-2 focus:outline-none"
              />
            </div>
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

              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="rounded-full p-2 hover:bg-gray-200 relative"
                  disabled={isChangingLanguage}
                >
                  {isChangingLanguage ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  ) : (
                    <Globe size={20} />
                  )}
                </button>

                {/* Dropdown Menu */}
                {isLanguageDropdownOpen && (
                  <div className="absolute right-0 top-12 z-50 w-48 rounded-md bg-white shadow-lg border border-gray-200">
                    <div className="py-1">
                      {Object.entries(languageNames).map(([locale, name]) => (
                        <button
                          key={locale}
                          onClick={() => handleLanguageChange(locale)}
                          className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{name}</span>
                            <span className="text-xs text-gray-500">({locale})</span>
                          </div>
                          {locale === currentLocale && (
                            <Check size={16} className="text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button className="rounded-full p-2 hover:bg-gray-200">
                <User size={20} />
              </button>
            </div>
          </div>
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

      {/* Mobile Search */}
      {isNavSearchOpen && (
        <div className="absolute top-0 left-0 z-20 w-full">
          <div className="mt-2 rounded-md bg-white p-4">
            <div className="flex h-[42px] items-center overflow-hidden rounded-lg border">
              <div className="flex h-full items-center bg-red-900 p-3">
                <Search className="text-white" size={20} />
              </div>
              <input
                type="text"
                placeholder={t('search')}
                className="h-full w-full bg-gray-100 px-4 py-2 focus:outline-none"
              />
              <button onClick={closeNavSearch} className="p-2">
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isNavMenuOpen && (
        <div className="mt-2 space-y-4 rounded-md bg-white p-4 md:hidden">
          <a href="/read-online" className="block text-black hover:text-gray-900">
            {t('bible')}
          </a>
          <a href="#" className="block text-black hover:text-gray-900">
            {t('plans')}
          </a>
          <a href="#" className="block text-black hover:text-gray-900">
            {t('notes')}
          </a>

          {/* Mobile Language Switcher */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">{t('language')}</div>
            {Object.entries(languageNames).map(([locale, name]) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left ${locale === currentLocale
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-100'
                  }`}
              >
                <span>{name}</span>
                {locale === currentLocale && (
                  <Check size={16} className="text-blue-600" />
                )}
              </button>
            ))}
          </div>

          <button className="flex h-[42px] w-full items-center justify-between rounded-lg bg-red-900 py-2 pr-2 pl-6 text-lg text-white">
            <span>{t('getApp')}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-white p-1 text-red-900">
              <ArrowUpRight size={20} />
            </div>
          </button>
          <Link href="/login">
            <button className="h-[42px] w-full rounded-lg border border-red-900 bg-white px-6 py-2 text-red-900 hover:bg-red-900 hover:text-white">
              {t('login')}
            </button>
          </Link>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isLanguageDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsLanguageDropdownOpen(false)}
        />
      )}
    </div>
  )
}

export default Navbar