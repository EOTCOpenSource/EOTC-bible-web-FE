'use client'

import { useUIStore } from '@/stores/uiStore'
import { ArrowUpRight, MoveLeft, MoveRight, Book, Bird, Church, History, Globe, ScrollText } from 'lucide-react'
import React from 'react'
import Image from 'next/image'

const cardIcons = [Book, Bird, Church, History, Globe, ScrollText]

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
  tg: tiLocale.About,
  or: omLocale.About,
}

const About: React.FC = () => {
  const { setAboutScrollRef, scrollAboutLeft, scrollAboutRight } = useUIStore()
  const about = useLocalizedContent(aboutMap)
  const allCards = about.cards

  return (
    <section
      id="about"
      className="flex w-full flex-col items-center justify-center bg-gradient-to-r from-[#4C0E0F] to-[#2C0607]"
    >
      {/* Marquee Banner */}
      <div className="flex w-full overflow-hidden bg-[#FAF0EA] py-3 border-y border-[#4C0E0F]/20">
        <div className="flex whitespace-nowrap animate-marquee items-center shrink-0">
          {[...Array(15)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-[#1A1A19] font-sans font-semibold text-[34px] leading-[0.8] tracking-[-0.03em] px-6">About EOTC Bible</span>
              <span className="text-[#4C0E0F] text-[34px] px-2 leading-[0.8]">☨</span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee items-center shrink-0">
          {[...Array(15)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-[#1A1A19] font-sans font-semibold text-[34px] leading-[0.8] tracking-[-0.03em] px-6">About EOTC Bible</span>
              <span className="text-[#4C0E0F] text-[34px] px-2 leading-[0.8]">☨</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row lg:items-start">
          {/* Hero Section */}
          <div className="flex h-auto w-full flex-col-reverse lg:h-[430px] lg:w-1/3 lg:flex-col">
            <h2 className="mb-2 w-full text-left text-[36px] font-semibold leading-[115%] tracking-[-0.03em] text-white lg:mb-4 lg:w-[466px]">
              {about.hero.title.line1} <br className="lg:hidden" />
              {about.hero.title.line2} <br className="hidden lg:block" />
              {about.hero.title.line3}{' '}
              <span className="font-migra-semibold tracking-[-0.03em] text-secondary">
                {about.hero.title.highlight}
              </span>
            </h2>
            <Image
              src="/unique-scriptures.png"
              alt={about.hero.imageAlt || 'Unique Scriptures'}
              width={600}
              height={400}
              className="mb-8 h-auto w-full rounded-lg object-cover shadow-lg sm:h-96 lg:mb-0"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>

          {/* Description + CTA + Cards */}
          <div className="mt-0 w-full lg:mt-0 lg:w-2/3 lg:pl-12">
            <p className="text-gray-200 lg:w-2/3">{about.hero.description}</p>

            {/* CTA Button */}
            <a
              href="mailto:eotcopensource@gmail.com"
              className="mt-8 flex w-fit items-center space-x-2 rounded-lg bg-white py-2 pr-2 pl-6 text-lg text-[#4C0E0F] transition-colors hover:bg-gray-100"
            >
              <span>{about.hero.ctaText}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#4C0E0F] p-1 text-white">
                <ArrowUpRight size={20} />
              </div>
            </a>

            {/* Cards Carousel */}
            <div className="relative mt-28">
              <div
                className="scrollbar-hide flex snap-x snap-mandatory scroll-px-4 flex-nowrap gap-4 overflow-x-auto lg:overflow-x-hidden pb-4"
                ref={setAboutScrollRef}
              >
                {allCards.map((card, index) => {
                  const Icon = cardIcons[index % cardIcons.length]
                  return (
                    <div
                      key={`${card.title}-${index}`}
                      className="flex h-[188px] w-full flex-col flex-shrink-0 snap-center rounded-lg bg-white dark:bg-neutral-800 p-6 text-left shadow-md sm:w-[303px]"
                    >
                      <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-md border border-[#4C0E0F]/20 bg-[#FAF0EA] text-[#4C0E0F] dark:border-[#FAF0EA]/20 dark:bg-[#4C0E0F]/40 dark:text-[#FAF0EA]">
                        <Icon size={18} strokeWidth={1.5} />
                      </div>
                      <h3 className="font-bold text-amber-900 dark:text-amber-400">{card.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{card.description}</p>
                    </div>
                  )
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-4 flex justify-start space-x-0.5 lg:absolute lg:-top-20 lg:right-0">
                <button
                  onClick={scrollAboutLeft}
                  className="rounded-xs bg-yellow-400 p-2 text-[#4C0E0F] shadow-md"
                >
                  <MoveLeft size={24} />
                </button>
                <button
                  onClick={scrollAboutRight}
                  className="rounded-xs bg-yellow-400 p-2 text-[#4C0E0F] shadow-md"
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
