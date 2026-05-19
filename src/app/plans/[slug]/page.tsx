import { PLAN_TEMPLATES, getPlanTemplateBySlug } from '@/lib/planTemplates'
import { FeaturedPlanCard } from '@/components/plans/plan-details/FeaturedPlanCard'
import { SimilarPlansCarousel } from '@/components/plans/plan-details/SimilarPlansCarousel'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import Image from 'next/image'

export default async function PlanDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const template = getPlanTemplateBySlug(slug)

  if (!template) {
    return (
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold">Plan not found</h1>
        <p className="text-muted-foreground mt-2">This plan does not exist.</p>
      </main>
    )
  }

  const usePlanHref = `/dashboard/plans?template=${encodeURIComponent(template.slug)}`
  const similar = PLAN_TEMPLATES.filter((p) => p.slug !== template.slug).slice(0, 5)

  return (
    <main className="bg-background w-full">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-4 pt-24">
        <div className="mt-6">
          <FeaturedPlanCard plan={template} usePlanHref={usePlanHref} />
        </div>

        <div className="mt-6 flex w-full items-end justify-between px-0 py-4 md:px-12">
          <div className="relative w-fit text-3xl leading-6 font-semibold tracking-[-0.90px] whitespace-nowrap text-[#1a1918] dark:text-neutral-100">
            Similar Plans
          </div>
          <Image
            alt=""
            src="/figmaAssets/frame-118.svg"
            width={80}
            height={40}
            className="dark:invert"
          />
        </div>

        <div className="relative w-full">
          <SimilarPlansCarousel plans={similar} />
          <div className="pointer-events-none absolute top-0 right-0 h-full w-[145px] bg-[linear-gradient(270deg,rgba(255,253,248,1)_0%,rgba(255,253,248,0)_100%)] dark:bg-[linear-gradient(270deg,rgba(26,26,25,1)_0%,rgba(26,26,25,0)_100%)]" />
        </div>
      </div>
      <Footer />
    </main>
  )
}
