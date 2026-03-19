'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { ENV } from '@/lib/env'
import { ReactNode } from 'react'

export default function GoogleAuthProvider({ children }: { children: ReactNode }) {
    if (!ENV.googleClientId) {
        return <>{children}</>
    }

    return (
        <GoogleOAuthProvider clientId={ENV.googleClientId}>
            {children}
        </GoogleOAuthProvider>
    )
}
