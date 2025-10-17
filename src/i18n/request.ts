import { getRequestConfig } from 'next-intl/server'
import { supportedLocales } from './routing'

type SupportedLocale = 'en' | 'am' |"geez"|'tigrigna'|'oromigna'

const isSupportedLocale = (locale: string | undefined): locale is SupportedLocale => {
  return !!locale && supportedLocales.locales.includes(locale as SupportedLocale)
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale: SupportedLocale = isSupportedLocale(requested) ? requested : supportedLocales.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})