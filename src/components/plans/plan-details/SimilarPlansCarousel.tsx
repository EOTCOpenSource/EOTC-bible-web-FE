'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import type { PlanTemplate } from '@/lib/planTemplates'

import { useTranslations } from 'next-intl'

type Props = {
  plans: PlanTemplate[]
}

export function SimilarPlansCarousel({ plans }: Props) {
  const t = useTranslations('PlansExplore')
  return (
    <div className="flex w-full items-center gap-4 overflow-x-auto no-scrollbar px-1">
      {plans.map((plan) => (
        <Card
          key={plan.slug}
          className="inline-flex items-center gap-2.5 p-3.5 flex-shrink-0 bg-[#f8f6f0d9] dark:bg-neutral-800/85 rounded-xl border-0 shadow-none"
        >
          <CardContent className="p-0 inline-flex flex-col items-start gap-4">
            <Image
              className="relative rounded-lg object-cover"
              alt={plan.title}
              src={plan.image}
              width={244}
              height={244}
            />

            <div className="flex flex-col w-[151px] items-start gap-3">
              <span className="w-fit mt-[-1.00px] font-semibold text-[#1a1918] dark:text-neutral-100 text-xl tracking-[-0.60px] leading-4 whitespace-nowrap">
                {plan.title}
              </span>

              <Link href={`/plans/${plan.slug}`} className="inline-flex items-center gap-0.5">
                <span className="flex items-center w-fit mt-[-1.00px] font-normal text-[#1a1a19db] dark:text-neutral-400 text-sm whitespace-nowrap hover:underline">
                  {t('planDetails')}
                </span>
                <Image alt="" src="/figmaAssets/down-arrow-3-.svg" width={4} height={8} />
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

