import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ENV } from '@/lib/env'
import serverAxiosInstance from '@/lib/server-axios'

interface Params {
  params: Promise<{ id: string }>
}

const getAuthToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get(ENV.jwtCookieName)?.value
}

const unauthorizedResponse = NextResponse.json(
  { error: 'Unauthorized. Please login first.' },
  { status: 401 }
)

const notFoundResponse = NextResponse.json({ error: 'Highlight ID is required' }, { status: 400 })

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params
  if (!id) return notFoundResponse

  try {
    const token = await getAuthToken()
    if (!token) {
      return unauthorizedResponse
    }

    const response = await serverAxiosInstance.get(`/highlights/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error(`Error fetching highlight ${id}:`, error.message)

    if (error.response?.status === 401) {
      return unauthorizedResponse
    }

    return NextResponse.json(
      {
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch highlight',
      },
      { status: error.response?.status || 500 }
    )
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params
  if (!id) return notFoundResponse

  try {
    const token = await getAuthToken()
    if (!token) {
      return unauthorizedResponse
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
      return unauthorizedResponse
    }

    return NextResponse.json(
      {
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to update highlight',
      },
      { status: error.response?.status || 500 }
    )
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params
  if (!id) return notFoundResponse

  try {
    const token = await getAuthToken()
    if (!token) {
      return unauthorizedResponse
    }

    const response = await serverAxiosInstance.delete(`/highlights/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error(`Error deleting highlight ${id}:`, error.message)

    if (error.response?.status === 401) {
      return unauthorizedResponse
    }

    return NextResponse.json(
      {
        error: error.response?.data?.error || error.response?.data?.message || 'Failed to delete highlight',
      },
      { status: error.response?.status || 500 }
    )
  }
}