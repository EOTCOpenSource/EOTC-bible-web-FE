import { VerseLocation, VerseSelection } from './types'

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

// Fixed yearly feasts & annual ceremonies across all 13 Ethiopian months
export const FIXED_FEASTS_BY_ETH_MM_DD: Record<string, VerseSelection> = {
  // መስከረም (Meskerem)
  '1-1': {
    loc: { bookNameEn: 'Luke', chapter: 1, verse: 76 },
    occasion: 'Enkutatash / St. John the Baptist',
    occasionAm: 'እንቁጣጣሽ / ቅዱስ ዮሐንስ መጥምቅ (መስከረም 1)',
  },
  '1-17': {
    loc: { bookNameEn: 'Galatians', chapter: 6, verse: 14 },
    occasion: 'Meskel (Finding of the True Cross)',
    occasionAm: 'በዓለ መስቀል (መስከረም 17)',
  },
  '1-21': {
    loc: { bookNameEn: 'John', chapter: 19, verse: 26 },
    occasion: 'Gishen Debre Kerbe (Cross & St. Mary)',
    occasionAm: 'ግሸን ደብረ ከርቤ (መስከረም 21)',
  },

  // ጥቅምት (Tikimt)
  '2-5': {
    loc: { bookNameEn: 'Galatians', chapter: 6, verse: 17 },
    occasion: 'Abune Gebre Menfes Kidus',
    occasionAm: 'አቡነ ገብረ መንፈስ ቅዱስ (ጥቅምት 5)',
  },
  '2-14': {
    loc: { bookNameEn: 'Matthew', chapter: 16, verse: 24 },
    occasion: 'Abune Aregawi (Debre Damo)',
    occasionAm: 'አቡነ አረጋዊ ዘደብረ ዳሞ (ጥቅምት 14)',
  },
  '2-17': {
    loc: { bookNameEn: 'Acts', chapter: 7, verse: 59 },
    occasion: 'St. Stephen the Protomartyr (Tikimt)',
    occasionAm: 'ቅዱስ እስጢፋኖስ ሊቀ ዲያቆናት (ጥቅምት 17)',
  },
  '2-24': {
    loc: { bookNameEn: 'Luke', chapter: 1, verse: 15 },
    occasion: 'Abune Tekle Haymanot (Birth)',
    occasionAm: 'አቡነ ተክለ ሃይማኖት ልደታቸው (ጥቅምት 24)',
  },
  '2-27': {
    loc: { bookNameEn: 'John', chapter: 3, verse: 16 },
    occasion: 'Tikimt Medhane Alem',
    occasionAm: 'ጥቅምት መድኃኔዓለም (ጥቅምት 27)',
  },

  // ኅዳር (Hidar)
  '3-6': {
    loc: { bookNameEn: 'Matthew', chapter: 2, verse: 13 },
    occasion: 'Debre Kusqwam (Flight to Egypt)',
    occasionAm: 'ደብረ ቍስቋም (ኅዳር 6)',
  },
  '3-8': {
    loc: { bookNameEn: 'Revelation', chapter: 4, verse: 8 },
    occasion: 'The Four Heavenly Creatures',
    occasionAm: 'አርባዕቱ እንስሳ (ኅዳር 8)',
  },
  '3-12': {
    loc: { bookNameEn: 'Daniel', chapter: 12, verse: 1 },
    occasion: 'Hidar Michael (Archangel Michael)',
    occasionAm: 'ኅዳር ሚካኤል (ኅዳር 12)',
  },
  '3-21': {
    loc: { bookNameEn: 'Luke', chapter: 1, verse: 48 },
    occasion: 'Hidar Tsion (St. Mary of Zion)',
    occasionAm: 'ኅዳር ጽዮን ማርያም (ኅዳር 21)',
  },
  '3-24': {
    loc: { bookNameEn: 'Revelation', chapter: 4, verse: 4 },
    occasion: 'The 24 Heavenly Priests',
    occasionAm: 'ሃያ አራቱ ካህናተ ሰማይ (ኅዳር 24)',
  },

  // ታኅሣሥ (Tahsas)
  '4-3': {
    loc: { bookNameEn: 'Luke', chapter: 1, verse: 28 },
    occasion: 'Baeta LeMaryam (Presentation of Mary)',
    occasionAm: 'በዓተ ለማርያም (ታኅሣሥ 3)',
  },
  '4-19': {
    loc: { bookNameEn: 'Daniel', chapter: 3, verse: 28 },
    occasion: 'Tahsas Gabriel (Deliverance of Three Youths)',
    occasionAm: 'ታኅሣሥ ገብርኤል (ታኅሣሥ 19)',
  },
  '4-24': {
    loc: { bookNameEn: 'Hebrews', chapter: 13, verse: 7 },
    occasion: 'Abune Tekle Haymanot (Tahsas)',
    occasionAm: 'አቡነ ተክለ ሃይማኖት ስባረ ዐፅማቸው (ታኅሣሥ 24)',
  },
  '4-28': {
    loc: { bookNameEn: 'Luke', chapter: 2, verse: 11 },
    occasion: 'Gena (Nativity of Christ - Leap Year)',
    occasionAm: 'በዓለ ልደት (ገና)',
  },
  '4-29': {
    loc: { bookNameEn: 'Luke', chapter: 2, verse: 11 },
    occasion: 'Gena (Nativity of Christ)',
    occasionAm: 'በዓለ ልደት (ገና)',
  },

  // ጥር (Tir)
  '5-1': {
    loc: { bookNameEn: 'Acts', chapter: 7, verse: 59 },
    occasion: 'St. Stephen (Tir)',
    occasionAm: 'ቅዱስ እስጢፋኖስ (ጥር 1)',
  },
  '5-6': {
    loc: { bookNameEn: 'Luke', chapter: 2, verse: 21 },
    occasion: 'Gizret (Circumcision of our Lord)',
    occasionAm: 'ግዝረተ ክርስቶስ (ጥር 6)',
  },
  '5-7': {
    loc: { bookNameEn: 'Matthew', chapter: 28, verse: 19 },
    occasion: 'Holy Trinity (Tir)',
    occasionAm: 'በዓለ ሥላሴ (ጥር 7)',
  },
  '5-11': {
    loc: { bookNameEn: 'Matthew', chapter: 3, verse: 16 },
    occasion: 'Timkat (Epiphany of our Lord)',
    occasionAm: 'በዓለ ጥምቀት (ጥር 11)',
  },
  '5-12': {
    loc: { bookNameEn: 'John', chapter: 2, verse: 11 },
    occasion: 'Kana ZeGelila (Wedding of Cana)',
    occasionAm: 'ቃና ዘገሊላ (ጥር 12)',
  },
  '5-15': {
    loc: { bookNameEn: 'Matthew', chapter: 18, verse: 3 },
    occasion: 'St. Kirkos and Eyesuta (Tir)',
    occasionAm: 'ቅዱስ ቂርቆስና ኢየሉጣ (ጥር 15)',
  },
  '5-18': {
    loc: { bookNameEn: '2 Timothy', chapter: 4, verse: 7 },
    occasion: 'St. George (Entering of Body to Lod)',
    occasionAm: 'ቅዱስ ጊዮርጊስ (ጥር 18)',
  },
  '5-21': {
    loc: { bookNameEn: 'Luke', chapter: 1, verse: 42 },
    occasion: 'Astereo Maryam (Dormition of St. Mary)',
    occasionAm: 'አስተርእዮ ማርያም (ጥር 21)',
  },
  '5-22': {
    loc: { bookNameEn: 'Hebrews', chapter: 1, verse: 14 },
    occasion: 'St. Uriel the Archangel',
    occasionAm: 'ቅዱስ ዑራኤል ሊቀ መላእክት (ጥር 22)',
  },
  '5-24': {
    loc: { bookNameEn: 'Galatians', chapter: 6, verse: 17 },
    occasion: 'Abune Tekle Haymanot (Tir)',
    occasionAm: 'አቡነ ተክለ ሃይማኖት ፍልሰተ ዐፅማቸው (ጥር 24)',
  },

  // የካቲት (Yekatit)
  '6-8': {
    loc: { bookNameEn: 'Luke', chapter: 2, verse: 29 },
    occasion: 'St. Simeon the Elder',
    occasionAm: 'ቅዱስ ስምዖን አረጋዊ (የካቲት 8)',
  },
  '6-16': {
    loc: { bookNameEn: 'Lamentations', chapter: 3, verse: 22 },
    occasion: 'Kidane Mehret (Covenant of Mercy)',
    occasionAm: 'ኪዳነ ምሕረት (የካቲት 16)',
  },

  // መጋቢት (Megabit)
  '7-5': {
    loc: { bookNameEn: 'Matthew', chapter: 11, verse: 28 },
    occasion: 'Abune Gebre Menfes Kidus (Annual)',
    occasionAm: 'አቡነ ገብረ መንፈስ ቅዱስ (መጋቢት 5)',
  },
  '7-10': {
    loc: { bookNameEn: '1 Corinthians', chapter: 1, verse: 18 },
    occasion: 'Discovery of the Holy Cross',
    occasionAm: 'ዕፀ መስቀል የተገኘበት (መጋቢት 10)',
  },
  '7-27': {
    loc: { bookNameEn: 'Romans', chapter: 5, verse: 8 },
    occasion: 'Megabit Medhane Alem (Crucifixion)',
    occasionAm: 'መጋቢት መድኃኔዓለም (መጋቢት 27)',
  },
  '7-29': {
    loc: { bookNameEn: 'Luke', chapter: 1, verse: 31 },
    occasion: 'Bale Tsinset (Annunciation of Christ)',
    occasionAm: 'በዓለ ጽንሰት (መጋቢት 29)',
  },

  // ሚያዝያ (Miazia)
  '8-23': {
    loc: { bookNameEn: 'Matthew', chapter: 10, verse: 28 },
    occasion: 'Martyrdom of St. George',
    occasionAm: 'ሰማዕትነት ቅዱስ ጊዮርጊስ (ሚያዝያ 23)',
  },

  // ግንቦት (Ginbot)
  '9-1': {
    loc: { bookNameEn: 'Luke', chapter: 1, verse: 48 },
    occasion: 'Nativity of the Virgin Mary',
    occasionAm: 'ልደታ ለማርያም (ግንቦት 1)',
  },
  '9-11': {
    loc: { bookNameEn: 'Psalms', chapter: 150, verse: 6 },
    occasion: 'St. Yared the Hymnographer',
    occasionAm: 'ቅዱስ ያሬድ (ግንቦት 11)',
  },
  '9-12': {
    loc: { bookNameEn: 'Psalms', chapter: 34, verse: 7 },
    occasion: 'Ginbot Michael (Apparition to Afomia)',
    occasionAm: 'ግንቦት ሚካኤል (ግንቦት 12)',
  },
  '9-20': {
    loc: { bookNameEn: 'Psalms', chapter: 87, verse: 2 },
    occasion: 'Debre Mitmaq (Building of Church)',
    occasionAm: 'ሕንጸተ ቤተክርስቲያን ደብረ ምጥማቅ (ግንቦት 20)',
  },
  '9-21': {
    loc: { bookNameEn: 'Luke', chapter: 1, verse: 46 },
    occasion: 'Debre Mitmaq St. Mary',
    occasionAm: 'ደብረ ምጥማቅ እመቤታችን (ግንቦት 21)',
  },
  '9-23': {
    loc: { bookNameEn: '2 Timothy', chapter: 4, verse: 7 },
    occasion: 'Ginbot Georgis (St. George Annual)',
    occasionAm: 'ግንቦት ጊዮርጊስ (ግንቦት 23)',
  },

  // ሰኔ (Sene)
  '10-12': {
    loc: { bookNameEn: 'Daniel', chapter: 12, verse: 1 },
    occasion: 'Sene Michael (Deliverance of Bahran)',
    occasionAm: 'ሰኔ ሚካኤል (ሰኔ 12)',
  },
  '10-20': {
    loc: { bookNameEn: '1 Corinthians', chapter: 3, verse: 16 },
    occasion: 'Sene Golgotha (Building of First Church)',
    occasionAm: 'ሰኔ ጎልጎታ / ሕንጸተ ቤተክርስቲያን (ሰኔ 20)',
  },
  '10-21': {
    loc: { bookNameEn: 'Psalms', chapter: 131, verse: 13 },
    occasion: 'Building of Mary Church',
    occasionAm: 'ሕንጸተ ቤተክርስቲያን እመቤታችን (ሰኔ 21)',
  },
  '10-30': {
    loc: { bookNameEn: 'Mark', chapter: 16, verse: 15 },
    occasion: 'St. Mark the Evangelist',
    occasionAm: 'ቅዱስ ማርቆስ ዘአንበሳ (ሰኔ 30)',
  },

  // ሐምሌ (Hamle)
  '11-5': {
    loc: { bookNameEn: 'Matthew', chapter: 16, verse: 18 },
    occasion: 'St. Peter and St. Paul',
    occasionAm: 'ቅዱሳን ጴጥሮስ ወጳውሎስ (ሐምሌ 5)',
  },
  '11-7': {
    loc: { bookNameEn: 'Genesis', chapter: 18, verse: 1 },
    occasion: 'Holy Trinity (Hamle)',
    occasionAm: 'በዓለ ሥላሴ (ሐምሌ 7)',
  },
  '11-19': {
    loc: { bookNameEn: 'Daniel', chapter: 3, verse: 28 },
    occasion: 'Hamle Gabriel (St. Kirkos and Eyesus)',
    occasionAm: 'ሐምሌ ገብርኤል / ቅዱስ ቂርቆስ (ሐምሌ 19)',
  },
  '11-22': {
    loc: { bookNameEn: 'Hebrews', chapter: 1, verse: 14 },
    occasion: 'St. Uriel the Archangel (Hamle)',
    occasionAm: 'ቅዱስ ዑራኤል ሊቀ መላእክት (ሐምሌ 22)',
  },

  // ነሐሴ (Nehase)
  '12-1': {
    loc: { bookNameEn: 'Luke', chapter: 1, verse: 48 },
    occasion: 'Beginning of Filseta Fast',
    occasionAm: 'ጾመ ፍልሰታ ጅምር (ነሐሴ 1)',
  },
  '12-7': {
    loc: { bookNameEn: 'Matthew', chapter: 17, verse: 2 },
    occasion: 'Debre Tabor (Buhe - Transfiguration)',
    occasionAm: 'ደብረ ታቦር / ቡሄ (ነሐሴ 13 ወይም 7)',
  },
  '12-13': {
    loc: { bookNameEn: 'Hebrews', chapter: 1, verse: 14 },
    occasion: 'St. Raphael the Archangel',
    occasionAm: 'ቅዱስ ሩፋኤል ሊቀ መላእክት (ነሐሴ 13)',
  },
  '12-16': {
    loc: { bookNameEn: 'Revelation', chapter: 12, verse: 1 },
    occasion: 'Filseta (Assumption of St. Mary)',
    occasionAm: 'ፍልሰታ ለማርያም (ነሐሴ 16)',
  },
  '12-21': {
    loc: { bookNameEn: 'Luke', chapter: 1, verse: 42 },
    occasion: 'Nehase Maryam',
    occasionAm: 'ነሐሴ ማርያም (ነሐሴ 21)',
  },
  '12-24': {
    loc: { bookNameEn: 'Hebrews', chapter: 13, verse: 7 },
    occasion: 'Abune Tekle Haymanot (Resting)',
    occasionAm: 'አቡነ ተክለ ሃይማኖት ዕረፍታቸው (ነሐሴ 24)',
  },

  // ጳጉሜ (Pagume)
  '13-3': {
    loc: { bookNameEn: 'Psalms', chapter: 103, verse: 20 },
    occasion: 'Pagume Raphael the Archangel',
    occasionAm: 'ቅዱስ ሩፋኤል (ጳጉሜ 3)',
  },
}

