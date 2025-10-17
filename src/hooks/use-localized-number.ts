'use client'

import { formatGeez } from '@onesamket/geez-number'
import { useLocale } from 'next-intl'

type FormatOptions = {
  prefix?: string
  separator?: string
  suffix?: string
}

export function useLocalizedNumber() {
  const locale = useLocale()

  const formatNumber = (number: number, options: FormatOptions = {}): number | string => {
    if (locale === 'en' || locale == 'or') {
      return number
    }
    return formatGeez(number, {
      prefix: options.prefix,
      separator: options.separator,
      suffix: options.suffix,
    })
  }

  return { formatNumber }
}
