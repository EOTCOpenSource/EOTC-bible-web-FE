'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Globe, Check } from 'lucide-react'

const languageNames: Record<string, string> = {
  en: 'English',
  am: 'አማርኛ',
  gez: 'ግዕዝ',
  tg: 'ትግርኛ',
  or: 'Afaan Oromoo',
}

interface LanguageSelectorProps {
  className?: string;
  iconSize?: number;
  strokeWidth?: number;
}

export function LanguageSelector({ className, iconSize = 20, strokeWidth = 1.5 }: LanguageSelectorProps = {}) {
  const router = useRouter()
  const currentLocale = useLocale()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === currentLocale) return

    setIsChanging(true)
    setIsDropdownOpen(false)

    try {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
      setTimeout(() => {
        router.refresh()
      }, 100)
    } catch (error) {
      console.error('Failed to change language:', error)
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={className || "relative rounded-xl p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 text-foreground transition-colors flex items-center justify-center w-10 h-10"}
        disabled={isChanging}
      >
        {isChanging ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        ) : (
          <Globe size={iconSize} strokeWidth={strokeWidth} />
        )}
      </button>

      {isDropdownOpen && (
         <>
          <div className="absolute top-12 right-0 z-50 w-48 rounded-md border  bg-background dark:bg-background/90 dark:text-background-foreground shadow-lg">
            <div className="py-1">
              {Object.entries(languageNames).map(([locale, name]) => (
                <button
                  key={locale}
                  onClick={() => handleLanguageChange(locale)}
                  className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-800 dark:text-gray-200"
                >
                  <div className="flex items-center space-x-2">
                    <span>{name}</span>
                  </div>
                  {locale === currentLocale && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
        </>
      )}
    </div>
  )
}
