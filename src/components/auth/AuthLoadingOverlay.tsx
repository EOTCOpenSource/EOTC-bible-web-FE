'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Loader2, ShieldCheck, Zap } from 'lucide-react'

const MESSAGES = [
    {
        time: 0,
        geez: 'በስመ አብ ወወልድ ወመንፈስ ቅዱስ',
        amharic: 'እየገባን ነው...',
        english: 'Signing you in...',
    },
    {
        time: 4000,
        geez: 'እግዚአብሔር ብርሃኔ ነው',
        amharic: 'ከአገልጋዩ ጋር በመገናኘት ላይ...',
        english: 'Connecting to secure server...',
    },
    {
        time: 10000,
        geez: 'ተስፋ አድርግ በእግዚአብሔር',
        amharic: 'የኋላ አገልግሎቱን በማንቃት ላይ...',
        english: 'Waking up the backend service...',
    },
    {
        time: 25000,
        geez: 'እግዚአብሔር ረዳቴ ነው',
        amharic: 'ትንሽ ጊዜ እየወሰደ ነው፣ ይቅርታ...',
        english: 'This is taking a bit longer than usual...',
    },
    {
        time: 45000,
        geez: 'እግዚአብሔር ጠባቂዬ ነው',
        amharic: 'ስለ ትዕግስትዎ እናመሰግናለን፣ መንፈሳዊ ጉዞዎን ይጀምሩ...',
        english: 'Thank you for your patience...',
    },
]

export default function AuthLoadingOverlay() {
    const { isLoading } = useAuthStore()
    const [messageIndex, setMessageIndex] = useState(0)

    useEffect(() => {
        if (!isLoading) {
            setMessageIndex(0)
            return
        }

        const timers = MESSAGES.map((msg, index) => {
            if (index === 0) return null
            return setTimeout(() => {
                setMessageIndex(index)
            }, msg.time)
        })

        return () => {
            timers.forEach(timer => timer && clearTimeout(timer))
        }
    }, [isLoading])

    if (!isLoading) return null

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/20 backdrop-blur-md dark:bg-black/40">
            <div className="relative flex flex-col items-center p-8 rounded-3xl bg-white dark:bg-neutral-900 shadow-2xl border border-gray-100 dark:border-neutral-800 animate-in fade-in zoom-in duration-300">

                {/* Visual decorative elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center animate-pulse">
                    <ShieldCheck className="w-6 h-6 text-red-600" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-yellow-600" />
                </div>

                {/* Main Spinner */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-red-100 dark:border-neutral-800" />
                    <Loader2 className="w-16 h-16 text-[#621B1C] animate-spin" strokeWidth={1.5} />
                </div>

                {/* Progressive messages — Ge'ez heading, Amharic + English sub-text */}
                <div className="text-center space-y-2 max-w-[320px]">
                    <h3 className="text-lg font-bold text-[#621B1C] dark:text-red-400 transition-all duration-500 leading-relaxed">
                        {MESSAGES[messageIndex].geez}
                    </h3>
                    <p className="text-base font-medium text-gray-800 dark:text-gray-200 transition-all duration-500">
                        {MESSAGES[messageIndex].amharic}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {MESSAGES[messageIndex].english}
                    </p>
                </div>

                {/* Progress dot indicator */}
                <div className="mt-8 flex gap-1.5">
                    {MESSAGES.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${i === messageIndex ? 'w-6 bg-[#621B1C]' : 'w-2 bg-gray-200 dark:bg-neutral-800'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
