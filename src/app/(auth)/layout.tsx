'use client'

import BackButton from '@/components/ui/BackButton'
import { Toaster } from '@/components/ui/sonner'
import JesusLoadingOverlay from '@/components/auth/JesusLoadingOverlay'
import { useAuthStore } from '@/stores/authStore'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const isLoading = useAuthStore((state) => state.isLoading)

  return (
    <section className="grid min-h-screen items-center bg-cover bg-no-repeat md:bg-[#ac1d1d]">
      <JesusLoadingOverlay isVisible={isLoading} />
      <BackButton />
      {children}
      <Toaster position="top-right" />
    </section>
  )
}
