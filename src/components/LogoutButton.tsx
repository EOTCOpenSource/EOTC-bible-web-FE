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
      className="text-foreground flex h-10 w-10 items-center justify-center rounded-xl p-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-800"
    >
      <div className="h-4 w-4 md:h-5 md:w-5">
        <LogOut className="h-full w-full" />
      </div>
    </button>
  )
}
