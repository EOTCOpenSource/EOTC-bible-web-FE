'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { ENV } from '@/lib/env'
import { ReactNode } from 'react'

export default function GoogleAuthProvider({ children }: { children: ReactNode }) {
  const clientId =
    ENV.googleClientId || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'missing-client-id'

  // Log for debugging if it was missing
  if (!ENV.googleClientId) {
    console.warn('Google Client ID is missing in ENV. Falling back to dummy ID.')
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
}
