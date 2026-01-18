'use client'

import { useUserStore } from '@/lib/stores/useUserStore'
import { User, Mail } from 'lucide-react'

export default function ProfilePage() {
    const { user, updateSettings } = useUserStore()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-poppins text-gray-900">My Profile</h1>
            </div>

            <div className="bg-white rounded-[20px] border border-[#C9C9C9] p-6 md:p-8 shadow-sm max-w-2xl">
                <div className="flex items-start gap-6">
                    <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <User size={40} className="text-gray-400" />
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500 mb-1 block">Full Name</label>
                            <div className="font-medium text-lg text-gray-900">{user?.name || 'Guest User'}</div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500 mb-1 block">Email Address</label>
                            <div className="flex items-center gap-2 text-gray-900">
                                <Mail size={16} className="text-gray-400" />
                                <span>{user?.email || 'No email provided'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[20px] border border-[#C9C9C9] p-6 md:p-8 shadow-sm max-w-2xl">
                <h2 className="text-xl font-bold font-poppins text-gray-900 mb-6">Application Settings</h2>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="font-medium text-gray-900 block">Theme</label>
                            <p className="text-sm text-gray-500">Customize your interface theme</p>
                        </div>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            {['light', 'dark'].map((theme) => (
                                <button
                                    key={theme}
                                    onClick={() => updateSettings({ theme: theme as 'light' | 'dark' })}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${(user?.settings?.theme || 'light') === theme
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="font-medium text-gray-900 block">Font Size</label>
                                <p className="text-sm text-gray-500">Adjust the reading text size</p>
                            </div>
                            <span className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                                {user?.settings?.fontSize || 16}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min="12"
                            max="24"
                            step="1"
                            value={user?.settings?.fontSize || 16}
                            onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Small (12px)</span>
                            <span>Large (24px)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
