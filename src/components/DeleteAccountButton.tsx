'use client'
import { useUserStore } from '@/lib/stores/useUserStore'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function DeleteAccoutButton() {
  const { logout } = useUserStore()
  const router = useRouter()
  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      const res = await axios.delete('/api/auth/delete-account', {
        withCredentials: true,
      })

      if (res.status === 200) {
        alert('Your account has been deleted.')
        logout()
        router.push('/register')
      } else {
        const errorData = res.data
        alert(`Failed to delete account: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Delete account error:', error)
      alert('An error occurred while trying to delete your account.')
    }
  }
  return (
    <button
      onClick={handleDeleteAccount}
      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
    >
      Delete Account
    </button>
  )
}
