import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { books } from '@/data/data'
import { toEthiopianDate } from '@/lib/ethiopianCalendar'
import type { BibleBook } from './types'

interface DailyVerse {
  text: string
  reference: string
  bookId: string
  chapter: number
  verse: number
  occasion?: string
}

interface VerseStats {
  likes: number
  shares: number
  bookmarks: number
  userLiked: boolean
  userShared: boolean
  userBookmarked: boolean
}

interface DailyVerseState {
  verse: DailyVerse | null
  verseDayKey: string | null
  isLoading: boolean
  error?: string | null
  stats: VerseStats | null
  loadDailyVerse: () => Promise<void>
  clearError: () => void
  initStats: (likesStr: string, sharesStr: string, bookmarksStr: string) => void
  toggleLike: () => void
  toggleShare: () => void
  toggleBookmark: () => void
}

type VerseLocation = {
  bookNameEn: string
  chapter: number
  verse: number
}

type VerseSelection = {
  loc: VerseLocation
  occasion?: string
}

const toLocalDayKey = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const MS_PER_DAY = 24 * 60 * 60 * 1000
const startOfLocalDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const diffDaysLocal = (a: Date, b: Date) =>
  Math.round((startOfLocalDay(a).getTime() - startOfLocalDay(b).getTime()) / MS_PER_DAY)

// Meeus Julian algorithm + 13-day shift (valid for 1900-2099) to get Orthodox Easter in Gregorian.
const orthodoxEasterGregorianUtc = (year: number) => {
  const a = year % 4
  const b = year % 7
  const c = year % 19
  const d = (19 * c + 15) % 30
  const e = (2 * a + 4 * b - d + 34) % 7
  const monthJulian = Math.floor((d + e + 114) / 31) // 3=March, 4=April (Julian)
  const dayJulian = ((d + e + 114) % 31) + 1

  const shiftDays = 13
  return new Date(Date.UTC(year, monthJulian - 1, dayJulian + shiftDays))
}

const getVerseAtLocation = async (loc: VerseLocation): Promise<DailyVerse> => {
  const book = books.find((b) => b.book_name_en === loc.bookNameEn)
  if (!book) throw new Error(`Unknown book name: ${loc.bookNameEn}`)

  const bookData: BibleBook = await import(`@/data/bible-data/${book.file_name}.json`).then(
    (m) => m.default,
  )

  const chapterData = bookData.chapters?.find((c) => c.chapter === loc.chapter)
  const allVerses =
    chapterData?.sections?.flatMap((section) => section.verses.map((v) => ({ ...v }))) ?? []
  const verseData = allVerses.find((v) => v.verse === loc.verse)
  if (!verseData) {
    throw new Error(`Verse not found: ${book.book_name_en} ${loc.chapter}:${loc.verse}`)
  }

  const bookName = book.book_short_name_en || book.book_name_en
  const reference = `${bookName} ${loc.chapter}:${loc.verse}`

  return {
    text: verseData.text,
    reference,
    bookId: book.book_name_en.toLowerCase().replace(/ /g, '-'),
    chapter: loc.chapter,
    verse: loc.verse,
  }
}

const getPsalmLocationForEthiopianDate = (etMonth: number, etDay: number): VerseLocation => {
  const dayOfYear0 = (etMonth - 1) * 30 + (etDay - 1)
  const psalmNumber = (dayOfYear0 % 151) + 1
  return { bookNameEn: 'Psalms', chapter: psalmNumber, verse: 1 }
}

// Fixed yearly feasts (Ethiopian month/day).
const FIXED_FEASTS_BY_ETH_MM_DD: Record<string, VerseSelection> = {
  // Meskerem 1: Lideta (Nativity of Mary) + some traditions commemorate St. John the Baptist.
  '1-1': { loc: { bookNameEn: 'Luke', chapter: 1, verse: 28 }, occasion: 'Meskerem 1 (Lideta / Commemoration)' },
  // Meskel (Finding of the True Cross) - Meskerem 17
  '1-17': { loc: { bookNameEn: 'Galatians', chapter: 6, verse: 14 }, occasion: 'Meskel' },
  // Gena (Nativity) - Tahsas 29
  '4-29': { loc: { bookNameEn: 'Luke', chapter: 2, verse: 11 }, occasion: 'Gena' },
  // Timkat (Theophany) - Tir 11
  '5-11': { loc: { bookNameEn: 'Matthew', chapter: 3, verse: 16 }, occasion: 'Timkat' },
  // Kidane Mehret (annual commemoration) - Yekatit 16
  '6-16': { loc: { bookNameEn: 'Lamentations', chapter: 3, verse: 22 }, occasion: 'Kidane Mehret (Yekatit 16)' },
  // St. George (annual) - Ginbot 23
  '9-23': { loc: { bookNameEn: '2 Timothy', chapter: 4, verse: 7 }, occasion: 'Georgis (Ginbot 23)' },
}

