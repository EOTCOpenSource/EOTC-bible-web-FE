import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
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
    
    const response = await serverAxiosInstance.put(`/highlights/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error(`Error updating highlight ${id}:`, error.message)
    
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Unauthorized. Your session may have expired. Please login again.' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to update highlight' 
      },
      { status: error.response?.status || 500 }
    )
  }
}


export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
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
    
    const response = await serverAxiosInstance.put(`/highlights/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error(`Error updating highlight ${id}:`, error.message)
    
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Unauthorized. Your session may have expired. Please login again.' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to update highlight' 
      },
      { status: error.response?.status || 500 }
    )
  }
}
