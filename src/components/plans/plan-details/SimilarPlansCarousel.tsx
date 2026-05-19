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
    <div className="no-scrollbar flex w-full items-center gap-4 overflow-x-auto px-1">
      {plans.map((plan) => (
        <Card
          key={plan.slug}
          className="inline-flex flex-shrink-0 items-center gap-2.5 rounded-xl border-0 bg-[#f8f6f0d9] p-3.5 shadow-none dark:bg-neutral-800/85"
        >
          <CardContent className="inline-flex flex-col items-start gap-4 p-0">
            <Image
              className="relative rounded-lg object-cover"
              alt={plan.title}
              src={plan.image}
              width={244}
              height={244}
            />

            <div className="flex w-[151px] flex-col items-start gap-3">
              <span className="mt-[-1.00px] w-fit text-xl leading-4 font-semibold tracking-[-0.60px] whitespace-nowrap text-[#1a1918] dark:text-neutral-100">
                {plan.title}
              </span>

              <Link href={`/plans/${plan.slug}`} className="inline-flex items-center gap-0.5">
                <span className="mt-[-1.00px] flex w-fit items-center text-sm font-normal whitespace-nowrap text-[#1a1a19db] hover:underline dark:text-neutral-400">
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
