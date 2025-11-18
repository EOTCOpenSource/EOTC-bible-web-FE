import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'

export async function DELETE(req: NextRequest) {
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
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Highlight ID is required' },
        { status: 400 }
      )
    }

    const response = await serverAxiosInstance.delete(`/highlights/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Explicitly pass token
      },
    })
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error deleting highlight:', error.message)
    
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Unauthorized. Your session may have expired. Please login again.' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to delete highlight' 
      },
      { status: error.response?.status || 500 }
    )
  }
}

