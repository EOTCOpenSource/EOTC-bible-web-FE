'use client'

import React, { useRef } from 'react'
import { MoveLeft, MoveRight } from 'lucide-react'

interface HorizontalScrollCarouselProps {
    children: React.ReactNode
    className?: string
}

export const HorizontalScrollCarousel: React.FC<HorizontalScrollCarouselProps> = ({
    children,
    className = '',
}) => {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scrollLeft = () => {
        if (scrollRef.current && scrollRef.current.children[0]) {
            const cardWidth = scrollRef.current.children[0].clientWidth
            scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (scrollRef.current && scrollRef.current.children[0]) {
            const cardWidth = scrollRef.current.children[0].clientWidth
            scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' })
        }
    }

    return (
        <div className={`relative ${className}`}>
            <div
                className="scrollbar-hide flex snap-x snap-mandatory scroll-px-4 flex-nowrap gap-4 overflow-x-hidden pb-4"
                ref={scrollRef}
            >
                {children}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-4 flex justify-start space-x-2 md:absolute md:-top-20 md:right-0">
                <button
                    onClick={scrollLeft}
                    className="flex h-8 w-8 items-center justify-center rounded bg-[#E5E0D8] text-[#4A4A4A] hover:bg-[#D6C5B3] transition-colors"
                    aria-label="Scroll left"
                >
                    <MoveLeft size={16} />
                </button>
                <button
                    onClick={scrollRight}
                    className="flex h-8 w-8 items-center justify-center rounded bg-[#8B2525] text-white hover:bg-[#7A2121] transition-colors"
                    aria-label="Scroll right"
                >
                    <MoveRight size={16} />
                </button>
            </div>
        </div>
    )
}
