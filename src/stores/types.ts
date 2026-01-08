//defining types that will be used in the stores

export type BookId = string // E.g., "gen", "exo", "psa"...

export interface VerseRef {
  book: BookId
  chapter: number
  verseStart: number
  verseCount: number
}

export interface Settings {
  theme: 'light' | 'dark' | 'system'
  fontSize: number
  lastOpenedChapter?: {
    book: BookId
    chapter: number
  }
}

export interface User {
  id: string
  name: string
  email?: string
  settings?: Settings
}

export interface Note {
  _id: string
  verseRef: VerseRef
  content: string
  createdAt: string
  updatedAt?: string
  tags?: string[]
  visibility?: 'public' | 'private'
}

export type HighlightColor = 'yellow' | 'green' | 'pink' | 'blue' | 'red' | 'purple'

export interface Highlight {
  _id: string
  verseRef: VerseRef
  color: HighlightColor
  createdAt: string
}

export interface BookMark {
  _id: string
  bookId: BookId
  chapter: number
  verseStart: number
  verseCount: number
  verseRef?: VerseRef
  createdAt: string
}

export interface BibleBook {
  book_number: number
  book_name_am: string
  book_short_name_am: string
  book_name_en: string
  book_short_name_en: string
  testament: string
  chapters: {
    chapter: number
    sections: {
      title: string | null
      verses: {
        verse: number
        text: string
      }[]
    }[]
  }[]
}

export interface Progress {
  chaptersRead: Record<string, number[]>
  streak: {
    current: number
    longest: number
    lastDate?: string
  }
  lastRead?: VerseRef
  totalChaptersRead?: number
  _id?: string
  userId?: string
  createdAt?: string
  updatedAt?: string
}

export interface DailyReading {
  dayNumber: number
  date: Date | string
  readings: {
    book: string
    startChapter: number
    endChapter: number
  }[]
  isCompleted: boolean
  completedAt?: string
}

export interface ReadingPlan {
  _id: string
  name: string
  startBook: string
  startChapter?: number
  endBook: string
  endChapter?: number
  startDate?: string
  durationInDays: number
  dailyReadings: DailyReading[]
  status?: 'active' | 'completed'
  isPublic?: boolean
  createdAt: string
}
export interface ReadingPlanCreateData {
  _id: string
  name: string
  startBook: string
  startChapter: number
  endBook: string
  endChapter?: number
  startDate: string
  durationInDays: number
}
