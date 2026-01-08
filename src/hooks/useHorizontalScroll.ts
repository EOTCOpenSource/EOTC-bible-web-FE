'use client'

import { useRef, useCallback } from 'react'

export function useHorizontalScroll(scrollDistance: number = 300) {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -scrollDistance, behavior: 'smooth' })
    }
  }, [scrollDistance])

  const scrollRight = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: scrollDistance, behavior: 'smooth' })
    }
  }, [scrollDistance])

  return { containerRef, scrollLeft, scrollRight }
}
