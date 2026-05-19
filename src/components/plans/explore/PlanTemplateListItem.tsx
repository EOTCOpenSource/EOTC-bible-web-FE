'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import type { PlanTemplate } from '@/lib/planTemplates'
import { useTranslations } from 'next-intl'

type Props = {
  plan: PlanTemplate
}

export function PlanTemplateListItem({ plan }: Props) {
  const t = useTranslations('PlansExplore')
  return (
    <Card className="w-full rounded-xl border-0 bg-[#f8f6f0d9] shadow-none dark:bg-neutral-800/85">
      <CardContent className="flex items-center gap-3.5 p-3.5">
        <Image
          className="shrink-0 rounded-lg object-cover"
          alt={plan.title}
          src={plan.image}
          width={98}
          height={98}
        />

        <div className="min-w-0 flex-1">
          <div className="truncate text-xl font-semibold tracking-[-0.60px] text-[#1a1918] dark:text-neutral-100">
            {plan.title}
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-[#1a1a19db] dark:text-neutral-400">
            {plan.description}
          </p>

          <Link href={`/plans/${plan.slug}`} className="mt-3 inline-flex items-center gap-0.5">
            <span className="text-sm text-[#1a1a19db] hover:underline dark:text-neutral-400">
              {t('planDetails')}
            </span>
            <Image alt="" src="/figmaAssets/down-arrow-3-.svg" width={4} height={8} />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