// Holy Week + moveable feasts relative to Orthodox Easter Sunday (offset days).
const HOLY_WEEK_BY_EASTER_OFFSET: Record<number, VerseSelection> = {
  [-7]: { loc: { bookNameEn: 'John', chapter: 12, verse: 13 }, occasion: 'Hosanna (Palm Sunday)' },
  [-6]: { loc: { bookNameEn: 'Matthew', chapter: 21, verse: 9 }, occasion: 'Holy Week' },
  [-5]: { loc: { bookNameEn: 'Mark', chapter: 11, verse: 15 }, occasion: 'Holy Week' },
  [-4]: { loc: { bookNameEn: 'John', chapter: 12, verse: 24 }, occasion: 'Holy Week' },
  [-3]: { loc: { bookNameEn: 'John', chapter: 13, verse: 34 }, occasion: 'Holy Week' },
  [-2]: { loc: { bookNameEn: 'Isaiah', chapter: 53, verse: 5 }, occasion: 'Siklet (Good Friday)' },
  [-1]: { loc: { bookNameEn: 'Matthew', chapter: 27, verse: 60 }, occasion: 'Holy Saturday' },
  [0]: { loc: { bookNameEn: 'Matthew', chapter: 28, verse: 6 }, occasion: 'Fasika (Easter)' },
  // Easter is day 1 => +39 days offset = day 40 (Ascension), +49 offset = day 50 (Pentecost)
  [39]: { loc: { bookNameEn: 'Acts', chapter: 1, verse: 9 }, occasion: 'Ascension' },
  [49]: { loc: { bookNameEn: 'Acts', chapter: 2, verse: 4 }, occasion: 'Pentecost' },
}

const GREAT_LENT_VERSES: VerseLocation[] = [
  { bookNameEn: 'Matthew', chapter: 4, verse: 4 },
  { bookNameEn: 'Matthew', chapter: 6, verse: 6 },
  { bookNameEn: 'Matthew', chapter: 6, verse: 16 },
  { bookNameEn: 'Matthew', chapter: 6, verse: 33 },
  { bookNameEn: 'Matthew', chapter: 7, verse: 7 },
  { bookNameEn: 'John', chapter: 3, verse: 16 },
  { bookNameEn: 'John', chapter: 6, verse: 35 },
  { bookNameEn: 'John', chapter: 8, verse: 12 },
  { bookNameEn: 'Hebrews', chapter: 4, verse: 16 },
  { bookNameEn: 'Hebrews', chapter: 12, verse: 2 },
  { bookNameEn: 'Galatians', chapter: 2, verse: 20 },
  { bookNameEn: '2 Corinthians', chapter: 5, verse: 17 },
  { bookNameEn: 'Romans', chapter: 12, verse: 1 },
  { bookNameEn: 'Romans', chapter: 12, verse: 2 },
  { bookNameEn: 'Romans', chapter: 5, verse: 8 },
  { bookNameEn: '1 Corinthians', chapter: 10, verse: 13 },
  { bookNameEn: '1 Corinthians', chapter: 1, verse: 18 },
  { bookNameEn: '1 Peter', chapter: 5, verse: 7 },
  { bookNameEn: 'James', chapter: 4, verse: 8 },
  { bookNameEn: 'James', chapter: 1, verse: 5 },
  { bookNameEn: 'Proverbs', chapter: 3, verse: 5 },
  { bookNameEn: 'Psalms', chapter: 51, verse: 10 },
  { bookNameEn: 'Psalms', chapter: 23, verse: 1 },
  { bookNameEn: 'Psalms', chapter: 27, verse: 1 },
  { bookNameEn: 'Psalms', chapter: 46, verse: 1 },
  { bookNameEn: 'Psalms', chapter: 119, verse: 105 },
  { bookNameEn: 'Isaiah', chapter: 55, verse: 6 },
  { bookNameEn: 'Jonah', chapter: 2, verse: 2 },
  { bookNameEn: 'Daniel', chapter: 9, verse: 19 },
  { bookNameEn: 'Acts', chapter: 3, verse: 19 },
]

