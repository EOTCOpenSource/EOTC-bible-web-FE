'use client'

import { ProfileSidebar } from '@/components/dashboard/profile/ProfileSidebar'
import { ProfileMainContent } from '@/components/dashboard/profile/ProfileMainContent'
import Navbar from '@/components/landing/Navbar'

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-[#FFFBEB]/30">
            <Navbar />
            <div className="pt-24 p-4 md:p-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                    <ProfileSidebar />
                    <ProfileMainContent />
                </div>
            </div>
        </div>
    )
}
