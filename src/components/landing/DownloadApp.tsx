'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

const DownloadApp = () => {
  const t = useTranslations('DownloadApp')

  return (
    <section id="download" className="relative overflow-hidden bg-gray-50 py-20 dark:bg-black">
      <div className="absolute inset-0 z-0 -rotate-33 transform overflow-hidden md:rotate-0 dark:hidden">
        <Image
          src="/download-app-card-bg.png"
          alt="Download Card Background"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="relative z-10 container mx-auto flex items-center justify-center px-4">
        <div className="flex h-auto w-full max-w-[1449px] items-center justify-center md:h-[410px]">
          <div className="relative flex h-auto w-full max-w-[859px] items-center justify-center md:h-[386px]">
            <div className="relative flex h-auto w-full max-w-[859px] flex-col items-start justify-between overflow-hidden rounded-[15px] p-4 pb-0 md:h-[305px] md:flex-row md:justify-start md:p-0">
              <Image
                src="/download-bg.png"
                alt="Download Background"
                fill
                className="z-0 object-cover object-center"
                sizes="(max-width: 768px) 100vw, 859px"
              />
              <div className="relative z-10 h-auto w-full md:mt-[46px] md:ml-[32px] md:h-[158px] md:w-[455px] md:text-left">
                <h2 className="text-2xl font-bold text-white md:text-3xl">Coming Soon</h2>
                <p className="mt-4 text-sm text-white md:text-base">{t('description')}</p>
                <div className="mt-8 flex justify-center space-x-4 md:justify-start">
                  <div className="cursor-not-allowed opacity-50">
                    <Image
                      src="/google-play-badge.svg"
                      alt={t('googlePlayAlt')}
                      width={128}
                      height={40}
                      className="pointer-events-none w-32 grayscale md:w-32"
                    />
                  </div>
                  <div className="cursor-not-allowed opacity-50">
                    <Image
                      src="/app-store-badge.png"
                      alt={t('appStoreAlt')}
                      width={128}
                      height={40}
                      className="pointer-events-none w-32 grayscale md:w-32"
                    />
                  </div>
                </div>
              </div>
              <div className="relative z-10 mt-8 md:absolute md:-top-12 md:right-0 md:mt-0 md:pb-0">
                <Image
                  src="/mobile-hand.png"
                  alt={t('mobileAlt')}
                  width={292}
                  height={386}
                  className="h-[386px] w-[292px]"
                  sizes="(max-width: 768px) 100vw, 292px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DownloadApp
