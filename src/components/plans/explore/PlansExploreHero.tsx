'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'

import { useTranslations } from 'next-intl'

type Props = {
  onExploreClick: () => void
}

export function PlansExploreHero({ onExploreClick }: Props) {
  const t = useTranslations('PlansExplore')
  
  return (
    <section className="w-full bg-[#FFFCDB] dark:bg-neutral-900">
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="min-w-0">
            <h1 className="text-[#1A1A19] dark:text-neutral-100 font-heading tracking-tight leading-[0.95] text-5xl md:text-6xl">
              {t.rich('heroTitle', {
                br: () => <br />
              })}
            </h1>
            <p className="mt-4 text-sm md:text-base text-[#1A1A19DB] dark:text-neutral-400 max-w-md">
              {t('heroDescription')}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={onExploreClick}
                className="bg-[#4C0E0F] hover:bg-[#3b0b0c] text-white h-[38px] px-3 rounded-md"
              >
                {t('exploreButton')}
                <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded bg-white text-[#4C0E0F]">
                  <ArrowUpRight size={16} />
                </span>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-[38px] px-3 rounded-md border-[#4C0E0F]/30 dark:border-neutral-600 bg-white/70 dark:bg-neutral-800 hover:bg-white dark:hover:bg-neutral-700 dark:text-neutral-100"
              >
                <Link href="/dashboard/plans?create=1">
                  {t('createButton')}
                  <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded bg-[#4C0E0F] text-white">
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative w-full">
            <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-neutral-700 bg-white dark:bg-neutral-800">
              <Image
                src="/plans-hero.png"
                alt={t('heroDescription')}
                width={820}
                height={460}
                className="w-full h-[280px] md:h-[340px] object-cover"
                priority
              />

              <div className="absolute left-4 bottom-4 flex items-center gap-3 rounded-xl bg-[#1A1A19]/80 p-3 pr-4 text-white border border-white/10">
                <Image src="/qr-code.png" alt="QR code" width={54} height={54} className="rounded-md" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-tight">{t('getAppTitle')}</div>
                  <div className="text-xs text-white/80 leading-tight mt-0.5">
                    {t('getAppDescription')}
                  </div>
                  <Link
                    href="/#download"
                    className="inline-flex items-center gap-1 text-xs mt-2 text-white hover:underline"
                  >
                    {t('getAppCta')} <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs placeholder row (actual tabs live below, this matches spacing) */}
        <div className="mt-10" />
      </div>
    </section>
  )
}
