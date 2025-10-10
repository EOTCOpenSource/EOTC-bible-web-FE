export const ENV = {
  backendBaseUrl: process.env.BACKEND_BASE_URL || process.env.BACKEND_URL || '',
  jwtCookieName: process.env.JWT_COOKIE_NAME ?? 'auth_token',
  node_env: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || '80 weahadu bible',
}

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export function validateEnvironment() {
  const missing = []

  if (!ENV.backendBaseUrl) {
    missing.push('BACKEND_BASE_URL (or BACKEND_URL)')
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
