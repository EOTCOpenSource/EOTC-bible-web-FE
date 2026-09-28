export type VerseLocation = {
  bookNameEn: string
  chapter: number
  verse: number
}

export type VerseSelection = {
  loc: VerseLocation
  occasion: string
  occasionAm: string
}

export type VotdOptions = {
  date?: string | Date
  ethDate?: string | { year: number; month: number; day: number }
}

export type VotdResponse = {
  status: 'success'
  data: {
    date: {
      gregorian: string
      ethiopian: {
        year: number
        month: number
        day: number
        monthNameAm: string
        formattedAm: string
      }
    }
    liturgical: {
      occasion: string
      occasionAm: string
    }
    verse: {
      book: string
      bookShort: string
      bookId: string
      chapter: number
      verse: number
      reference: string
      text: string
    }
    url: string
  }
}
