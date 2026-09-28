import path from 'path'
import { promises as fs } from 'fs'
import Kenat from 'kenat'
import { books } from '@/data/data'
import { VerseLocation, VerseSelection, VotdResponse, VotdOptions } from './types'
import {
  ETHIOPIAN_MONTHS_AM,
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
} from './constants'

export type { VerseLocation, VerseSelection, VotdResponse, VotdOptions }
export { ETHIOPIAN_MONTHS_AM }

const pickDeterministic = (
  choices: VerseSelection[],
  etYear: number,
  etMonth: number,
  etDay: number,
): VerseSelection => {
  if (choices.length === 1) return choices[0]
  const idx = Math.abs(etYear + etMonth + etDay) % choices.length
  return choices[idx]
}

const getPsalmLocationForEthiopianDate = (etMonth: number, etDay: number): VerseSelection => {
  const dayOfYear0 = (etMonth - 1) * 30 + (etDay - 1)
  const psalmNumber = (dayOfYear0 % 151) + 1
  return {
    loc: { bookNameEn: 'Psalms', chapter: psalmNumber, verse: 1 },
    occasion: 'Daily Reading',
    occasionAm: 'ዕለታዊ ንባብ',
  }
}

export const resolveDailyVerseSelection = (kenatInstance: any): VerseSelection => {
  const et = kenatInstance.ethiopian
  const weekday = kenatInstance.weekday()

  // 1) Major fixed feasts (Ethiopian date)
  const fixed = FIXED_FEASTS_BY_ETH_MM_DD[`${et.month}-${et.day}`]
  if (fixed) return fixed

  // 2) Moveable feasts (relative to Fasika via Bahire Hasab)
  const bh = kenatInstance.getBahireHasab()
  const easterEt = bh.movableFeasts.fasika.ethiopian
  const easterKenat = new Kenat({ year: easterEt.year, month: easterEt.month, day: easterEt.day })
  const offset = kenatInstance.diffInDays(easterKenat)

  const moveable = HOLY_WEEK_BY_EASTER_OFFSET[offset]
  if (moveable) return moveable

  // 2.5) Fast of Nineveh (3-day fast)
  if (offset >= -76 && offset <= -74) {
    const idx = Math.abs(offset - -76)
    return {
      loc: NINEVEH_FAST_VERSES[idx % NINEVEH_FAST_VERSES.length],
      occasion: 'Fast of Nineveh',
      occasionAm: 'ጾመ ነነዌ',
    }
  }

  // 3) Great Lent (Hudade): 55 days leading up to Fasika
  if (offset >= -55 && offset < -7) {
    const dayIndex = Math.abs(offset - -55)
    return {
      loc: GREAT_LENT_VERSES[dayIndex % GREAT_LENT_VERSES.length],
      occasion: 'Great Lent (Hudade)',
      occasionAm: 'ዐቢይ ጾም (ሁዳዴ)',
    }
  }

  // 4) Pascha season (up to 50 days after Fasika)
  if (offset > 0 && offset <= 50) {
    return {
      loc: PASCHA_SEASON_VERSES[(offset - 1) % PASCHA_SEASON_VERSES.length],
      occasion: 'Pascha Season',
      occasionAm: 'ዘመነ ፋሲካ',
    }
  }

  // 4.5) Fast of the Apostles (after Pentecost)
  if (offset >= 50 && offset <= 89) {
    return {
      loc: APOSTLES_FAST_VERSES[(offset - 50) % APOSTLES_FAST_VERSES.length],
      occasion: 'Fast of the Apostles',
      occasionAm: 'ጾመ ሐዋርያት',
    }
  }

  // 4.6) Fast of the Assumption (Filseta): Nehase 1-16
  if (et.month === 12 && et.day >= 1 && et.day <= 16) {
    const idx = (et.day - 1) % FILSETA_FAST_VERSES.length
    return {
      loc: FILSETA_FAST_VERSES[idx],
      occasion: et.day === 16 ? 'Filseta (Assumption)' : 'Fast of Filseta',
      occasionAm: et.day === 16 ? 'ፍልሰታ ለማርያም' : 'ጾመ ፍልሰታ',
    }
  }

  // 4.7) Fast of the Prophets (Advent): 40 days before Gena (Tahsas 29)
  const genaDate = new Kenat({ year: et.year, month: 4, day: 29 })
  const daysUntilGena = genaDate.diffInDays(kenatInstance)
  if (daysUntilGena >= 1 && daysUntilGena <= 40) {
    const idx = (40 - daysUntilGena) % ADVENT_FAST_VERSES.length
    return {
      loc: ADVENT_FAST_VERSES[idx],
      occasion: 'Fast of the Prophets (Advent)',
      occasionAm: 'ጾመ ነቢያት',
    }
  }

  // 5) Daily/monthly commemorations (Senksar)
  const comms = DAILY_COMM_ETY_DAY[et.day]
  if (comms && comms.length > 0) {
    return pickDeterministic(comms, et.year, et.month, et.day)
  }

  // 5.5) Weekly Wednesday & Friday fasts
  if (weekday === 3) {
    return {
      loc: { bookNameEn: 'Matthew', chapter: 6, verse: 16 },
      occasion: 'Wednesday Fast',
      occasionAm: 'ጾመ ረቡዕ',
    }
  }
  if (weekday === 5) {
    return {
      loc: { bookNameEn: 'Isaiah', chapter: 53, verse: 5 },
      occasion: 'Friday Fast',
      occasionAm: 'ጾመ ዓርብ',
    }
  }

  // 6) Weekday observances
  const weekdayObs = WEEKDAY_OBSERVANCE[weekday]
  if (weekdayObs) return weekdayObs

  // 7) Fallback: Deterministic Psalms
  return getPsalmLocationForEthiopianDate(et.month, et.day)
}

