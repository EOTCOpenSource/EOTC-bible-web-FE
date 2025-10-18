'use client'

import { Input } from '../ui/input'
import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

const Subscription = () => {
  const t = useTranslations('Subscription')

  return (
    <div className="flex justify-center bg-white pt-10 md:py-20">
      <div className="flex h-auto w-full flex-col justify-center gap-8 rounded-lg bg-[#FFFBF5] px-6 py-8 md:h-[123px] md:w-[1344px] md:flex-row md:justify-center md:gap-20 md:px-12 md:py-0">
        <h3 className="text-left text-2xl font-bold md:text-left">
          {t('title').split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              <br className="hidden md:block" />
            </span>
          ))}
        </h3>
        <div>
          <p className="pb-2 text-left md:text-left">{t('subtitle')}</p>

          <form className="flex items-center gap-2 md:flex-row">
            <Input
              type="email"
              placeholder={t('placeholder')}
              className="h-10 w-full rounded-md border-gray-300 bg-gray-100 sm:w-80"
            />
            <button className="flex items-center justify-center space-x-2 rounded-md bg-red-900 py-2 pr-2 pl-6 text-white sm:w-auto">
              <span>{t('button')}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white p-1 text-red-900">
                <ArrowUpRight size={20} />
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Subscription