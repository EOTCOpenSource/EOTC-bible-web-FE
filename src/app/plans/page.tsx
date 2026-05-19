import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { PlansExploreClient } from '@/components/plans/explore/PlansExploreClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bible Reading Plans - Ethiopian Orthodox Tewahedo Church | EOTC Bible',
  description:
    'Discover guided Bible reading plans for the Ethiopian Orthodox Tewahedo Church Bible. Create custom plans, follow curated schedules, and grow daily in the Word with the 81-book EOTC canon.',
  alternates: {
    canonical: 'https://nehemiah-osc.org/plans',
  },
  openGraph: {
    title: 'Bible Reading Plans | EOTC Bible',
    description:
      'Find a Bible reading plan that fits your spiritual journey. Explore curated plans or create your own with the EOTC Bible.',
    url: 'https://nehemiah-osc.org/plans',
    siteName: 'EOTC Bible',
    type: 'website',
    images: [
      {
        url: '/plans-hero.png',
        width: 1200,
        height: 630,
        alt: 'EOTC Bible Reading Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bible Reading Plans | EOTC Bible',
    description: 'Discover guided reading plans for the Ethiopian Orthodox Tewahedo Church Bible.',
  },
}

export default function PlansExplorePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <main className="w-full pt-24">
        <PlansExploreClient />
      </main>
      <Footer />
    </div>
  )
}
