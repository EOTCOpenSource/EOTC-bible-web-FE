'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { PlanTemplate } from '@/lib/planTemplates'
import { PlanTemplateListItem } from './PlanTemplateListItem'

type Props = {
  id: string
  title: string
  plans: PlanTemplate[]
}

export function PlanSection({ id, title, plans }: Props) {
  const t = useTranslations('PlansExplore')
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-heading text-[#1A1A19] dark:text-neutral-100">{title}</h2>
        <Link href="#explore" className="text-xs text-[#1A1A19DB] dark:text-neutral-400 hover:underline">
          {t('viewAllPlans')}
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((p) => (
          <PlanTemplateListItem key={`${id}-${p.slug}`} plan={p} />
        ))}
      </div>
    </section>
  )
}

