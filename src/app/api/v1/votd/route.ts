import { NextRequest, NextResponse } from 'next/server'
import { getVerseOfTheDay } from '@/lib/votd/service'

export const dynamic = 'force-dynamic'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, If-None-Match',
  'Access-Control-Expose-Headers': 'ETag, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After',
}

// In-memory sliding window rate limiter
interface RateLimitRecord {
  count: number
  resetAt: number
}
const rateLimitMap = new Map<string, RateLimitRecord>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 120 // Up to 120 requests per minute per IP

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  // Clean up if map exceeds 5000 records
  if (rateLimitMap.size > 5000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.resetAt <= now) {
        rateLimitMap.delete(key)
      }
    }
  }

  if (!record || record.resetAt <= now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetInSec: 60 }
  }

  record.count += 1
  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - record.count)
  const resetInSec = Math.ceil((record.resetAt - now) / 1000)

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetInSec }
  }

  return { allowed: true, remaining, resetInSec }
}

function getCacheHeaders(isSpecificDateQuery: boolean) {
  if (isSpecificDateQuery) {
    return {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
    }
  }

  // Calculate seconds remaining until next midnight in Ethiopia (Africa/Addis_Ababa, UTC+3)
  const nowEth = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' }))
  const nextMidnightEth = new Date(nowEth)
  nextMidnightEth.setHours(24, 0, 0, 0)
  const secondsUntilMidnight = Math.max(
    60,
    Math.floor((nextMidnightEth.getTime() - nowEth.getTime()) / 1000),
  )

  return {
    'Cache-Control': `public, max-age=${secondsUntilMidnight}, s-maxage=${secondsUntilMidnight}, stale-while-revalidate=300`,
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

export async function GET(req: NextRequest) {
  try {
    // 1. IP extraction & Rate limiting
    const clientIp =
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    const rateLimit = checkRateLimit(clientIp)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Too many requests. Please slow down.',
        },
        {
          status: 429,
          headers: {
            ...CORS_HEADERS,
            'Retry-After': String(rateLimit.resetInSec),
            'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetInSec),
          },
        },
      )
    }

    const searchParams = req.nextUrl.searchParams
    const isEthCalendar =
      searchParams.get('calendar')?.toLowerCase() === 'ethiopian' ||
      searchParams.get('cal')?.toLowerCase() === 'eth' ||
      searchParams.has('eth') ||
      searchParams.has('eth_date') ||
      searchParams.has('ethDate')

    const dateParam = searchParams.get('date') || undefined
    const ethDateParam =
      searchParams.get('eth_date') ||
      searchParams.get('ethDate') ||
      searchParams.get('eth') ||
      (isEthCalendar ? dateParam : undefined)

    const isSpecificDateQuery = Boolean(dateParam || ethDateParam)

    const result = await getVerseOfTheDay({
      date: isEthCalendar ? undefined : dateParam,
      ethDate: ethDateParam,
    })

    // 2. ETag validation for conditional requests (304 Not Modified)
    const etag = `W/"votd-${result.data.date.gregorian}-${result.data.verse.bookId}-${result.data.verse.chapter}-${result.data.verse.verse}"`
    const ifNoneMatch = req.headers.get('if-none-match')

    const responseHeaders = {
      ...CORS_HEADERS,
      ...getCacheHeaders(isSpecificDateQuery),
      ETag: etag,
      'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
      'X-RateLimit-Remaining': String(rateLimit.remaining),
      'X-RateLimit-Reset': String(rateLimit.resetInSec),
    }

    if (ifNoneMatch && ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: responseHeaders,
      })
    }

    return NextResponse.json(result, {
      status: 200,
      headers: responseHeaders,
    })
  } catch (error: any) {
    console.error('VOTD API Error:', error)

    const isBadRequest = error?.message?.includes('Invalid date parameter')

    return NextResponse.json(
      {
        status: 'error',
        message: error?.message || 'Failed to retrieve Verse of the Day',
      },
      {
        status: isBadRequest ? 400 : 500,
        headers: CORS_HEADERS,
      },
    )
  }
}

