'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

const makeStorageKey = (userId?: string | null) =>
  `planTemplateBookmarks:v1:${userId || 'guest'}`

const readSlugs = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((v) => typeof v === 'string')
  } catch {
    return []
  }
}

const writeSlugs = (key: string, slugs: string[]) => {
  localStorage.setItem(key, JSON.stringify(Array.from(new Set(slugs))))
}

export const usePlanTemplateBookmarks = (userId?: string | null) => {
  const storageKey = useMemo(() => makeStorageKey(userId), [userId])
  const [isReady, setIsReady] = useState(false)
  const [slugs, setSlugs] = useState<string[]>([])

  useEffect(() => {
    setSlugs(readSlugs(storageKey))
    setIsReady(true)
  }, [storageKey])

  const isBookmarked = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs],
  )

  const toggleBookmark = useCallback(
    (slug: string) => {
      setSlugs((prev) => {
        const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        writeSlugs(storageKey, next)
        return next
      })
    },
    [storageKey],
  )

  return { isReady, slugs, isBookmarked, toggleBookmark }
}

