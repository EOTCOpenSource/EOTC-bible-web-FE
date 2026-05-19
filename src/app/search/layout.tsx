import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search the Bible - Ethiopian Orthodox Tewahedo Church | EOTC Bible',
  description:
    'Search across all 81 books of the Ethiopian Orthodox Tewahedo Church Bible. Find verses, passages, and scriptures in Amharic and English.',
  alternates: {
    canonical: 'https://nehemiah-osc.org/search',
  },
  openGraph: {
    title: 'Search the EOTC Bible',
    description: 'Search across all 81 books of the Ethiopian Orthodox Tewahedo Church Bible.',
    url: 'https://nehemiah-osc.org/search',
    siteName: 'EOTC Bible',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
