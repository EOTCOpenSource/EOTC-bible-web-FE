'use client'

import { GoogleLogin } from '@react-oauth/google'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/stores/useUserStore'

export default function GoogleSignInButton() {
    const { loginWithGoogle, isLoading } = useAuthStore()
    const { loadSession } = useUserStore()
    const t = useTranslations('Auth.login')
    const router = useRouter()

    return (
        <div className="flex justify-center w-full sm:w-auto">
            <GoogleLogin
                onSuccess={async (credentialResponse) => {
                    if (credentialResponse.credential) {
                        try {
                            await loginWithGoogle(credentialResponse.credential)
                            toast.success('Login with Google successful')
                            await loadSession()
                            router.push('/dashboard')
                        } catch (error: any) {
                            const msg = error?.response?.data?.error || 'Google verification failed'
                            toast.error(msg)
                        }
                    }
                }}
                onError={() => {
                    toast.error('Google Sign-In failed')
                }}
                useOneTap
                theme="outline"
                shape="rectangular"
                width="225"
                logo_alignment="center"
                text="continue_with"
            />
        </div>
    )
}