const PASCHA_SEASON_VERSES: VerseLocation[] = [
  { bookNameEn: 'John', chapter: 11, verse: 25 },
  { bookNameEn: 'John', chapter: 20, verse: 29 },
  { bookNameEn: 'Matthew', chapter: 28, verse: 19 },
  { bookNameEn: 'Acts', chapter: 1, verse: 8 },
  { bookNameEn: 'Acts', chapter: 2, verse: 4 },
  { bookNameEn: 'Acts', chapter: 4, verse: 12 },
  { bookNameEn: 'Romans', chapter: 6, verse: 4 },
  { bookNameEn: 'Romans', chapter: 8, verse: 11 },
  { bookNameEn: '1 Corinthians', chapter: 15, verse: 20 },
  { bookNameEn: '1 Corinthians', chapter: 15, verse: 57 },
  { bookNameEn: 'Galatians', chapter: 5, verse: 1 },
  { bookNameEn: 'Philippians', chapter: 4, verse: 4 },
  { bookNameEn: 'Hebrews', chapter: 13, verse: 8 },
  { bookNameEn: '1 Peter', chapter: 1, verse: 3 },
  { bookNameEn: 'Psalms', chapter: 118, verse: 24 },
]

const ADVENT_FAST_VERSES: VerseLocation[] = [
  { bookNameEn: 'Isaiah', chapter: 9, verse: 6 },
  { bookNameEn: 'Isaiah', chapter: 40, verse: 3 },
  { bookNameEn: 'Luke', chapter: 1, verse: 37 },
  { bookNameEn: 'Luke', chapter: 1, verse: 46 },
  { bookNameEn: 'Matthew', chapter: 1, verse: 23 },
  { bookNameEn: 'John', chapter: 1, verse: 14 },
]

const FILSETA_FAST_VERSES: VerseLocation[] = [
  { bookNameEn: 'Luke', chapter: 1, verse: 48 },
  { bookNameEn: 'Luke', chapter: 1, verse: 28 },
  { bookNameEn: 'John', chapter: 19, verse: 27 },
  { bookNameEn: 'Revelation', chapter: 12, verse: 1 },
]

const NINEVEH_FAST_VERSES: VerseLocation[] = [
  { bookNameEn: 'Jonah', chapter: 3, verse: 10 },
  { bookNameEn: 'Jonah', chapter: 3, verse: 5 },
  { bookNameEn: 'Psalms', chapter: 51, verse: 17 },
]

const APOSTLES_FAST_VERSES: VerseLocation[] = [
  { bookNameEn: 'Acts', chapter: 1, verse: 8 },
  { bookNameEn: 'Matthew', chapter: 28, verse: 19 },
  { bookNameEn: 'Romans', chapter: 10, verse: 15 },
  { bookNameEn: '2 Timothy', chapter: 4, verse: 2 },
]

// Daily/monthly commemorations keyed by Ethiopian day-of-month (Senksar-style excerpts).
const DAILY_COMM_ETY_DAY: Record<number, VerseSelection[]> = {
  1: [
    { loc: { bookNameEn: 'Luke', chapter: 1, verse: 48 }, occasion: 'Lideta (Birth of Mary)' },
    { loc: { bookNameEn: '1 Kings', chapter: 18, verse: 36 }, occasion: 'Elias (Elijah)' },
  ],
  5: [{ loc: { bookNameEn: 'Matthew', chapter: 16, verse: 18 }, occasion: 'Petros and Paulos' }],
  7: [{ loc: { bookNameEn: 'Matthew', chapter: 28, verse: 19 }, occasion: 'Holy Trinity' }],
  12: [
    { loc: { bookNameEn: 'Daniel', chapter: 12, verse: 1 }, occasion: 'Michael the Archangel' },
    { loc: { bookNameEn: '1 Samuel', chapter: 3, verse: 10 }, occasion: 'Samuel' },
    { loc: { bookNameEn: 'Psalms', chapter: 150, verse: 6 }, occasion: 'Yared (Praise)' },
  ],
  16: [{ loc: { bookNameEn: 'Lamentations', chapter: 3, verse: 22 }, occasion: 'Kidane Mehret' }],
  19: [{ loc: { bookNameEn: 'Luke', chapter: 1, verse: 19 }, occasion: 'Gabriel the Archangel' }],
  21: [{ loc: { bookNameEn: 'Luke', chapter: 1, verse: 28 }, occasion: 'Holy Virgin Mary (Monthly)' }],
  23: [{ loc: { bookNameEn: '2 Timothy', chapter: 4, verse: 7 }, occasion: 'Georgis (St. George)' }],
  26: [{ loc: { bookNameEn: 'John', chapter: 20, verse: 28 }, occasion: 'Thomas the Apostle' }],
  27: [{ loc: { bookNameEn: 'John', chapter: 3, verse: 17 }, occasion: 'Medhane Alem' }],
  29: [{ loc: { bookNameEn: 'Luke', chapter: 2, verse: 11 }, occasion: 'Lideta Christ (Monthly)' }],
  30: [{ loc: { bookNameEn: 'Mark', chapter: 16, verse: 15 }, occasion: 'Markos (St. Mark)' }],
}

