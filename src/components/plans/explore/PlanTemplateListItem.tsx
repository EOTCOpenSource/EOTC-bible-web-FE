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
    <Card className="w-full bg-[#f8f6f0d9] dark:bg-neutral-800/85 rounded-xl border-0 shadow-none">
      <CardContent className="p-3.5 flex items-center gap-3.5">
        <Image
          className="rounded-lg object-cover shrink-0"
          alt={plan.title}
          src={plan.image}
          width={98}
          height={98}
        />

        <div className="min-w-0 flex-1">
          <div className="font-semibold text-[#1a1918] dark:text-neutral-100 text-xl tracking-[-0.60px] truncate">
            {plan.title}
          </div>
          <p className="mt-2 text-sm text-[#1a1a19db] dark:text-neutral-400 line-clamp-2">{plan.description}</p>

          <Link href={`/plans/${plan.slug}`} className="inline-flex items-center gap-0.5 mt-3">
            <span className="text-sm text-[#1a1a19db] dark:text-neutral-400 hover:underline">{t('planDetails')}</span>
            <Image alt="" src="/figmaAssets/down-arrow-3-.svg" width={4} height={8} />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

