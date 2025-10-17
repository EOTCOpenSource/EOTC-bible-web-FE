import { getRequestConfig } from 'next-intl/server'
import { supportedLocales } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = (await requestLocale) as typeof supportedLocales.locales[number] | undefined

  if (!locale || !supportedLocales.locales.includes(locale)) {
    locale = supportedLocales.defaultLocale as typeof supportedLocales.locales[number]
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
