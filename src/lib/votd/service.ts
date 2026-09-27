import path from 'path'
import { promises as fs } from 'fs'
import Kenat from 'kenat'
import { books } from '@/data/data'

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

export const ETHIOPIAN_MONTHS_AM = [
  'መስከረም',
  'ጥቅምት',
  'ኅዳር',
  'ታኅሣሥ',
  'ጥር',
  'የካቲት',
  'መጋቢት',
  'ሚያዝያ',
  'ግንቦት',
  'ሰኔ',
  'ሐምሌ',
  'ነሐሴ',
  'ጳጉሜ',
]

// Fixed yearly feasts (Ethiopian month-day)
const FIXED_FEASTS_BY_ETH_MM_DD: Record<string, VerseSelection> = {
  '1-1': {
    loc: { bookNameEn: 'Luke', chapter: 1, verse: 28 },
    occasion: 'Meskerem 1 (Lideta / Commemoration)',
    occasionAm: 'ልደታ ለማርያም / ቅዱስ ዮሐንስ መጥምቅ',
  },
  '1-17': {
    loc: { bookNameEn: 'Galatians', chapter: 6, verse: 14 },
    occasion: 'Meskel (Finding of the True Cross)',
    occasionAm: 'በዓለ መስቀል (መስከረም 17)',
  },
  '4-29': {
    loc: { bookNameEn: 'Luke', chapter: 2, verse: 11 },
    occasion: 'Gena (Nativity of Christ)',
    occasionAm: 'በዓለ ልደት (ገና)',
  },
  '5-11': {
    loc: { bookNameEn: 'Matthew', chapter: 3, verse: 16 },
    occasion: 'Timkat (Epiphany)',
    occasionAm: 'በዓለ ጥምቀት',
  },
  '6-16': {
    loc: { bookNameEn: 'Lamentations', chapter: 3, verse: 22 },
    occasion: 'Kidane Mehret (Annual)',
    occasionAm: 'ኪዳነ ምሕረት (የካቲት 16)',
  },
  '9-23': {
    loc: { bookNameEn: '2 Timothy', chapter: 4, verse: 7 },
    occasion: 'St. George (Annual)',
    occasionAm: 'ቅዱስ ጊዮርጊስ (ግንቦት 23)',
  },
}

