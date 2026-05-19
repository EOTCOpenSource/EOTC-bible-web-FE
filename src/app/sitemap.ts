import { MetadataRoute } from 'next'
import { books } from '@/data/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nehemiah-osc.org'

  // Static routes with proper priorities
  const staticRoutes = [
    { route: '', priority: 1.0, changeFreq: 'weekly' as const },
    { route: '/read-online', priority: 0.9, changeFreq: 'weekly' as const },
    { route: '/plans', priority: 0.8, changeFreq: 'weekly' as const },
    { route: '/search', priority: 0.5, changeFreq: 'monthly' as const },
    { route: '/privacy-policy', priority: 0.3, changeFreq: 'yearly' as const },
    { route: '/terms-and-conditions', priority: 0.3, changeFreq: 'yearly' as const },
    { route: '/data-deletion', priority: 0.3, changeFreq: 'yearly' as const },
  ].map((item) => ({
    url: `${baseUrl}${item.route}`,
    lastModified: new Date(),
    changeFrequency: item.changeFreq,
    priority: item.priority,
  }))

  // Dynamic routes for Bible books and chapters
  const bibleRoutes: MetadataRoute.Sitemap = []

  books.forEach((book) => {
    const bookId = book.book_name_en.replace(/ /g, '-').toLowerCase()

    // Add each chapter — these are the most valuable pages for SEO
    for (let i = 1; i <= book.chapters; i++) {
      bibleRoutes.push({
        url: `${baseUrl}/read-online/${bookId}/${i}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })
    }
  })

  return [...staticRoutes, ...bibleRoutes]
}