const pickDeterministic = (choices: VerseSelection[], etYear: number, etMonth: number, etDay: number) => {
  if (choices.length === 1) return choices[0]
  const idx = (etYear + etMonth + etDay) % choices.length
  return choices[idx]
}

const WEEKDAY_OBSERVANCE: Record<number, VerseSelection> = {
  // JS: 0=Sunday..6=Saturday
  0: { loc: { bookNameEn: 'Psalms', chapter: 122, verse: 1 }, occasion: 'Sunday (Senbete)' },
  1: { loc: { bookNameEn: 'Psalms', chapter: 5, verse: 3 }, occasion: 'Monday (Sagno)' },
  2: { loc: { bookNameEn: 'Revelation', chapter: 2, verse: 10 }, occasion: 'Tuesday (Maksagno)' },
  3: { loc: { bookNameEn: 'Matthew', chapter: 4, verse: 17 }, occasion: 'Wednesday (Fasting/Repentance)' },
  4: { loc: { bookNameEn: 'Hebrews', chapter: 13, verse: 16 }, occasion: 'Thursday (Hamus)' },
  5: { loc: { bookNameEn: 'Isaiah', chapter: 53, verse: 5 }, occasion: 'Friday (Crucifixion fast)' },
  6: { loc: { bookNameEn: 'Hebrews', chapter: 4, verse: 9 }, occasion: 'Saturday (Qadamit Sanbat)' },
}

const resolveEthiopianDaysUntil = (etMonth: number, etDay: number, targetMonth: number, targetDay: number) => {
  const today0 = (etMonth - 1) * 30 + (etDay - 1)
  const target0 = (targetMonth - 1) * 30 + (targetDay - 1)
  const yearDays = 365 // good enough for season windows; Pagume adds 5/6 at end.
  const raw = target0 - today0
  return raw >= 0 ? raw : raw + yearDays
}

const resolveDailyVerseSelection = (today: Date): VerseSelection => {
  const et = toEthiopianDate(today)

  // 1) Major fixed feasts (Ethiopian date)
  const fixed = FIXED_FEASTS_BY_ETH_MM_DD[`${et.month}-${et.day}`]
  if (fixed) return fixed

  // 2) Moveable feasts (relative to Fasika)
  const easterUtc = orthodoxEasterGregorianUtc(today.getFullYear())
  const easterLocal = new Date(
    easterUtc.getUTCFullYear(),
    easterUtc.getUTCMonth(),
    easterUtc.getUTCDate(),
  )
  const offset = diffDaysLocal(today, easterLocal)
  const moveable = HOLY_WEEK_BY_EASTER_OFFSET[offset]
  if (moveable) return moveable

  // 2.5) Fast of Nineveh (3-day fast about 3 weeks before Great Lent starts)
  // Great Lent starts at offset -55, so Nineveh is roughly -76..-74 (3 days).
  if (offset >= -76 && offset <= -74) {
    const idx = offset - -76 // 0..2
    return { loc: NINEVEH_FAST_VERSES[idx % NINEVEH_FAST_VERSES.length], occasion: 'Fast of Nineveh' }
  }

  // 3) Great Lent (Hudade): 55 days leading up to Fasika, excluding Holy Week.
  if (offset >= -55 && offset < -7) {
    const dayIndex = offset - -55 // 0..47
    return { loc: GREAT_LENT_VERSES[dayIndex % GREAT_LENT_VERSES.length], occasion: 'Great Lent (Hudade)' }
  }

  // 4) Pascha season (up to 50 days after Fasika)
  if (offset > 0 && offset <= 50) {
    return { loc: PASCHA_SEASON_VERSES[(offset - 1) % PASCHA_SEASON_VERSES.length], occasion: 'Pascha Season' }
  }

  // 4.5) Fast of the Apostles (after Pentecost). Length varies (10-40 days); we cap at 40 here.
  if (offset >= 50 && offset <= 89) {
    return { loc: APOSTLES_FAST_VERSES[(offset - 50) % APOSTLES_FAST_VERSES.length], occasion: 'Fast of the Apostles' }
  }

  // 4.6) Fast of the Assumption (Filseta): Nehase 1-16
  if (et.month === 12 && et.day >= 1 && et.day <= 16) {
    const idx = (et.day - 1) % FILSETA_FAST_VERSES.length
    return { loc: FILSETA_FAST_VERSES[idx], occasion: et.day === 16 ? 'Filseta (Assumption)' : 'Fast of Filseta' }
  }

  // 4.7) Fast of the Prophets (Advent): 40 days before Gena (Tahsas 29)
  const daysUntilGena = resolveEthiopianDaysUntil(et.month, et.day, 4, 29)
  if (daysUntilGena >= 1 && daysUntilGena <= 40) {
    const idx = (40 - daysUntilGena) % ADVENT_FAST_VERSES.length
    return { loc: ADVENT_FAST_VERSES[idx], occasion: 'Fast of the Prophets (Advent)' }
  }

  // 5) Daily/monthly commemorations (Senksar day-of-month)
  const comms = DAILY_COMM_ETY_DAY[et.day]
  if (comms && comms.length > 0) {
    return pickDeterministic(comms, et.year, et.month, et.day)
  }

  // 5.5) Weekly Wednesday & Friday fasts (except during the 50 days after Fasika which is already handled above).
  if (today.getDay() === 3) {
    return { loc: { bookNameEn: 'Matthew', chapter: 6, verse: 16 }, occasion: 'Wednesday Fast' }
  }
  if (today.getDay() === 5) {
    return { loc: { bookNameEn: 'Isaiah', chapter: 53, verse: 5 }, occasion: 'Friday Fast' }
  }

  // 6) Weekday observances
  const weekday = WEEKDAY_OBSERVANCE[today.getDay()]
  if (weekday) return weekday

  // 7) Stable Ethiopian-calendar plan (30-day month-based)
  return { loc: getPsalmLocationForEthiopianDate(et.month, et.day), occasion: 'Daily Reading' }
}

