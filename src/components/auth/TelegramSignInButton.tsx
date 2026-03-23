'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/lib/stores/useUserStore'
import { toast } from 'sonner'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function TelegramSignInButton() {
    const { loginWithTelegram } = useAuthStore()
    const { loadSession } = useUserStore()
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const containerRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(false)

    // 1. Must match EXACTLY "EOTCOpenSource_bot"
    const botName = 'EOTCOpenSource_bot'

    const processTelegramData = useCallback(
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

    // Handle data-auth-url redirect back with query parameters
    useEffect(() => {
        const id = searchParams?.get('id')
        const hash = searchParams?.get('hash')
        
        if (id && hash) {
            const user = {
                id: Number(id),
                first_name: searchParams.get('first_name') || undefined,
                last_name: searchParams.get('last_name') || undefined,
                username: searchParams.get('username') || undefined,
                photo_url: searchParams.get('photo_url') || undefined,
                auth_date: Number(searchParams.get('auth_date')),
                hash: hash,
            }
            
            // Clean URL query params to avoid re-triggering
            router.replace(pathname || '/login')
            
            // Trigger login
            processTelegramData(user)
        }
    }, [searchParams, pathname, router, processTelegramData])

    useEffect(() => {
        if (!botName || !containerRef.current) return

        const container = containerRef.current
        container.innerHTML = ''

        // 2. data-auth-url uses the EXACT same domain as the website dynamically
        // Ensure HTTPS and exact domain mapping (www vs non-www matches precisely location.origin)
        const currentDomain = window.location.origin
        const currentUrl = `${currentDomain}${pathname || '/login'}`

        const script = document.createElement('script')
        script.src = 'https://telegram.org/js/telegram-widget.js?23'
        script.setAttribute('data-telegram-login', botName)
        script.setAttribute('data-auth-url', currentUrl)
        script.setAttribute('data-size', 'large')
        script.setAttribute('data-request-access', 'write')
        script.async = true
        container.appendChild(script)

    }, [botName, pathname])

    return (
        <div className="w-full">
            <div ref={containerRef} className="flex w-full justify-center" />
            {loading && (
                <p className="mt-1 text-center text-xs text-gray-500">Signing in with Telegram...</p>
            )}
        </div>
    )
}
