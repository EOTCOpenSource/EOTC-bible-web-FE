export interface BibleVerse {
  verse: number
  text: string
}

export interface BibleSection {
  title: string
  verses: BibleVerse[]
}

export interface BibleChapter {
  chapter: number
  sections: BibleSection[]
}

export interface BibleBook {
  book_number: number
  book_name_am: string
  book_short_name_am: string
  book_name_en: string
  book_short_name_en: string
  testament: 'old' | 'new'
  chapters: BibleChapter[]
}

export interface SearchResult {
  type: 'book' | 'verse'
  book_number: number
  book_name_en: string
  book_name_am: string
  book_short_name_en: string
  chapter?: number
  verse?: number
  text?: string
  section_title?: string
}
