import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { books } from '@/data/data'
import Kenat from 'kenat'
import type { BibleBook } from './types'
import {
  FIXED_FEASTS_BY_ETH_MM_DD,
  HOLY_WEEK_BY_EASTER_OFFSET,
  GREAT_LENT_VERSES,
  PASCHA_SEASON_VERSES,
  ADVENT_FAST_VERSES,
  FILSETA_FAST_VERSES,
  NINEVEH_FAST_VERSES,
  APOSTLES_FAST_VERSES,
  DAILY_COMM_ETY_DAY,
  WEEKDAY_OBSERVANCE,
} from '@/lib/votd/constants'
import type { VerseLocation, VerseSelection } from '@/lib/votd/types'

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

  const bookName = book.book_short_name_am || book.book_name_am || book.book_name_en
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

const pickDeterministic = (choices: VerseSelection[], etYear: number, etMonth: number, etDay: number) => {
  if (choices.length === 1) return choices[0]
  const idx = (etYear + etMonth + etDay) % choices.length
  return choices[idx]
}

const resolveDailyVerseSelection = (): VerseSelection => {
  const nowInEthiopia = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' }),
  )
  const kenatToday = new Kenat(nowInEthiopia)
  const et = kenatToday.ethiopian
  const weekday = kenatToday.weekday()

  // 1) Major fixed feasts (Ethiopian date)
  const fixed = FIXED_FEASTS_BY_ETH_MM_DD[`${et.month}-${et.day}`]
  if (fixed) return fixed

  // 2) Moveable feasts (relative to Fasika)
  const bh = kenatToday.getBahireHasab()
  const easterEt = bh.movableFeasts.fasika.ethiopian
  const easterKenat = new Kenat({ year: easterEt.year, month: easterEt.month, day: easterEt.day })

  const offset = kenatToday.diffInDays(easterKenat)

  const moveable = HOLY_WEEK_BY_EASTER_OFFSET[offset]
  if (moveable) return moveable

  // 2.5) Fast of Nineveh
  if (offset >= -76 && offset <= -74) {
    const idx = offset - -76
    return { loc: NINEVEH_FAST_VERSES[idx % NINEVEH_FAST_VERSES.length], occasion: 'Fast of Nineveh', occasionAm: 'ጾመ ነነዌ' }
  }

  // 3) Great Lent (Hudade)
  if (offset >= -55 && offset < -7) {
    const dayIndex = offset - -55
    return { loc: GREAT_LENT_VERSES[dayIndex % GREAT_LENT_VERSES.length], occasion: 'Great Lent (Hudade)', occasionAm: 'ዐቢይ ጾም' }
  }

  // 4) Pascha season
  if (offset > 0 && offset <= 50) {
    return { loc: PASCHA_SEASON_VERSES[(offset - 1) % PASCHA_SEASON_VERSES.length], occasion: 'Pascha Season', occasionAm: 'ዘመነ ፋሲካ' }
  }

  // 4.5) Fast of the Apostles
  if (offset >= 50 && offset <= 89) {
    return { loc: APOSTLES_FAST_VERSES[(offset - 50) % APOSTLES_FAST_VERSES.length], occasion: 'Fast of the Apostles', occasionAm: 'ጾመ ሐዋርያት' }
  }

  // 4.6) Fast of the Assumption (Filseta)
  if (et.month === 12 && et.day >= 1 && et.day <= 16) {
    const idx = (et.day - 1) % FILSETA_FAST_VERSES.length
    return { loc: FILSETA_FAST_VERSES[idx], occasion: et.day === 16 ? 'Filseta (Assumption)' : 'Fast of Filseta', occasionAm: 'ጾመ ፍልሰታ' }
  }

  // 4.7) Fast of the Prophets (Advent)
  const genaDate = new Kenat({ year: et.year, month: 4, day: 29 })
  const daysUntilGena = genaDate.diffInDays(kenatToday)
  if (daysUntilGena >= 1 && daysUntilGena <= 40) {
    const idx = (40 - daysUntilGena) % ADVENT_FAST_VERSES.length
    return { loc: ADVENT_FAST_VERSES[idx], occasion: 'Fast of the Prophets (Advent)', occasionAm: 'ጾመ ነቢያት' }
  }

  // 5) Daily/monthly commemorations
  const comms = DAILY_COMM_ETY_DAY[et.day]
  if (comms && comms.length > 0) {
    return pickDeterministic(comms, et.year, et.month, et.day)
  }

  // 5.5) Weekly Wednesday & Friday fasts
  if (weekday === 3) {
    return { loc: { bookNameEn: 'Matthew', chapter: 6, verse: 16 }, occasion: 'Wednesday Fast', occasionAm: 'ጾመ ድኅነት (ረቡዕ)' }
  }
  if (weekday === 5) {
    return { loc: { bookNameEn: 'Isaiah', chapter: 53, verse: 5 }, occasion: 'Friday Fast', occasionAm: 'ጾመ ድኅነት (ዓርብ)' }
  }

  // 6) Weekday observances
  const weekdayObs = WEEKDAY_OBSERVANCE[weekday]
  if (weekdayObs) return weekdayObs

  // 7) Stable Ethiopian-calendar plan
  return { loc: getPsalmLocationForEthiopianDate(et.month, et.day), occasion: 'Daily Reading', occasionAm: 'ዕለታዊ ንባብ' }
}

const getDailyVerse = async (): Promise<DailyVerse> => {
  const selection = resolveDailyVerseSelection()

  try {
    const verse = await getVerseAtLocation(selection.loc)
    return { ...verse, occasion: selection.occasionAm || selection.occasion }
  } catch {
    const nowInEthiopia = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' }),
    )
    const kenatToday = new Kenat(nowInEthiopia)
    const et = kenatToday.ethiopian
    const verse = await getVerseAtLocation(getPsalmLocationForEthiopianDate(et.month, et.day))
    return { ...verse, occasion: 'ዕለታዊ ንባብ' }
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
            const nowInEthiopia = new Date(
              new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' }),
            )
            const todayKey = new Kenat(nowInEthiopia).formatShort()
            const existing = get().verse
            const existingKey = get().verseDayKey

            if (existing && existingKey === todayKey) {
              set({ isLoading: false })
              return
            }

            // 1. Try to fetch from authoritative VOTD API first
            try {
              const res = await fetch('/api/v1/votd')
              if (res.ok) {
                const json = await res.json()
                if (json?.data?.verse) {
                  const apiVerse: DailyVerse = {
                    text: json.data.verse.text,
                    reference: json.data.verse.reference,
                    bookId: json.data.verse.bookId,
                    chapter: json.data.verse.chapter,
                    verse: json.data.verse.verse,
                    occasion: json.data.liturgical?.occasionAm || json.data.liturgical?.occasion,
                  }
                  set({ verse: apiVerse, verseDayKey: todayKey, isLoading: false })
                  return
                }
              }
            } catch (fetchErr) {
              console.warn('VOTD API fetch fallback to local resolver', fetchErr)
            }

            // 2. Offline fallback with aligned liturgical calendar
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
        version: 6,
        migrate: (persisted: any, version) => {
          if (version < 6) {
            return {
              ...persisted,
              verse: null,
              verseDayKey: null,
              error: null,
            }
          }
          return persisted
        },
      }
    )
  )
)

