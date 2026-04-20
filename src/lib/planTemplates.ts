import { books } from '@/data/data'

export type PlanTemplate = {
  slug: string
  title: string
  description: string
  image: string
  durationInDays: number
  startBook: string
  startChapter: number
  endBook: string
  endChapter: number
  tags?: string[]
}

const clampChapter = (bookNameEn: string, chapter: number) => {
  const book = books.find((b) => b.book_name_en === bookNameEn)
  if (!book) return Math.max(1, chapter)
  return Math.min(Math.max(1, chapter), book.chapters || 1)
}

const safeTemplate = (t: PlanTemplate): PlanTemplate => {
  const startChapter = clampChapter(t.startBook, t.startChapter)
  const endChapter = clampChapter(t.endBook, t.endChapter)
  return { ...t, startChapter, endChapter }
}

export const PLAN_TEMPLATES: PlanTemplate[] = [
  safeTemplate({
    slug: 'psalms-30-days',
    title: 'Psalms in 30 days',
    description: 'Join our 30-day Psalms meditation. Reflect on hope and faith.',
    image: '/plans/plan1.png',
    durationInDays: 30,
    startBook: 'Psalms',
    startChapter: 1,
    endBook: 'Psalms',
    endChapter: 30,
    tags: ['Featured', 'Encouragement'],
  }),
  safeTemplate({
    slug: 'body-of-christ',
    title: 'The Body of Christ',
    description:
      'A deep dive into what it means to be part of the community of believers.',
    image: '/plans/plan2.png',
    durationInDays: 14,
    startBook: 'Ephesians',
    startChapter: 4,
    endBook: 'Ephesians',
    endChapter: 6,
    tags: ['Featured', 'Whole Bible'],
  }),
  safeTemplate({
    slug: 'becoming-resilient',
    title: 'Becoming Resilient',
    description: 'A guide to building spiritual strength and overcoming adversity.',
    image: '/plans/plan3.png',
    durationInDays: 30,
    startBook: 'James',
    startChapter: 1,
    endBook: 'James',
    endChapter: 5,
    tags: ['Featured', 'Wisdom'],
  }),
  safeTemplate({
    slug: 'good-shepherd',
    title: 'The Good Shepherd',
    description: 'Reflect on the guidance and protection found in the 23rd Psalm.',
    image: '/plans/plan4.png',
    durationInDays: 7,
    startBook: 'Psalms',
    startChapter: 23,
    endBook: 'Psalms',
    endChapter: 23,
    tags: ['Encouragement'],
  }),
  safeTemplate({
    slug: 'moving-forward',
    title: 'Moving Forward in Faith',
    description: "A series on trusting God's plan and taking steps into the unknown.",
    image: '/plans/plan5.png',
    durationInDays: 21,
    startBook: 'Philippians',
    startChapter: 1,
    endBook: 'Philippians',
    endChapter: 4,
    tags: ['Wisdom'],
  }),
  safeTemplate({
    slug: 'believers-journey',
    title: "The Believer's Journey",
    description: 'A 30-day meditation on the path of spiritual growth and discipleship.',
    image: '/plans/plan6.png',
    durationInDays: 30,
    startBook: 'Matthew',
    startChapter: 5,
    endBook: 'Matthew',
    endChapter: 7,
    tags: ['Whole Bible'],
  }),
]

export const getPlanTemplateBySlug = (slug: string) =>
  PLAN_TEMPLATES.find((t) => t.slug === slug)