// Holy Week & Moveable feasts relative to Fasika (Easter Sunday)
export const HOLY_WEEK_BY_EASTER_OFFSET: Record<number, VerseSelection> = {
  // Great Lent 8 Sundays (8ቱ የዐቢይ ጾም እሑዶች)
  [-55]: {
    loc: { bookNameEn: 'John', chapter: 3, verse: 13 },
    occasion: 'Great Lent Week 1 (Zewerede)',
    occasionAm: 'ዘወረደ (ዐቢይ ጾም ሳምንት 1)',
  },
  [-48]: {
    loc: { bookNameEn: '1 Thessalonians', chapter: 4, verse: 3 },
    occasion: 'Great Lent Week 2 (Kiddist)',
    occasionAm: 'ቅድስት (ዐቢይ ጾም ሳምንት 2)',
  },
  [-41]: {
    loc: { bookNameEn: 'John', chapter: 2, verse: 16 },
    occasion: 'Great Lent Week 3 (Mekurab)',
    occasionAm: 'ምኵራብ (ዐቢይ ጾም ሳምንት 3)',
  },
  [-34]: {
    loc: { bookNameEn: 'John', chapter: 5, verse: 8 },
    occasion: 'Great Lent Week 4 (Metsagwe)',
    occasionAm: 'መጻጕዕ (ዐቢይ ጾም ሳምንት 4)',
  },
  [-27]: {
    loc: { bookNameEn: 'Matthew', chapter: 24, verse: 30 },
    occasion: 'Great Lent Week 5 (Debre Zeyt - Mount of Olives)',
    occasionAm: 'ደብረ ዘይት (ዐቢይ ጾም ሳምንት 5)',
  },
  [-20]: {
    loc: { bookNameEn: 'Matthew', chapter: 25, verse: 21 },
    occasion: 'Great Lent Week 6 (Gebre Her)',
    occasionAm: 'ገብር ኄር (ዐቢይ ጾም ሳምንት 6)',
  },
  [-13]: {
    loc: { bookNameEn: 'John', chapter: 3, verse: 3 },
    occasion: 'Great Lent Week 7 (Nikodimos)',
    occasionAm: 'ኒቆዲሞስ (ዐቢይ ጾም ሳምንት 7)',
  },
  [-7]: {
    loc: { bookNameEn: 'John', chapter: 12, verse: 13 },
    occasion: 'Hosanna (Palm Sunday)',
    occasionAm: 'ሆሣዕና (ዐቢይ ጾም ሳምንት 8)',
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
  [7]: {
    loc: { bookNameEn: 'John', chapter: 20, verse: 28 },
    occasion: 'Thomas Sunday (New Sunday)',
    occasionAm: 'ዳግም ትንሣኤ (ቅዱስ ቶማስ)',
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

export const GREAT_LENT_VERSES: VerseLocation[] = [
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

export const PASCHA_SEASON_VERSES: VerseLocation[] = [
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

export const ADVENT_FAST_VERSES: VerseLocation[] = [
  { bookNameEn: 'Isaiah', chapter: 9, verse: 6 },
  { bookNameEn: 'Isaiah', chapter: 40, verse: 3 },
  { bookNameEn: 'Luke', chapter: 1, verse: 37 },
  { bookNameEn: 'Luke', chapter: 1, verse: 46 },
  { bookNameEn: 'Matthew', chapter: 1, verse: 23 },
  { bookNameEn: 'John', chapter: 1, verse: 14 },
]

export const FILSETA_FAST_VERSES: VerseLocation[] = [
  { bookNameEn: 'Luke', chapter: 1, verse: 48 },
  { bookNameEn: 'Luke', chapter: 1, verse: 28 },
  { bookNameEn: 'John', chapter: 19, verse: 27 },
  { bookNameEn: 'Revelation', chapter: 12, verse: 1 },
]

export const NINEVEH_FAST_VERSES: VerseLocation[] = [
  { bookNameEn: 'Jonah', chapter: 3, verse: 10 },
  { bookNameEn: 'Jonah', chapter: 3, verse: 5 },
  { bookNameEn: 'Psalms', chapter: 51, verse: 17 },
]

export const APOSTLES_FAST_VERSES: VerseLocation[] = [
  { bookNameEn: 'Acts', chapter: 1, verse: 8 },
  { bookNameEn: 'Matthew', chapter: 28, verse: 19 },
  { bookNameEn: 'Romans', chapter: 10, verse: 15 },
  { bookNameEn: '2 Timothy', chapter: 4, verse: 2 },
]

// Daily/monthly commemorations keyed by Ethiopian day-of-month (Senksar)
export const DAILY_COMM_ETY_DAY: Record<number, VerseSelection[]> = {
  1: [
    {
      loc: { bookNameEn: 'Luke', chapter: 1, verse: 48 },
      occasion: 'Lideta (Birth of Mary)',
      occasionAm: 'ልደታ ለማርያም',
    },
    {
      loc: { bookNameEn: '1 Kings', chapter: 18, verse: 36 },
      occasion: 'Elias (Elijah)',
      occasionAm: 'ቅዱስ ኤልያስ',
    },
  ],
  5: [
    {
      loc: { bookNameEn: 'Matthew', chapter: 16, verse: 18 },
      occasion: 'Petros and Paulos',
      occasionAm: 'ቅዱሳን ጴጥሮስ ወጳውሎስ',
    },
  ],
  7: [
    {
      loc: { bookNameEn: 'Matthew', chapter: 28, verse: 19 },
      occasion: 'Holy Trinity',
      occasionAm: 'ሥላሴ',
    },
  ],
  12: [
    {
      loc: { bookNameEn: 'Daniel', chapter: 12, verse: 1 },
      occasion: 'Michael the Archangel',
      occasionAm: 'ቅዱስ ሚካኤል ሊቀ መላእክት',
    },
    {
      loc: { bookNameEn: '1 Samuel', chapter: 3, verse: 10 },
      occasion: 'Samuel',
      occasionAm: 'ነቢዩ ሳሙኤል',
    },
    {
      loc: { bookNameEn: 'Psalms', chapter: 150, verse: 6 },
      occasion: 'Yared (Praise)',
      occasionAm: 'ቅዱስ ያሬድ',
    },
  ],
  16: [
    {
      loc: { bookNameEn: 'Lamentations', chapter: 3, verse: 22 },
      occasion: 'Kidane Mehret',
      occasionAm: 'ኪዳነ ምሕረት',
    },
  ],
  19: [
    {
      loc: { bookNameEn: 'Luke', chapter: 1, verse: 19 },
      occasion: 'Gabriel the Archangel',
      occasionAm: 'ቅዱስ ገብርኤል ሊቀ መላእክት',
    },
  ],
  21: [
    {
      loc: { bookNameEn: 'Luke', chapter: 1, verse: 28 },
      occasion: 'Holy Virgin Mary (Monthly)',
      occasionAm: 'ቅድስት ድንግል ማርያም',
    },
  ],
  23: [
    {
      loc: { bookNameEn: '2 Timothy', chapter: 4, verse: 7 },
      occasion: 'Georgis (St. George)',
      occasionAm: 'ቅዱስ ጊዮርጊስ',
    },
  ],
  26: [
    {
      loc: { bookNameEn: 'John', chapter: 20, verse: 28 },
      occasion: 'Thomas the Apostle',
      occasionAm: 'ቅዱስ ቶማስ',
    },
  ],
  27: [
    {
      loc: { bookNameEn: 'John', chapter: 3, verse: 17 },
      occasion: 'Medhane Alem',
      occasionAm: 'መድኃኔ ዓለም',
    },
  ],
  29: [
    {
      loc: { bookNameEn: 'Luke', chapter: 2, verse: 11 },
      occasion: 'Lideta Christ (Monthly)',
      occasionAm: 'በዓለ ወልድ',
    },
  ],
  30: [
    {
      loc: { bookNameEn: 'Mark', chapter: 16, verse: 15 },
      occasion: 'Markos (St. Mark)',
      occasionAm: 'ቅዱስ ማርቆስ ዘአንበሳ',
    },
  ],
}

export const WEEKDAY_OBSERVANCE: Record<number, VerseSelection> = {
  0: {
    loc: { bookNameEn: 'Psalms', chapter: 122, verse: 1 },
    occasion: 'Sunday (Senbete)',
    occasionAm: 'ሰንበተ ክርስቲያን (እሑድ)',
  },
  1: {
    loc: { bookNameEn: 'Psalms', chapter: 5, verse: 3 },
    occasion: 'Monday (Sagno)',
    occasionAm: 'ሰኞ',
  },
  2: {
    loc: { bookNameEn: 'Revelation', chapter: 2, verse: 10 },
    occasion: 'Tuesday (Maksagno)',
    occasionAm: 'ማክሰኞ',
  },
  3: {
    loc: { bookNameEn: 'Matthew', chapter: 4, verse: 17 },
    occasion: 'Wednesday (Fasting/Repentance)',
    occasionAm: 'ጾመ ረቡዕ',
  },
  4: {
    loc: { bookNameEn: 'Hebrews', chapter: 13, verse: 16 },
    occasion: 'Thursday (Hamus)',
    occasionAm: 'ሐሙስ',
  },
  5: {
    loc: { bookNameEn: 'Isaiah', chapter: 53, verse: 5 },
    occasion: 'Friday (Crucifixion Fast)',
    occasionAm: 'ጾመ ዓርብ',
  },
  6: {
    loc: { bookNameEn: 'Hebrews', chapter: 4, verse: 9 },
    occasion: 'Saturday (Qadamit Sanbat)',
    occasionAm: 'ቀዳሚት ሰንበት (ቅዳሜ)',
  },
}
