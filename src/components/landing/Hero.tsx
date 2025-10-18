"use client";
import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

const Hero = () => {
  const t = useTranslations('Hero')

  return (
    <section
      className="relative min-h-screen w-full text-white"
      style={{
        backgroundImage: 'url(/hero-image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'top',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(127, 29, 29, 0.9) 0%, rgba(127, 29, 29, 0.7) 28%, transparent 100%)',
        }}
      ></div>
      <div className="relative container mx-auto flex h-full min-h-[766px] flex-col justify-center px-4">
        <div className="mt-48 w-full text-left md:absolute md:top-[319px] md:left-[48px] md:mt-0 md:w-[554px]">
          <p className="inline-block rounded-full bg-red-900/30 px-3 text-sm text-red-100">
            {t('developedBy')} &gt;
          </p>
          <h1 className="mt-2 text-4xl font-bold md:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg">
            {t('description')}
          </p>
          <button className="mt-8 flex items-center space-x-2 rounded-lg bg-white py-2 pr-2 pl-6 text-lg text-red-900">
            <span>{t('button')}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-red-900 p-1 text-white">
              <ArrowUpRight size={20} />
            </div>
          </button>
        </div>

        {/* APP DOWNLOAD CARD */}
        <div className="mx-auto mt-8 mb-8 w-full max-w-md rounded-lg bg-gradient-to-t from-gray-100 to-white p-6 text-black shadow-lg md:absolute md:right-6 md:bottom-4 md:mb-0 md:w-[480px]">
          {/* MOBILE LAYOUT */}
          <div className="block text-center md:hidden">
            <div className="flex items-center justify-center">
              <img src="/app-icon.png" alt={t('appCard.appIconAlt')} className="mr-3 h-10 w-10" />
              <h3 className="text-lg font-bold">{t('appCard.mobileTitle')}</h3>
            </div>
            <p className="mt-2 text-sm">{t('appCard.mobileDescription')}</p>
            <div className="mt-4 flex justify-center space-x-2">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="/google-play-badge.svg" alt={t('appCard.googlePlayAlt')} width="128" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img src="/app-store-badge.png" alt={t('appCard.appStoreAlt')} width="128" />
              </a>
            </div>
          </div>

          {/* DESKTOP LAYOUT */}
          <div className="hidden items-center md:flex">
            <div className="mr-6 h-[135px] w-32 flex-shrink-0 overflow-hidden">
              <div className="relative flex h-56 w-full items-start justify-center rounded-2xl border-4 border-gray-900 bg-white p-2 pt-4 shadow-lg">
                <div className="absolute top-2 h-2 w-8 rounded-full bg-gray-800"></div>
                <div className="mt-6 flex h-auto w-full items-center justify-center rounded-lg bg-white p-1">
                  <img src="/qr-code.png" alt={t('appCard.qrAlt')} className="h-full w-full object-contain" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <img src="/app-icon.png" alt={t('appCard.appIconAlt')} className="mr-3 h-10 w-10" />
                <h3 className="text-lg font-bold">{t('appCard.mobileTitle')}</h3>
              </div>
              <p className="mt-2 text-sm">{t('appCard.mobileDescription')}</p>
              <div className="mt-4 flex space-x-2">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img src="/google-play-badge.svg" alt={t('appCard.googlePlayAlt')} width="128" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img src="/app-store-badge.png" alt={t('appCard.appStoreAlt')} width="128" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
