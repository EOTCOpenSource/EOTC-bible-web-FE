import { NextRequest, NextResponse } from 'next/server'
import { getVerseOfTheDay } from '@/lib/votd/service'

export const dynamic = 'force-dynamic'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
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
    const dateParam = searchParams.get('date') || undefined

    const result = await getVerseOfTheDay({ date: dateParam })

    return NextResponse.json(result, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        ...CACHE_HEADERS,
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
