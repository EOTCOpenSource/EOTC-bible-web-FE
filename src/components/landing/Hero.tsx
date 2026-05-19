'use client'
import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

const Hero = () => {
  const t = useTranslations('Hero')

  return (
    <section className="relative min-h-screen w-full overflow-hidden text-white">
      <Image
        src="/hero-image.png"
        alt="Hero Background"
        fill
        priority
        className="-z-20 object-cover object-top"
        sizes="100vw"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[rgba(127,29,29,0.9)] via-[rgba(127,29,29,0.7)] via-28% to-transparent"></div>
      <div className="relative container mx-auto flex h-full min-h-[766px] flex-col justify-center px-4">
        <div className="mt-48 w-full text-left md:absolute md:top-[319px] md:left-[48px] md:mt-0 md:w-[554px]">
          <p className="inline-block rounded-full bg-[#41101085] px-3 py-1 text-[14px] leading-none text-[#FFD2D2] italic">
            {t('developedBy')} &gt;
          </p>
          <h1 className="mt-2 text-[40px] leading-[91%] font-semibold tracking-[-0.03em] [text-shadow:0px_4px_7px_rgba(62,49,49,0.14)] md:text-[84px]">
            {t.rich('title', {
              eth: (chunks) => (
                <span className="font-playfair font-semibold tracking-[-0.04em] text-yellow-400 italic">
                  {chunks}
                </span>
              ),
            })}
          </h1>
          <p className="mt-4 text-lg">{t('description')}</p>
          <Link href="/read-online" className="mt-8 flex w-fit">
            <button className="flex items-center space-x-2 rounded-lg bg-white py-2 pr-2 pl-6 text-lg text-[#4C0E0F]">
              <span>{t('button')}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#4C0E0F] p-1 text-white">
                <ArrowUpRight size={20} />
              </div>
            </button>
          </Link>
        </div>

        {/* APP DOWNLOAD CARD */}
        <div className="mx-auto mt-8 mb-8 w-full max-w-md rounded-lg bg-gradient-to-t from-gray-100 to-white p-6 text-black shadow-lg md:absolute md:right-6 md:bottom-4 md:mb-0 md:w-[480px] dark:from-neutral-800 dark:to-neutral-900 dark:text-white">
          {/* MOBILE LAYOUT */}
          <div className="block text-center md:hidden">
            <div className="flex items-center justify-center">
              <Image
                src="/app-icon.png"
                alt={t('appCard.appIconAlt')}
                className="mr-3 h-10 w-10"
                width={40}
                height={40}
              />
              <h3 className="text-lg font-bold">{t('appCard.mobileTitle')}</h3>
            </div>
            <p className="mt-2 text-sm">{t('appCard.mobileDescription')}</p>
            <div className="mt-8 flex justify-center space-x-4 md:justify-start">
              <div className="cursor-not-allowed opacity-50">
                <Image
                  src="/google-play-badge.svg"
                  // alt={t('googlePlayAlt')}
                  alt="Google play badge"
                  width={128}
                  height={40}
                  className="pointer-events-none w-32 grayscale md:w-32"
                />
              </div>
              <div className="cursor-not-allowed opacity-50">
                <Image
                  src="/app-store-badge.png"
                  // alt={t ('appStoreAlt')}
                  alt="App store badge"
                  width={128}
                  height={40}
                  className="pointer-events-none w-32 grayscale md:w-32"
                />
              </div>
            </div>
          </div>

          {/* DESKTOP LAYOUT */}
          <div className="hidden items-center md:flex">
            <div className="mr-6 h-[135px] w-32 flex-shrink-0 overflow-hidden">
              <div className="relative flex h-56 w-full items-start justify-center rounded-2xl border-4 border-gray-900 bg-white p-2 pt-4 shadow-lg">
                <div className="absolute top-2 h-2 w-8 rounded-full bg-gray-800"></div>
                <div className="mt-6 flex h-auto w-full items-center justify-center rounded-lg bg-white p-1">
                  <Image
                    src="/qr-code.png"
                    alt={t('appCard.qrAlt')}
                    width={112}
                    height={112}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <Image
                  src="/app-icon.png"
                  alt={t('appCard.appIconAlt')}
                  className="mr-3 h-10 w-10"
                  width={40}
                  height={40}
                />
                <h3 className="text-lg font-bold">{t('appCard.mobileTitle')}</h3>
              </div>
              <p className="mt-2 text-sm">{t('appCard.mobileDescription')}</p>
              <div className="mt-8 flex justify-center space-x-4 md:justify-start">
                <div className="cursor-not-allowed opacity-50">
                  <Image
                    src="/google-play-badge.svg"
                    alt="Google play badge"
                    width={128}
                    height={40}
                    className="pointer-events-none w-32 grayscale md:w-32"
                  />
                </div>
                <div className="cursor-not-allowed opacity-50">
                  <Image
                    src="/app-store-badge.png"
                    alt="App store badge"
                    width={128}
                    height={40}
                    className="pointer-events-none w-32 grayscale md:w-32"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
