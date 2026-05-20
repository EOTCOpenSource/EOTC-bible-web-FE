import { getLocaleFromCookie } from '@/i18n/locale'
import { cn } from '@/lib/utils'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Abyssinica_SIL, Playfair_Display } from 'next/font/google'
import localFont from 'next/font/local'
import Script from 'next/script'
import { ReactNode } from 'react'
import './globals.css'
import { supportedLocales } from '@/i18n/routing'
import GoogleAuthProvider from '@/components/auth/GoogleAuthProvider'
import { ThemeProvider } from '@/components/theme-provider'
import OfflineStatusProvider from '@/components/shared/OfflineStatusProvider'

const abyssinicaFont = Abyssinica_SIL({
  subsets: ['ethiopic'],
  variable: '--font-abyssinica',
  weight: '400',
})

const brittiSansFont = localFont({
  src: [
    {
      path: '../fonts/BrittiSans-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/BrittiSans-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-britti-sans',
  display: 'swap',
})

const polySansFont = localFont({
  src: [
    {
      path: '../fonts/PolySans-Median.otf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-polysans',
  display: 'swap',
})

const polySansWideFont = localFont({
  src: [
    {
      path: '../fonts/PolySans-NeutralMono.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-polysans-wide',
  display: 'swap',
})

const migraFont = localFont({
  src: '../fonts/Migra-MediumItalic.otf',
  variable: '--font-migra-local',
  display: 'swap',
})

const migraSemiboldFont = localFont({
  src: '../fonts/Migra-SemiboldItalic.otf',
  variable: '--font-migra-semibold-local',
  display: 'swap',
})

const playfairFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
})

type Props = {
  children: ReactNode
}

export function generateStaticParams() {
  return supportedLocales.locales.map((locale) => ({ locale }))
}

export const viewport = {
  themeColor: '#4C0E0F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export async function generateMetadata() {
  const locale = await getLocaleFromCookie()

  // Specify the namespace for translations
  const t = await getTranslations('Index')

  return {
    metadataBase: new URL('https://nehemiah-osc.org'),
    title: {
      default: t('title'),
      template: '%s | EOTC Bible',
    },
    description: t('description'),
    keywords: [
      'Ethiopian Bible',
      'EOTC Bible',
      'Ethiopian Orthodox Bible',
      'Tewahedo Bible',
      'Amharic Bible',
      "Ge'ez Bible",
      'Tigrigna Bible',
      'Oromiffa Bible',
      '81 books Bible',
      'Book of Enoch',
      'Book of Jubilees',
      'Ethiopian Orthodox Tewahedo Church',
      'የኢትዮጵያ ኦርቶዶክስ መጽሐፍ ቅዱስ',
      'መጽሐፍ ቅዱስ',
      'read Bible online free',
    ],
    alternates: {
      canonical: 'https://nehemiah-osc.org',
      languages: {
        'en': 'https://nehemiah-osc.org',
        'am': 'https://nehemiah-osc.org',
        'x-default': 'https://nehemiah-osc.org',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: 'EOTC Bible',
        },
      ],
      url: 'https://nehemiah-osc.org',
      siteName: t('siteName'),
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@eotc_bible',
      title: t('title'),
      description: t('description'),
      images: ['/logo.png'],
    },
    icons: {
      icon: '/logo.png',
      shortcut: '/logo.png',
      apple: '/logo.png',
    },
    manifest: '/manifest.json',
    verification: {
      google: 'VKulgItdfOdwf_AkC_1vFG6YZTOkXHies8nIdCJ9b4U',
    },
  }
}

const SUPPORTED_LOCALES = ['en', 'am', 'gez', 'tg', 'or'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export default async function LocaleLayout({ children }: Props) {
  const locale = await getLocaleFromCookie()
  // Validate locale or fallback
  const resolvedLocale: SupportedLocale = SUPPORTED_LOCALES.includes(locale as SupportedLocale)
    ? (locale as SupportedLocale)
    : 'en'

  if (['en', 'am', 'gez', 'tg', 'or'].includes(resolvedLocale)) {
    setRequestLocale(resolvedLocale)
  }

  // Safely load translation messages
  let messages
  try {
    messages = (await import(`@/messages/${resolvedLocale}.json`)).default
  } catch (error) {
    console.error(`⚠️ Failed to load messages for locale: ${resolvedLocale}`, error)
    messages = (await import('@/messages/en.json')).default
  }

  return (
    <html lang={resolvedLocale} suppressHydrationWarning>
      <body
        className={cn(
          'bg-background min-h-screen font-sans antialiased',
          abyssinicaFont.variable,
          brittiSansFont.variable,
          polySansFont.variable,
          migraFont.variable,
          migraSemiboldFont.variable,
          playfairFont.variable,
          polySansWideFont.variable,
        )}
      >
        <NextIntlClientProvider locale={resolvedLocale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <OfflineStatusProvider />
            <GoogleAuthProvider>
              {children}
            </GoogleAuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>

        <Script id="schema-script" type="application/ld+json">
          {JSON.stringify(
            {
              '@context': 'https://schema.org',
              '@type': 'ReligiousOrganization',
              name: 'Ethiopian Orthodox Tewahedo Church Bible',
              alternateName: 'EOTC Bible',
              url: 'https://eotcbible.org',
              description: 'Digital Bible platform for the Ethiopian Orthodox Tewahedo Church',
              foundingDate: '2024',
              sameAs: [
                'https://github.com/eotcbible',
                'https://x.com/eotc_bible',
                'https://www.facebook.com/eotcbible',
                'https://instagram.com/eotc_bible',
              ],
              areaServed: 'Worldwide',
              keywords:
                "bible, ethiopian orthodox, tewahedo, scripture, ge'ez, amharic, tigrigna, oromigna",
            },
            null,
            2,
          )}
        </Script>
      </body>
    </html>
  )
}
