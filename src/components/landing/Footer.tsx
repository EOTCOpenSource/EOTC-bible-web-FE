'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Subscription from './Subscription'
import { useTranslations } from 'next-intl'
import { useLocalizedNumber } from '@/hooks/use-localized-number'

const Footer = () => {
  const t = useTranslations('Footer')
  const { formatNumber } = useLocalizedNumber()
  return (
    <div>
      <Subscription />
      <footer className="m-4 rounded-xl bg-[#1a1a19] py-5 text-white">
        <div className="max-w-8xl container mx-auto px-4">
          <div className="flex flex-wrap justify-between gap-10">
            <div className="flex max-w-sm flex-col gap-4">
              <div className="flex items-center gap-2">
                <Image src="/footer-logo.png" alt="EOTC Bible" width={32.4} height={39} />
                <span className="text-lg font-bold">{t('siteName')}</span>
              </div>
              <p className="text-gray-400">{t('description')}</p>
              <div className="mt-4 flex gap-4">
                <Link href="#">
                  <Image src="/google-play-badge.svg" alt="Google Play" width={135} height={40} />
                </Link>
                <Link href="#">
                  <Image src="/app-store-badge.png" alt="App Store" width={135} height={40} />
                </Link>
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold">{t('menu')}</h3>
                <ul className="flex gap-4">
                  <li>
                    <Link href="/" className="text-gray-400 hover:text-white">
                      {t('home')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/read-online" className="text-gray-400 hover:text-white">
                      {t('bible')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/#about" className="text-gray-400 hover:text-white">
                      {t('about')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/#features" className="text-gray-400 hover:text-white">
                      {t('features')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/#plans" className="text-gray-400 hover:text-white">
                      {t('plans')}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold"> {t('socials')}</h3>
                <ul className="flex gap-4">
                  <li>
                    <a
                      href="https://t.me/EOTCOpenSource"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {t('telegram')}
                    </a>
                  </li>
                  <li>
                    <span className="text-gray-600 cursor-default" title="Coming soon!">
                      {t('instagram')}
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-600 cursor-default" title="Coming soon!">
                      {t('tiktok')}
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-600 cursor-default" title="Coming soon!">
                      {t('facebook')}
                    </span>
                  </li>
                </ul>
                <p className="text-xs text-gray-500 italic">More social channels coming soon!</p>
              </div>
            </div>

            <div className="flex flex-col md:gap-4">
              <h3 className="text-lg font-bold">Contact Info</h3>
              <p className="text-gray-400">+251 91 225 2354</p>
              <a href="mailto:eotcopensource@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                eotcopensource@gmail.com
              </a>
              <p className="text-gray-400">Addis Ababa, Ethiopia</p>
              <a
                href="mailto:eotcopensource@gmail.com"
                className="mt-2 mb-8 flex w-fit items-center space-x-2 rounded-lg bg-white py-2 pr-2 pl-6 text-lg text-[#4C0E0F] md:mt-8 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span>{t('contactUs')}</span>
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#4C0E0F] p-1 text-white"
                >
                  <ArrowUpRight size={20} />
                </div>
              </a>
            </div>
          </div>
          <p className="text-center text-gray-400">
            {' '}
            {t('copyright', { year: formatNumber(2026) })}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Footer
