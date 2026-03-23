'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/lib/stores/useUserStore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ENV } from '@/lib/env'

declare global {
    interface Window {
        onTelegramAuth: (user: any) => void
    }
}

export default function TelegramSignInButton() {
    const { loginWithTelegram } = useAuthStore()
    const { loadSession } = useUserStore()
    const router = useRouter()
    const containerRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(false)

    const botName = ENV.telegramBotName

    const handleTelegramAuth = useCallback(
        async (user: any) => {
            setLoading(true)
            try {
                await loginWithTelegram(user)
                toast.success('Login with Telegram successful')
                await loadSession()
                router.push('/dashboard')
            } catch (err: any) {
                const msg = err?.response?.data?.error || 'Telegram verification failed'
                toast.error(msg)
            } finally {
                setLoading(false)
            }
        },
        [loginWithTelegram, loadSession, router],
    )

    useEffect(() => {
        if (!botName || !containerRef.current) return

        // Set the global callback
        window.onTelegramAuth = handleTelegramAuth

        // Clear previous widget if any
        const container = containerRef.current
        container.innerHTML = ''

        const script = document.createElement('script')
        script.src = 'https://telegram.org/js/telegram-widget.js?23'
        script.setAttribute('data-telegram-login', botName)
        script.setAttribute('data-size', 'large')
        script.setAttribute('data-onauth', 'onTelegramAuth(user)')
        script.setAttribute('data-request-access', 'write')
        script.async = true
        container.appendChild(script)

        return () => {
            delete (window as any).onTelegramAuth
        }
    }, [botName, handleTelegramAuth])

    if (!botName) return null

    // Show a custom button as a fallback/loading state while the widget loads
    return (
        <div className="w-full">
            <div ref={containerRef} className="flex w-full justify-center" />
            {loading && (
                <p className="mt-1 text-center text-xs text-gray-500">Signing in with Telegram...</p>
            )}
        </div>
    )
}
