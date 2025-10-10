'use client'
import { useEffect } from 'react'
import { useUserStore } from '@/lib/stores/useUserStore'

export default function Navbar() {
  const { user, isLoggedIn, loadSession } = useUserStore()

  useEffect(() => {
    loadSession() // hydrate on mount
  }, [loadSession])
  isLoggedIn
  return (
    <nav className="flex justify-between border-b p-4">
      <span className="font-bold">Bible App</span>
      {isLoggedIn ? (
        <span>Hi, {user?.name}</span>
      ) : (
        <a href="/login" className="text-blue-500">
          Login
        </a>
      )}
    </nav>
  )
}
