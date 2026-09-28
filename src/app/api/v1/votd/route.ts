import { NextRequest, NextResponse } from 'next/server'
import { getVerseOfTheDay } from '@/lib/votd/service'

export const dynamic = 'force-dynamic'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

    return NextResponse.json(result, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        ...getCacheHeaders(isSpecificDateQuery),
      },
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
