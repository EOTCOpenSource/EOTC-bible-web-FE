export type EthiopianDate = {
  year: number
  month: number // 1-13
  day: number // 1-30 (month 13 has 5-6 days)
}

// Ethiopian epoch expressed as a Julian Day Number (JDN).
// Commonly used in Ethiopian/Coptic calendar conversions.
const ETHIOPIAN_EPOCH_JDN = 1723856

const mod = (n: number, m: number) => ((n % m) + m) % m

const gregorianToJdn = (year: number, month: number, day: number) => {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  )
}

// Converts a Gregorian date (local time) to Ethiopian calendar date.
export const toEthiopianDate = (date: Date): EthiopianDate => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const jdn = gregorianToJdn(year, month, day)
  const daysSinceEpoch = jdn - ETHIOPIAN_EPOCH_JDN
  const cycleRemainder = mod(daysSinceEpoch, 1461) // 4-year cycle length

  // Year calculation validated against known new year dates (e.g., 2022-09-11 => 2015-01-01 ETH).
  let etYear = 4 * Math.floor(daysSinceEpoch / 1461) + Math.floor(cycleRemainder / 365)
  let dayOfYear = cycleRemainder % 365

  // Handle leap day at the end of the 4-year cycle.
  if (cycleRemainder === 1460) {
    etYear -= 1
    dayOfYear = 365
  }

  const etMonth = Math.floor(dayOfYear / 30) + 1
  const etDay = (dayOfYear % 30) + 1

  return { year: etYear, month: etMonth, day: etDay }
}

