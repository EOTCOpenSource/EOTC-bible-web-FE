'use client'

import { ProfileSidebar } from '@/components/dashboard/profile/ProfileSidebar'
import { ProfileMainContent } from '@/components/dashboard/profile/ProfileMainContent'
import Navbar from '@/components/landing/Navbar'
import { Toaster } from '@/components/ui/sonner'

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FFFBEB] to-white dark:from-[#2C0607] dark:to-[#1A1A19]">
            <Navbar />
            <div className="pt-[128px] p-4">
                <div className="max-w-[840px] mx-auto flex flex-col md:flex-row gap-[20px]">
                    <ProfileSidebar />
                    <ProfileMainContent />
                </div>
            </div>
            <Toaster position="top-right" />
        </div>
    )
}