// Holy Week & Moveable feasts relative to Fasika (Easter Sunday)
const HOLY_WEEK_BY_EASTER_OFFSET: Record<number, VerseSelection> = {
  [-7]: {
    loc: { bookNameEn: 'John', chapter: 12, verse: 13 },
    occasion: 'Hosanna (Palm Sunday)',
    occasionAm: 'ሆሣዕና',
  },
  [-6]: {
    loc: { bookNameEn: 'Matthew', chapter: 21, verse: 9 },
    occasion: 'Holy Week (Monday)',
    occasionAm: 'ሰሙነ ሕማማት (ሰኞ)',
  },
  [-5]: {
    loc: { bookNameEn: 'Mark', chapter: 11, verse: 15 },
    occasion: 'Holy Week (Tuesday)',
    occasionAm: 'ሰሙነ ሕማማት (ማክሰኞ)',
  },
  [-4]: {
    loc: { bookNameEn: 'John', chapter: 12, verse: 24 },
    occasion: 'Holy Week (Wednesday)',
    occasionAm: 'ሰሙነ ሕማማት (ረቡዕ)',
  },
  [-3]: {
    loc: { bookNameEn: 'John', chapter: 13, verse: 34 },
    occasion: 'Holy Thursday (Maundy Thursday)',
    occasionAm: 'ጸሎተ ሐሙስ',
  },
  [-2]: {
    loc: { bookNameEn: 'Isaiah', chapter: 53, verse: 5 },
    occasion: 'Siklet (Good Friday)',
    occasionAm: 'ስቅለት (ዓርብ)',
  },
  [-1]: {
    loc: { bookNameEn: 'Matthew', chapter: 27, verse: 60 },
    occasion: 'Holy Saturday',
    occasionAm: 'ቀዳም ስዑር',
  },
  [0]: {
    loc: { bookNameEn: 'Matthew', chapter: 28, verse: 6 },
    occasion: 'Fasika (Easter Resurrection)',
    occasionAm: 'በዓለ ትንሣኤ (ፋሲካ)',
  },
  [39]: {
    loc: { bookNameEn: 'Acts', chapter: 1, verse: 9 },
    occasion: 'Ascension of Christ',
    occasionAm: 'ዕርገት',
  },
  [49]: {
    loc: { bookNameEn: 'Acts', chapter: 2, verse: 4 },
    occasion: 'Pentecost (Descent of Holy Spirit)',
    occasionAm: 'ጰራቅሊጦስ (በዓለ ኀምሳ)',
  },
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

// Daily/monthly commemorations keyed by Ethiopian day-of-month (Senksar)
const DAILY_COMM_ETY_DAY: Record<number, VerseSelection[]> = {
  1: [
    { loc: { bookNameEn: 'Luke', chapter: 1, verse: 48 }, occasion: 'Lideta (Birth of Mary)', occasionAm: 'ልደታ ለማርያም' },
    { loc: { bookNameEn: '1 Kings', chapter: 18, verse: 36 }, occasion: 'Elias (Elijah)', occasionAm: 'ቅዱስ ኤልያስ' },
  ],
  5: [{ loc: { bookNameEn: 'Matthew', chapter: 16, verse: 18 }, occasion: 'Petros and Paulos', occasionAm: 'ቅዱሳን ጴጥሮስ ወጳውሎስ' }],
  7: [{ loc: { bookNameEn: 'Matthew', chapter: 28, verse: 19 }, occasion: 'Holy Trinity', occasionAm: 'ሥላሴ' }],
  12: [
    { loc: { bookNameEn: 'Daniel', chapter: 12, verse: 1 }, occasion: 'Michael the Archangel', occasionAm: 'ቅዱስ ሚካኤል ሊቀ መላእክት' },
    { loc: { bookNameEn: '1 Samuel', chapter: 3, verse: 10 }, occasion: 'Samuel', occasionAm: 'ነቢዩ ሳሙኤል' },
    { loc: { bookNameEn: 'Psalms', chapter: 150, verse: 6 }, occasion: 'Yared (Praise)', occasionAm: 'ቅዱስ ያሬድ' },
  ],
  16: [{ loc: { bookNameEn: 'Lamentations', chapter: 3, verse: 22 }, occasion: 'Kidane Mehret', occasionAm: 'ኪዳነ ምሕረት' }],
  19: [{ loc: { bookNameEn: 'Luke', chapter: 1, verse: 19 }, occasion: 'Gabriel the Archangel', occasionAm: 'ቅዱስ ገብርኤል ሊቀ መላእክት' }],
  21: [{ loc: { bookNameEn: 'Luke', chapter: 1, verse: 28 }, occasion: 'Holy Virgin Mary (Monthly)', occasionAm: 'ቅድስት ድንግል ማርያም' }],
  23: [{ loc: { bookNameEn: '2 Timothy', chapter: 4, verse: 7 }, occasion: 'Georgis (St. George)', occasionAm: 'ቅዱስ ጊዮርጊስ' }],
  26: [{ loc: { bookNameEn: 'John', chapter: 20, verse: 28 }, occasion: 'Thomas the Apostle', occasionAm: 'ቅዱስ ቶማስ' }],
  27: [{ loc: { bookNameEn: 'John', chapter: 3, verse: 17 }, occasion: 'Medhane Alem', occasionAm: 'መድኃኔ ዓለም' }],
  29: [{ loc: { bookNameEn: 'Luke', chapter: 2, verse: 11 }, occasion: 'Lideta Christ (Monthly)', occasionAm: 'በዓለ ወልድ' }],
  30: [{ loc: { bookNameEn: 'Mark', chapter: 16, verse: 15 }, occasion: 'Markos (St. Mark)', occasionAm: 'ቅዱስ ማርቆስ ዘአንበሳ' }],
}

const WEEKDAY_OBSERVANCE: Record<number, VerseSelection> = {
  0: { loc: { bookNameEn: 'Psalms', chapter: 122, verse: 1 }, occasion: 'Sunday (Senbete)', occasionAm: 'ሰንበተ ክርስቲያን (እሑድ)' },
  1: { loc: { bookNameEn: 'Psalms', chapter: 5, verse: 3 }, occasion: 'Monday (Sagno)', occasionAm: 'ሰኞ' },
  2: { loc: { bookNameEn: 'Revelation', chapter: 2, verse: 10 }, occasion: 'Tuesday (Maksagno)', occasionAm: 'ማክሰኞ' },
  3: { loc: { bookNameEn: 'Matthew', chapter: 4, verse: 17 }, occasion: 'Wednesday (Fasting/Repentance)', occasionAm: 'ጾመ ረቡዕ' },
  4: { loc: { bookNameEn: 'Hebrews', chapter: 13, verse: 16 }, occasion: 'Thursday (Hamus)', occasionAm: 'ሐሙስ' },
  5: { loc: { bookNameEn: 'Isaiah', chapter: 53, verse: 5 }, occasion: 'Friday (Crucifixion Fast)', occasionAm: 'ጾመ ዓርብ' },
  6: { loc: { bookNameEn: 'Hebrews', chapter: 4, verse: 9 }, occasion: 'Saturday (Qadamit Sanbat)', occasionAm: 'ቀዳሚት ሰንበት (ቅዳሜ)' },
}

const pickDeterministic = (choices: VerseSelection[], etYear: number, etMonth: number, etDay: number): VerseSelection => {
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

  // 2) Moveable feasts (relative to Fasika)
  const bh = kenatInstance.getBahireHasab()
  const easterEt = bh.movableFeasts.fasika.ethiopian
  const easterKenat = new Kenat({ year: easterEt.year, month: easterEt.month, day: easterEt.day })
  const offset = kenatInstance.diffInDays(easterKenat)

  const moveable = HOLY_WEEK_BY_EASTER_OFFSET[offset]
  if (moveable) return moveable

  // 2.5) Fast of Nineveh (3-day fast about 3 weeks before Great Lent starts)
  if (offset >= -76 && offset <= -74) {
    const idx = Math.abs(offset - -76)
    return {
      loc: NINEVEH_FAST_VERSES[idx % NINEVEH_FAST_VERSES.length],
      occasion: 'Fast of Nineveh',
      occasionAm: 'ጾመ ነነዌ',
    }
  }

  // 3) Great Lent (Hudade): 55 days leading up to Fasika, excluding Holy Week
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

const getVerseText = async (loc: VerseLocation): Promise<{ text: string; book: (typeof books)[0] }> => {
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
export async function getVerseOfTheDay(options?: { date?: string | Date }): Promise<VotdResponse> {
  let kenatInstance: any

  if (options?.date) {
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
    // Safe fallback to Psalm 23:1 if target verse extraction fails
    const fallbackSelection = {
      loc: { bookNameEn: 'Psalms', chapter: 23, verse: 1 },
      occasion: 'Daily Reading',
      occasionAm: 'ዕለታዊ ንባብ',
    }
    selection = fallbackSelection
    textResult = await getVerseText(fallbackSelection.loc)
  }

  const { text, book } = textResult
  const bookId = book.book_name_en.toLowerCase().replace(/ /g, '-')
  const bookNameAm = book.book_name_am
  const bookShortAm = book.book_short_name_am || book.book_name_am
  const referenceAm = `${bookShortAm} ${selection.loc.chapter}:${selection.loc.verse}`
  const monthNameAm = ETHIOPIAN_MONTHS_AM[et.month - 1] || `ወር ${et.month}`
  const formattedEthAm = `${monthNameAm} ${et.day} ቀን ${et.year} ዓ.ም.`

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