const getDailyVerse = async (): Promise<DailyVerse> => {
  const today = new Date()
  const selection = resolveDailyVerseSelection(today)

  try {
    const verse = await getVerseAtLocation(selection.loc)
    return { ...verse, occasion: selection.occasion }
  } catch {
    const et = toEthiopianDate(today)
    const verse = await getVerseAtLocation(getPsalmLocationForEthiopianDate(et.month, et.day))
    return { ...verse, occasion: 'Daily Reading' }
  }
}

const parseStat = (str: string) => {
  const num = parseFloat(str)
  if (str.toLowerCase().includes('k')) return num * 1000
  if (str.toLowerCase().includes('m')) return num * 1000000
  return num || 0
}

export const useDailyVerseStore = create<DailyVerseState>()(
  devtools(
    persist(
      (set, get) => ({
        verse: null,
        verseDayKey: null,
        isLoading: false,
        error: null,
        stats: null,

        clearError: () => set({ error: null }),

        loadDailyVerse: async () => {
          set({ isLoading: true, error: null })
          try {
            const todayKey = toLocalDayKey(new Date())
            const existing = get().verse
            const existingKey = get().verseDayKey

            if (existing && existingKey === todayKey) {
              set({ isLoading: false })
              return
            }

            const verse = await getDailyVerse()
            set({ verse, verseDayKey: todayKey, isLoading: false })
          } catch (err: any) {
            set({ isLoading: false, error: err?.message ?? 'Failed to load daily verse' })
          }
        },

        initStats: (likesStr, sharesStr, bookmarksStr) => {
          if (!get().stats) {
            set({
              stats: {
                likes: parseStat(likesStr),
                shares: parseStat(sharesStr),
                bookmarks: parseStat(bookmarksStr),
                userLiked: false,
                userShared: false,
                userBookmarked: false,
              },
            })
          }
        },

        toggleLike: () =>
          set((state) => {
            if (!state.stats) return state
            const { userLiked, likes } = state.stats
            return {
              stats: {
                ...state.stats,
                userLiked: !userLiked,
                likes: userLiked ? likes - 1 : likes + 1,
              },
            }
          }),

        toggleShare: () =>
          set((state) => {
            if (!state.stats) return state
            const { userShared, shares } = state.stats
            return {
              stats: {
                ...state.stats,
                userShared: !userShared,
                shares: userShared ? shares - 1 : shares + 1,
              },
            }
          }),

        toggleBookmark: () =>
          set((state) => {
            if (!state.stats) return state
            const { userBookmarked, bookmarks } = state.stats
            return {
              stats: {
                ...state.stats,
                userBookmarked: !userBookmarked,
                bookmarks: userBookmarked ? bookmarks - 1 : bookmarks + 1,
              },
            }
          }),
      }),
      {
        name: 'daily-verse-storage',
      }
    )
  )
)
