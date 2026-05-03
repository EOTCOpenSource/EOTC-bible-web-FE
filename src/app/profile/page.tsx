'use client'

import { ProfileSidebar } from '@/components/dashboard/profile/ProfileSidebar'
import { ProfileMainContent } from '@/components/dashboard/profile/ProfileMainContent'
import Navbar from '@/components/landing/Navbar'
import { Toaster } from '@/components/ui/sonner'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    // Handle email redirect: if user comes from achievement email, redirect to achievements page
    useEffect(() => {
        const source = searchParams.get('source')
        const achievementId = searchParams.get('achievementId')

        if (source === 'achievement-email' || achievementId) {
            // Redirect to achievements page with the achievement highlighted
            router.replace('/dashboard/achievements' + (achievementId ? `?highlight=${achievementId}` : ''))
        }
    }, [searchParams, router])

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FFFBEB] to-white dark:from-[#2C0607] dark:to-[#1A1A19]">
            <Navbar />
            <div className="pt-[128px] p-4">
                <div className="max-w-[840px] mx-auto flex flex-col-reverse md:flex-row gap-[20px]">
                    <ProfileSidebar />
                    <ProfileMainContent />
                </div>
            </div>
            <Toaster position="top-right" />
        </div>
    )
}
