'use client'

import React, { useMemo } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useUIStore } from '@/stores/uiStore'

interface Plan {
  id: string
  title: string
  description: string
  image: string
  slug?: string
}

interface PlanCardProps {
  plan: Plan
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => (
  <div className="flex overflow-hidden rounded-lg bg-white shadow-md">
    <div className="relative w-1/3">
      <Image
        src={plan.image}
        alt={plan.title}
        width={180}
        height={208}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="flex w-2/3 flex-col justify-between p-4">
      <div>
        <h3 className="text-lg font-bold">{plan.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
      </div>
      <div>
        <a
          href={plan.slug ? `/plans/${plan.slug}` : '#'}
          className="font-semibold text-amber-900 hover:underline"
        >
          Plan Details
        </a>
      </div>
    </div>
  </div>
)

interface DiscoverPlansProps {
  plans?: Plan[]
  isLoading?: boolean
  error?: string | null
}

const DiscoverPlans: React.FC<DiscoverPlansProps> = ({
  plans: externalPlans,
  isLoading = false,
  error = null,
}) => {
  const currentPlanPage = useUIStore((state) => state.currentPlanPage)
  const nextPlanPage = useUIStore((state) => state.nextPlanPage)
  const prevPlanPage = useUIStore((state) => state.prevPlanPage)
  const setCurrentPlanPage = useUIStore((state) => state.setCurrentPlanPage)

  // Fallback data for development/demo purposes
  const fallbackPlans: Plan[] = [
    {
      id: '1',
      title: 'Psalms in 30 days',
      description: 'Join our 30-day Psalms meditation. Reflect on hope and faith.',
      image: '/plans/plan1.png',
      slug: 'psalms-30-days',
    },
    {
      id: '2',
      title: 'The Body of Christ',
      description: 'A deep dive into what it means to be part of the community of believers.',
      image: '/plans/plan2.png',
      slug: 'body-of-christ',
    },
    {
      id: '3',
      title: 'Becoming Resilient',
      description: 'A guide to building spiritual strength and overcoming adversity.',
      image: '/plans/plan3.png',
      slug: 'becoming-resilient',
    },
    {
      id: '4',
      title: 'The Good Shepherd',
      description: 'Reflect on the guidance and protection found in the 23rd Psalm.',
      image: '/plans/plan4.png',
      slug: 'good-shepherd',
    },
    {
      id: '5',
      title: 'Moving Forward in Faith',
      description: "A series on trusting God's plan and taking steps into the unknown.",
      image: '/plans/plan5.png',
      slug: 'moving-forward',
    },
    {
      id: '6',
      title: "The Believer's Journey",
      description: 'A 30-day meditation on the path of spiritual growth and discipleship.',
      image: '/plans/plan6.png',
      slug: 'believers-journey',
    },
    {
      id: '2',
      title: 'The Body of Christ',
      description: 'A deep dive into what it means to be part of the community of believers.',
      image: '/plans/plan2.png',
      slug: 'body-of-christ',
    },
    {
      id: '3',
      title: 'Becoming Resilient',
      description: 'A guide to building spiritual strength and overcoming adversity.',
      image: '/plans/plan3.png',
      slug: 'becoming-resilient',
    },
    {
      id: '4',
      title: 'The Good Shepherd',
      description: 'Reflect on the guidance and protection found in the 23rd Psalm.',
      image: '/plans/plan4.png',
      slug: 'good-shepherd',
    },
    {
      id: '5',
      title: 'Moving Forward in Faith',
      description: "A series on trusting God's plan and taking steps into the unknown.",
      image: '/plans/plan5.png',
      slug: 'moving-forward',
    },
    {
      id: '6',
      title: "The Believer's Journey",
      description: 'A 30-day meditation on the path of spiritual growth and discipleship.',
      image: '/plans/plan6.png',
      slug: 'believers-journey',
    },
  ]

  const plans = externalPlans || fallbackPlans

  const PLANS_PER_PAGE_MOBILE = 3
  const PLANS_PER_PAGE_DESKTOP = 6

  const totalPagesMobile = Math.ceil(plans.length / PLANS_PER_PAGE_MOBILE)
  const totalPagesDesktop = Math.ceil(plans.length / PLANS_PER_PAGE_DESKTOP)

  const paginatedPlansMobile = useMemo(() => {
    const start = currentPlanPage * PLANS_PER_PAGE_MOBILE
    const end = start + PLANS_PER_PAGE_MOBILE
    return plans.slice(start, end)
  }, [currentPlanPage, plans])

  const paginatedPlansDesktop = useMemo(() => {
    const start = currentPlanPage * PLANS_PER_PAGE_DESKTOP
    const end = start + PLANS_PER_PAGE_DESKTOP
    return plans.slice(start, end)
  }, [currentPlanPage, plans])

  if (error) {
    return (
      <section className="flex flex-col py-4">
        <div className="py-12 text-center">
          <p className="mb-4 text-red-600">Failed to load plans: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="font-semibold text-amber-900 hover:underline"
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col py-4">
      <h2 className="mb-4 ml-8 text-2xl font-bold md:text-3xl">
        Discover Various Plans For <br /> Reading The EOTC Bible.
      </h2>

      {isLoading ? (
        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : (
        <>
          {/* Desktop view - paginated if more than 6 plans */}
          <div className="hidden sm:block">
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedPlansDesktop.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>

            {/* Desktop pagination controls */}
            {totalPagesDesktop > 1 && (
              <div className="mt-4 mb-6 flex items-center justify-center gap-4">
                <button
                  onClick={prevPlanPage}
                  disabled={currentPlanPage === 0}
                  className={`rounded-lg p-2 ${
                    currentPlanPage === 0
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPagesDesktop }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPlanPage(i)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        currentPlanPage === i ? 'w-6 bg-red-900' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to page ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => nextPlanPage(totalPagesDesktop)}
                  disabled={currentPlanPage === totalPagesDesktop - 1}
                  className={`rounded-lg p-2 ${
                    currentPlanPage === totalPagesDesktop - 1
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile view - paginated */}
          <div className="sm:hidden">
            <div className="grid gap-4 p-4">
              {paginatedPlansMobile.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>

            {/* Mobile pagination controls */}
            {totalPagesMobile > 1 && (
              <div className="mt-4 mb-6 flex items-center justify-center gap-4">
                <button
                  onClick={prevPlanPage}
                  disabled={currentPlanPage === 0}
                  className={`rounded-lg p-2 ${
                    currentPlanPage === 0
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPagesMobile }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPlanPage(i)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        currentPlanPage === i ? 'w-6 bg-red-900' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to page ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => nextPlanPage(totalPagesMobile)}
                  disabled={currentPlanPage === totalPagesMobile - 1}
                  className={`rounded-lg p-2 ${
                    currentPlanPage === totalPagesMobile - 1
                      ? 'cursor-not-allowed text-gray-300'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <div className="mt-12 text-center">
        <p className="text-lg">Discover a Plan for Your Spiritual Journey.</p>
        <p className="mb-4 text-gray-600">
          Explore our library of plans to find one that helps you connect with scripture.
        </p>
        <button className="mx-auto flex h-[42px] w-fit items-center space-x-2 rounded-lg bg-red-900 py-2 pr-2 pl-6 text-white transition-colors hover:bg-red-800 md:w-fit">
          <span>Discover More Plans</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-white p-1 text-red-900">
            <ArrowUpRight size={20} />
          </div>
        </button>
      </div>
    </section>
  )
}

export default DiscoverPlans
