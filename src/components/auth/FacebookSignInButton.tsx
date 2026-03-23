'use client'

import { useEffect, useCallback, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/lib/stores/useUserStore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ENV } from '@/lib/env'
import { Button } from '@/components/ui/button'

declare global {
    interface Window {
        FB: any
        fbAsyncInit: () => void
    }
}

export default function FacebookSignInButton() {
    const { loginWithFacebook } = useAuthStore()
    const { loadSession } = useUserStore()
    const router = useRouter()
    const [sdkReady, setSdkReady] = useState(false)
    const [loading, setLoading] = useState(false)

    const appId = ENV.facebookAppId

    useEffect(() => {
        if (!appId) return

        // Prevent loading the SDK twice
        if (document.getElementById('facebook-jssdk')) {
            if (window.FB) setSdkReady(true)
            return
        }

        window.fbAsyncInit = () => {
            window.FB.init({
                appId,
                cookie: true,
                xfbml: false,
                version: 'v19.0',
            })
            setSdkReady(true)
        }

        const script = document.createElement('script')
        script.id = 'facebook-jssdk'
        script.src = 'https://connect.facebook.net/en_US/sdk.js'
        script.async = true
        script.defer = true
        document.body.appendChild(script)
    }, [appId])

    const handleLogin = useCallback(() => {
        if (!window.FB || loading) return

        setLoading(true)
        window.FB.login(
            (response: any) => {
                if (response.authResponse) {
                    const { accessToken } = response.authResponse
                    loginWithFacebook(accessToken)
                        .then(async () => {
                            toast.success('Login with Facebook successful')
                            await loadSession()
                            router.push('/dashboard')
                        })
                        .catch((err: any) => {
                            const msg = err?.response?.data?.error || 'Facebook verification failed'
                            toast.error(msg)
                        })
                        .finally(() => setLoading(false))
                } else {
                    toast.error('Facebook login cancelled')
                    setLoading(false)
                }
            },
            { scope: 'public_profile,email' },
        )
    }, [loginWithFacebook, loadSession, router, loading])

    if (!appId) return null

    return (
        <div className="flex justify-center w-full sm:w-auto">
            <Button
                type="button"
                variant="outline"
                onClick={handleLogin}
                disabled={!sdkReady || loading}
                className="flex w-[225px] h-[40px] cursor-pointer items-center justify-center gap-2 rounded-[4px] border border-[#dadce0] bg-white px-3 py-2 text-sm font-medium text-[#3c4043] shadow-sm transition-all hover:bg-gray-50 hover:text-[#3c4043] disabled:cursor-not-allowed disabled:opacity-50"
            >
                <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                {loading ? 'Signing in...' : 'Continue with Facebook'}
            </Button>
        </div>
    )
}
