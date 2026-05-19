import { promises as fs } from 'fs'
import path from 'path'
import ReaderClient from './reader-client'
import { books } from '@/data/data'
import OfflineReaderFallback from '@/components/reader/OfflineReaderFallback'
import type { Metadata } from 'next'

async function getBookData(bookId: string) {
  const bibleDataPath = path.join(process.cwd(), 'src', 'data', 'bible-data')
  try {
    const bookData = books.find((b) => b.book_name_en.replace(/ /g, '-').toLowerCase() === bookId)
    if (!bookData) return null

    const files = await fs.readdir(bibleDataPath)
    for (const file of files) {
      if (file.includes(bookData.file_name)) {
        const jsonPath = path.join(bibleDataPath, file)
        const fileContent = await fs.readFile(jsonPath, 'utf8')
        return JSON.parse(fileContent)
      }
    }
  } catch (error) {
    console.error('Could not read bible data:', error)
  }
  return null
}

function getBookInfo(bookId: string) {
  return books.find((b) => b.book_name_en.replace(/ /g, '-').toLowerCase() === bookId) || null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bookId: string; chapter: string }>
}): Promise<Metadata> {
  const { bookId, chapter } = await params
  const bookInfo = getBookInfo(bookId)

  if (!bookInfo) {
    return {
      title: 'Book Not Found | EOTC Bible',
      description:
        'The requested book could not be found in the Ethiopian Orthodox Tewahedo Church Bible.',
    }
  }

  const bookNameEn = bookInfo.book_name_en
  const bookNameAm = bookInfo.book_name_am
  const chapterNum = parseInt(chapter)

  const title = `${bookNameEn} Chapter ${chapterNum} - ${bookNameAm} | EOTC Bible`
  const description = `Read ${bookNameEn} Chapter ${chapterNum} (${bookNameAm}) from the Ethiopian Orthodox Tewahedo Church Bible. Explore the 81-book EOTC canon in Amharic and English.`

  const canonicalUrl = `https://nehemiah-osc.org/read-online/${bookId}/${chapter}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'EOTC Bible',
      type: 'article',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `${bookNameEn} Chapter ${chapterNum} - EOTC Bible`,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: `${bookNameEn} ${chapterNum} - ${bookNameAm}`,
      description,
    },
    other: {
      'article:section': bookInfo.testament === 'old' ? 'Old Testament' : 'New Testament',
    },
  }
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ bookId: string; chapter: string }>
}) {
  const { bookId, chapter } = await params
  const bookData = await getBookData(bookId)
  const bookInfo = getBookInfo(bookId)

  if (!bookData) {
    // Book not found on server — let the client fallback handle offline
    return (
      <OfflineReaderFallback bookId={bookId} chapter={chapter}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Book not found</p>
        </div>
      </OfflineReaderFallback>
    )
  }

  const chapterData = bookData.chapters.find((c: any) => c.chapter === parseInt(chapter))

  if (!chapterData) {
    return (
      <OfflineReaderFallback bookId={bookId} chapter={chapter}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Chapter not found</p>
        </div>
      </OfflineReaderFallback>
    )
  }

  const currentChapter = parseInt(chapter)
  const totalChapters = bookData.chapters.length
  const prevChapter = currentChapter > 1 ? currentChapter - 1 : null
  const nextChapter = currentChapter < totalChapters ? currentChapter + 1 : null

  // Build BreadcrumbList JSON-LD for structured data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://nehemiah-osc.org',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Bible',
        item: 'https://nehemiah-osc.org/read-online',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: bookInfo?.book_name_en || bookId,
        item: `https://nehemiah-osc.org/read-online/${bookId}/1`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: `Chapter ${chapter}`,
        item: `https://nehemiah-osc.org/read-online/${bookId}/${chapter}`,
      },
    ],
  }

  // Build Book schema for the scripture page
  const bookSchemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    name: `${bookInfo?.book_name_en || bookId} Chapter ${chapter}`,
    alternateName: `${bookInfo?.book_name_am || ''} ${chapter}`,
    isPartOf: {
      '@type': 'Book',
      name: `${bookInfo?.book_name_en || bookId}`,
      alternateName: bookInfo?.book_name_am || '',
      inLanguage: ['am', 'gez'],
      isPartOf: {
        '@type': 'Book',
        name: 'Ethiopian Orthodox Tewahedo Church Bible',
        alternateName: 'EOTC Bible',
        numberOfPages: 81,
      },
    },
    url: `https://nehemiah-osc.org/read-online/${bookId}/${chapter}`,
    inLanguage: ['am', 'gez'],
  }

  return (
    <OfflineReaderFallback bookId={bookId} chapter={chapter}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchemaJsonLd) }}
      />
      <ReaderClient
        bookData={bookData}
        chapterData={chapterData}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        bookId={bookId}
      />
    </OfflineReaderFallback>
  )
}
