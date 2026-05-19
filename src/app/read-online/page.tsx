import type { Metadata } from 'next'
import ReadOnlineClient from '@/components/reader/ReadOnlineClient'

export const metadata: Metadata = {
  title: 'Read the Bible Online - Ethiopian Orthodox Tewahedo Church | EOTC Bible',
  description:
    'Read the complete 81-book Ethiopian Orthodox Tewahedo Church Bible online for free. Browse Old Testament, New Testament, and Deuterocanonical books including the Book of Enoch, Jubilees, and Sirach in Amharic and English.',
  alternates: {
    canonical: 'https://nehemiah-osc.org/read-online',
  },
  openGraph: {
    title: 'Read the EOTC Bible Online',
    description:
      'Explore the complete 81-book Ethiopian Orthodox Tewahedo Church Bible. Read scriptures in Amharic and English.',
    url: 'https://nehemiah-osc.org/read-online',
    siteName: 'EOTC Bible',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'EOTC Bible - Read Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Read the EOTC Bible Online',
    description: 'Explore the complete 81-book Ethiopian Orthodox Tewahedo Church Bible online.',
  },
  keywords: [
    'Ethiopian Bible',
    'EOTC Bible',
    'Ethiopian Orthodox Bible',
    'Tewahedo Bible',
    'Amharic Bible',
    "Ge'ez Bible",
    '81 books Bible',
    'Book of Enoch',
    'Book of Jubilees',
    'read Bible online',
    'Ethiopian Orthodox Tewahedo Church',
    'የኢትዮጵያ ኦርቶዶክስ መጽሐፍ ቅዱስ',
  ],
}

export default function ReadOnlinePage() {
  return <ReadOnlineClient />
}
