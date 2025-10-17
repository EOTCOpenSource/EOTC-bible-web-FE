import { getLocaleFromCookie } from '@/i18n/locale'
import { cn } from '@/lib/utils'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Abyssinica_SIL } from 'next/font/google'
import Script from 'next/script'
import { ReactNode } from 'react'

import './globals.css'
import { supportedLocales } from '@/i18n/routing'

const abyssinicaFont = Abyssinica_SIL({
    subsets: ['ethiopic'],
    variable: '--font-sans',
    weight: '400',
})

type Props = {
    children: ReactNode
}

export function generateStaticParams() {
    return supportedLocales.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: Omit<Props, 'children'>) {
    const locale = await getLocaleFromCookie();

    // Specify the namespace for translations
    const t = await getTranslations('Index')

    return {
        title: t('title'),
        description: t('description'),
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
            url: 'https://eotcbible.org',
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
    }
}




const SUPPORTED_LOCALES = ['en', 'am', 'gez', 'tg', 'or'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export default async function LocaleLayout({ children }: Props) {
    const locale = await getLocaleFromCookie();
    // Validate locale or fallback
    const resolvedLocale: SupportedLocale = SUPPORTED_LOCALES.includes(locale as SupportedLocale)
        ? (locale as SupportedLocale)
        : 'en';

    if (['en', 'am', 'gez', 'tg', 'or'].includes(resolvedLocale)) {
        setRequestLocale(resolvedLocale);
    }

    // Safely load translation messages
    let messages;
    try {
        messages = (await import(`@/messages/${resolvedLocale}.json`)).default;
    } catch (error) {
        console.error(`⚠️ Failed to load messages for locale: ${resolvedLocale}`, error);
        messages = (await import('@/messages/en.json')).default;
    }

    return (
        <html lang={resolvedLocale}>
            <body
                className={cn(
                    'bg-background min-h-screen font-sans antialiased',
                    abyssinicaFont.variable
                )}
            >
                <NextIntlClientProvider locale={resolvedLocale} messages={messages}>
                    {children}
                </NextIntlClientProvider>

                <Script id="schema-script" type="application/ld+json">
                    {JSON.stringify(
                        {
                            '@context': 'https://schema.org',
                            '@type': 'ReligiousOrganization',
                            name: 'Ethiopian Orthodox Tewahedo Church Bible',
                            alternateName: 'EOTC Bible',
                            url: 'https://eotcbible.org',
                            description:
                                'Digital Bible platform for the Ethiopian Orthodox Tewahedo Church',
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
                        2
                    )}
                </Script>
            </body>
        </html>
    );
}
