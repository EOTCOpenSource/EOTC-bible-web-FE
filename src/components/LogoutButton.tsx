'use client'

import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const { logout } = useAuthStore()
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
    }
  }
  return (
    <button
      onClick={handleLogout}
      className="rounded-full p-2 hover:bg-gray-200"
    >
      <LogOut size={20}/>
    </button>
  )
}
