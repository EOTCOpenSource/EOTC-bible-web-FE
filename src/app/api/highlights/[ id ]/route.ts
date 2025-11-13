import { NextResponse } from 'next/server'
import serverAxiosInstance from '@/lib/server-axios'

interface Params {
  params: { id: string }
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = params
  try {
    const body = await req.json()
    const response = await serverAxiosInstance.patch(`/api/v1/highlights/${id}`, body)
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error(`Error updating highlight ${id}:`, error.message)
    return NextResponse.json(
      { error: 'Failed to update highlight' },
      { status: error.response?.status || 500 }
    )
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const { id } = params
  try {
    const response = await serverAxiosInstance.delete(`/api/v1/highlights/${id}`)
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error(`Error deleting highlight ${id}:`, error.message)
    return NextResponse.json(
      { error: 'Failed to delete highlight' },
      { status: error.response?.status || 500 }
    )
  }
}
