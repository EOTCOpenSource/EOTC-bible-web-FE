import { NextResponse } from 'next/server'
import serverAxiosInstance from '@/lib/server-axios'

export async function GET() {
  try {
    const response = await serverAxiosInstance.get('/api/v1/highlights')
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error fetching highlights:', error.message)
    return NextResponse.json(
      { error: 'Failed to fetch highlights' },
      { status: error.response?.status || 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const response = await serverAxiosInstance.post('/api/v1/highlights', body)
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error adding highlight:', error.message)
    return NextResponse.json(
      { error: 'Failed to add highlight' },
      { status: error.response?.status || 500 }
    )
  }
}
