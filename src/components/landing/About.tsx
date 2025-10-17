'use client'

import { useUIStore } from '@/stores/uiStore'
import { ArrowUpRight, MoveLeft, MoveRight } from 'lucide-react'
import React from 'react'

import { useLocalizedContent } from '@/hooks/use-localized-context'
import amLocale from '../../messages/am.json'
import enLocale from '../../messages/en.json'
import gezLocale from '../../messages/gez.json'
import omLocale from '../../messages/or.json'
import tiLocale from '../../messages/tg.json'

type AboutContent = typeof amLocale.About

const aboutMap: Record<string, AboutContent> = {
  am: amLocale.About,
  en: enLocale.About,
  gez: gezLocale.About,
  ti: tiLocale.About,
  or: omLocale.About,
}

const About: React.FC = () => {
  const { setAboutScrollRef, scrollAboutLeft, scrollAboutRight } = useUIStore()
  const about = useLocalizedContent(aboutMap)
  const allCards = [...about.cards, ...about.cards]

  return (
    <section id="about" className="flex w-full flex-col items-center justify-center gap-10 py-20 bg-red-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-start">
          {/* Hero Section */}
          <div className="flex h-auto w-full flex-col-reverse md:h-[430px] md:w-1/3 md:flex-col">
            <h2 className="mb-2 text-left text-3xl font-bold text-white md:mb-4">
              {about.hero.title.line1} <br className="md:hidden" />
              {about.hero.title.line2} <br className="hidden md:block" />
              {about.hero.title.line3}{' '}
              <span className="text-yellow-400 italic">{about.hero.title.highlight}</span>
            </h2>
            <img
              src="/unique-scriptures.png"
              alt={about.hero.imageAlt || 'Unique Scriptures'}
              className="mb-8 h-auto w-full rounded-lg object-cover shadow-lg sm:h-96 md:mb-0"
            />
          </div>

          {/* Description + CTA + Cards */}
          <div className="mt-0 w-full md:mt-0 md:w-2/3 md:pl-12">
            <p className="text-gray-200 md:w-2/3">{about.hero.description}</p>

            {/* CTA Button */}
            <button className="mt-8 flex items-center space-x-2 rounded-lg py-2 pr-2 pl-6 text-lg bg-white text-red-900">
              <span>{about.hero.ctaText}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-red-900 p-1 text-white">
                <ArrowUpRight size={20} />
              </div>
            </button>

            {/* Cards Carousel */}
            <div className="relative mt-28">
              <div
                className="scrollbar-hide flex snap-x snap-mandatory scroll-px-4 flex-nowrap gap-4 overflow-x-hidden pb-4"
                ref={setAboutScrollRef}
              >
                {allCards.map((card, index) => (
                  <div
                    key={`${card.title}-${index}`}
                    className="h-[188px] w-full flex-shrink-0 snap-center rounded-lg bg-white p-6 text-left shadow-md sm:w-[303px]"
                  >
                    <h3 className="font-bold text-amber-900">{card.title}</h3>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-4 flex justify-start space-x-0.5 md:absolute md:-top-20 md:right-0">
                <button
                  onClick={scrollAboutLeft}
                  className="rounded-xs p-2 shadow-md bg-yellow-400 text-red-900"
                >
                  <MoveLeft size={24} />
                </button>
                <button
                  onClick={scrollAboutRight}
                  className="rounded-xs p-2 shadow-md bg-yellow-400 text-red-900"
                >
                  <MoveRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
