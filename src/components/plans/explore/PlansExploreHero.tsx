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
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <div className="min-w-0">
            <h1 className="font-heading text-5xl leading-[0.95] tracking-tight text-[#1A1A19] md:text-6xl dark:text-neutral-100">
              {t.rich('heroTitle', {
                br: () => <br />,
              })}
            </h1>
            <p className="mt-4 max-w-md text-sm text-[#1A1A19DB] md:text-base dark:text-neutral-400">
              {t('heroDescription')}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={onExploreClick}
                className="h-[38px] rounded-md bg-[#4C0E0F] px-3 text-white hover:bg-[#3b0b0c]"
              >
                {t('exploreButton')}
                <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded bg-white text-[#4C0E0F]">
                  <ArrowUpRight size={16} />
                </span>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-[38px] rounded-md border-[#4C0E0F]/30 bg-white/70 px-3 hover:bg-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
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
            <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white dark:border-neutral-700 dark:bg-neutral-800">
              <Image
                src="/plans-hero.png"
                alt={t('heroDescription')}
                width={820}
                height={460}
                className="h-[280px] w-full object-cover md:h-[340px]"
                priority
              />

              <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-xl border border-white/10 bg-[#1A1A19]/80 p-3 pr-4 text-white">
                <Image
                  src="/qr-code.png"
                  alt="QR code"
                  width={54}
                  height={54}
                  className="rounded-md"
                />
                <div className="min-w-0">
                  <div className="text-sm leading-tight font-semibold">{t('getAppTitle')}</div>
                  <div className="mt-0.5 text-xs leading-tight text-white/80">
                    {t('getAppDescription')}
                  </div>
                  <Link
                    href="/#download"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-white hover:underline"
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
