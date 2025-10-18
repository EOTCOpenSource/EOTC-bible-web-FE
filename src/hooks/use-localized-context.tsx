'use client'

import { useLocale } from 'next-intl'

type LocaleMap<T> = Record<string, T>

/**
 * Generic hook to get localized content
 * @param contentMap - an object where keys are locales and values are content
 * @param defaultLocale - fallback locale
 */
export function useLocalizedContent<T>(contentMap: LocaleMap<T>, defaultLocale: string = 'en'): T {
  const locale = useLocale()
  return contentMap[locale] || contentMap[defaultLocale]
}
