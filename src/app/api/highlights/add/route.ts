import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const cookieStore = await cookies()
    const token = cookieStore.get(ENV.jwtCookieName)?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const response = await serverAxiosInstance.post('/highlights', body, {
      headers: {
        Authorization: `Bearer ${token}`, // Explicitly pass token
      },
    })
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error adding highlight:', error.message)
    
    // Provide more detailed error information
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Unauthorized. Your session may have expired. Please login again.' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to add highlight',
        details: error.response?.data 
      },
      { status: error.response?.status || 500 }
    )
  }
}