const getVerseText = async (
  loc: VerseLocation,
): Promise<{ text: string; book: (typeof books)[0] }> => {
  const book = books.find((b) => b.book_name_en === loc.bookNameEn)
  if (!book) throw new Error(`Unknown book name: ${loc.bookNameEn}`)

  const filePath = path.join(process.cwd(), 'src', 'data', 'bible-data', `${book.file_name}.json`)
  const content = await fs.readFile(filePath, 'utf8')
  const bookData = JSON.parse(content)

  const chapterData = bookData.chapters?.find((c: any) => c.chapter === loc.chapter)
  if (!chapterData) {
    throw new Error(`Chapter not found: ${book.book_name_en} ${loc.chapter}`)
  }

  const allVerses: { verse: number; text: string }[] =
    chapterData.sections?.flatMap((s: any) => s.verses || []) ?? []

  const verseData = allVerses.find((v) => v.verse === loc.verse)
  if (!verseData) {
    throw new Error(`Verse not found: ${book.book_name_en} ${loc.chapter}:${loc.verse}`)
  }

  return { text: verseData.text, book }
}

/**
 * Resolves Verse of the Day strictly in Amharic with Ethiopian liturgical details.
 */
export async function getVerseOfTheDay(options?: VotdOptions): Promise<VotdResponse> {
  let kenatInstance: any

  if (options?.ethDate) {
    let ethObj: { year: number; month: number; day: number }
    if (typeof options.ethDate === 'string') {
      const parts = options.ethDate.split(/[-/]/).map(Number)
      if (parts.length === 3 && !parts.some(isNaN)) {
        ethObj = { year: parts[0], month: parts[1], day: parts[2] }
      } else {
        throw new Error('Invalid Ethiopian date parameter. Use YYYY-MM-DD (e.g. 2018-03-12).')
      }
    } else {
      ethObj = options.ethDate
    }
    kenatInstance = new Kenat(ethObj)
  } else if (options?.date) {
    const d = typeof options.date === 'string' ? new Date(options.date) : options.date
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date parameter. Use YYYY-MM-DD.')
    }
    kenatInstance = new Kenat(d)
  } else {
    // Current time in Africa/Addis_Ababa
    kenatInstance = Kenat.now()
  }

  const et = kenatInstance.ethiopian
  const gregorian = kenatInstance.getGregorian()
  const gregorianFormatted = `${gregorian.year}-${String(gregorian.month).padStart(2, '0')}-${String(gregorian.day).padStart(2, '0')}`

  let selection: VerseSelection
  try {
    selection = resolveDailyVerseSelection(kenatInstance)
  } catch {
    selection = getPsalmLocationForEthiopianDate(et.month, et.day)
  }

  let textResult: { text: string; book: (typeof books)[0] }
  try {
    textResult = await getVerseText(selection.loc)
  } catch {
    const fallbackSelection = {
      loc: { bookNameEn: 'Psalms', chapter: 23, verse: 1 },
      occasion: 'Daily Reading',
      occasionAm: 'ዕለታዊ ንባብ',
    }
    selection = fallbackSelection
    textResult = await getVerseText(fallbackSelection.loc)
  }

  const { text, book } = textResult
  const bookNameAm = book.book_name_am
  const bookShortAm = book.book_short_name_am || book.book_name_am
  const referenceAm = `${bookShortAm} ${selection.loc.chapter}:${selection.loc.verse}`
  const monthNameAm = ETHIOPIAN_MONTHS_AM[et.month - 1] || 'መስከረም'
  const formattedEthAm = `${monthNameAm} ${et.day} ቀን ${et.year} ዓ.ም.`
  const bookId = book.book_name_en.toLowerCase().replace(/\s+/g, '-')

  return {
    status: 'success',
    data: {
      date: {
        gregorian: gregorianFormatted,
        ethiopian: {
          year: et.year,
          month: et.month,
          day: et.day,
          monthNameAm,
          formattedAm: formattedEthAm,
        },
      },
      liturgical: {
        occasion: selection.occasion,
        occasionAm: selection.occasionAm,
      },
      verse: {
        book: bookNameAm,
        bookShort: bookShortAm,
        bookId,
        chapter: selection.loc.chapter,
        verse: selection.loc.verse,
        reference: referenceAm,
        text,
      },
      url: `https://nehemiah-osc.org/read-online/${bookId}/${selection.loc.chapter}#v${selection.loc.verse}`,
    },
  }
}
