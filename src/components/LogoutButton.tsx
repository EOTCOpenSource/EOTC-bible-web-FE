"use client"

import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const { logout } = useAuthStore()
  const router = useRouter()
  const handleLogout = async () => {
    try {
       await logout()
       router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/login")
    }
  }
  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
    >
      Logout
    </button>
  );
}
