export type User = {
  id: string
  name: string
  email?: string
}

export type AuthResponse = {
  token: string // from backend auth endpoints :contentReference[oaicite:6]{index=6}
  user: User
}

export type Settings = {
  theme: 'light' | 'dark'
  fontSize: number
  lastRead?: { bookId: string; chapter: number }
}

export type UserProfile = {
  id: string
  name: string
  email: string
  settings: Settings
  streak: { current: number; longest: number; lastDate: string }
}

export type Progress = {
  userId: string
  chaptersRead: Record<string, number[]>
}
