'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlansExploreHero } from '@/components/plans/explore/PlansExploreHero'
import { PlanCategoryCarousel } from '@/components/plans/explore/PlanCategoryCarousel'
import { PlanSection } from '@/components/plans/explore/PlanSection'
import { PlanTemplateListItem } from '@/components/plans/explore/PlanTemplateListItem'
import { PLAN_TEMPLATES } from '@/lib/planTemplates'
import { usePlanTemplateBookmarks } from '@/hooks/usePlanTemplateBookmarks'
import { useUserStore } from '@/lib/stores/useUserStore'
import { usePlanStore } from '@/stores/usePlanStore'
import PlanItem from '@/components/dashboard/plans/PlanItem'
import { ArrowUpRight } from 'lucide-react'

type TabKey = 'my-plans' | 'explore' | 'saved' | 'completed'

const TAB_LABELS: Record<TabKey, string> = {
  'my-plans': 'My Plans',
  explore: 'Explore',
  saved: 'Saved',
  completed: 'Completed',
}

export function PlansExploreClient() {
  const [tab, setTab] = useState<TabKey>('explore')

  const { user, isLoggedIn, loadSession } = useUserStore()
  const { plans, fetchPlans, isFetching, error } = usePlanStore()
  const bookmarks = usePlanTemplateBookmarks(user?.id)

  const isCompletedPlan = (p: any) => {
    if (p?.status === 'completed') return true
    const readings = p?.dailyReadings
    return Array.isArray(readings) && readings.length > 0 && readings.every((r) => r?.isCompleted)
  }

  useEffect(() => {
    // Navbar usually loads the session, but this ensures this page is self-sufficient.
    loadSession()
  }, [loadSession])

  useEffect(() => {
    // Only fetch when user is logged in and user is viewing plan-related tabs.
    if (!isLoggedIn) return
    if (tab === 'my-plans' || tab === 'completed' || tab === 'saved') {
      fetchPlans()
    }
  }, [isLoggedIn, tab, fetchPlans])

  const featured = useMemo(() => PLAN_TEMPLATES.filter((p) => p.tags?.includes('Featured')), [])
  const wholeBible = useMemo(() => PLAN_TEMPLATES.filter((p) => p.tags?.includes('Whole Bible')), [])
  const encouragement = useMemo(() => PLAN_TEMPLATES.filter((p) => p.tags?.includes('Encouragement')), [])
  const wisdom = useMemo(() => PLAN_TEMPLATES.filter((p) => p.tags?.includes('Wisdom')), [])

  const uniqueBySlug = (items: typeof PLAN_TEMPLATES) =>
    Array.from(new Map(items.map((p) => [p.slug, p])).values())

  const featuredGrid = useMemo(() => {
    const list = featured.length ? featured : PLAN_TEMPLATES
    return uniqueBySlug([...list, ...PLAN_TEMPLATES]).slice(0, 6)
  }, [featured])
  const wholeBibleGrid = useMemo(() => {
    const list = wholeBible.length ? wholeBible : PLAN_TEMPLATES
    return uniqueBySlug([...list, ...PLAN_TEMPLATES]).slice(0, 6)
  }, [wholeBible])
  const encouragementGrid = useMemo(() => {
    const list = encouragement.length ? encouragement : PLAN_TEMPLATES
    return uniqueBySlug([...list, ...PLAN_TEMPLATES]).slice(0, 6)
  }, [encouragement])
  const wisdomGrid = useMemo(() => {
    const list = wisdom.length ? wisdom : PLAN_TEMPLATES
    return uniqueBySlug([...list, ...PLAN_TEMPLATES]).slice(0, 6)
  }, [wisdom])

  const savedTemplates = useMemo(() => {
    const set = new Set(bookmarks.slugs)
    return PLAN_TEMPLATES.filter((t) => set.has(t.slug))
  }, [bookmarks.slugs])

  const completedPlans = useMemo(() => plans.filter(isCompletedPlan), [plans])
  const activePlans = useMemo(() => plans.filter((p) => !isCompletedPlan(p)), [plans])

  const scrollToExplore = () => {
    setTab('explore')
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="w-full bg-[#FBF8F2] dark:bg-neutral-900">
      <PlansExploreHero onExploreClick={scrollToExplore} />


      <div className="mx-auto w-full max-w-6xl px-4 -mt-10">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-xl bg-white/70 dark:bg-neutral-800/70 border border-black/10 dark:border-neutral-700 px-2 py-2">
            {(Object.keys(TAB_LABELS) as TabKey[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs border transition-colors',
                  tab === k
                    ? 'bg-[#392D2D] text-white border-[#392D2D]'
                    : 'bg-white/70 dark:bg-neutral-700/70 text-[#1A1A19] dark:text-neutral-100 border-black/10 dark:border-neutral-600 hover:bg-white dark:hover:bg-neutral-600',
                ].join(' ')}
              >
                {TAB_LABELS[k]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div id="explore" className="mx-auto w-full max-w-6xl px-4 py-10 space-y-12">
        {tab === 'my-plans' && (
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-heading text-[#1A1A19] dark:text-neutral-100">My Plans</h2>
                <p className="text-sm text-[#1A1A19DB] dark:text-neutral-400 mt-1">Your active reading plans.</p>
              </div>
              <Button asChild className="bg-[#4C0E0F] hover:bg-[#3b0b0c] text-white">
                <Link href="/dashboard/plans">Open Dashboard</Link>
              </Button>
            </div>

            {!isLoggedIn ? (
              <div className="mt-6 text-[#1A1A19DB] dark:text-neutral-400">Please sign in to see your plans.</div>
            ) : isFetching ? (
              <div className="mt-6 text-[#1A1A19DB] dark:text-neutral-400">Loading…</div>
            ) : error ? (
              <div className="mt-6 text-[#1A1A19DB] dark:text-neutral-400">{error}</div>
            ) : activePlans.length === 0 ? (
              <div className="mt-6 text-[#1A1A19DB] dark:text-neutral-400">No active plans yet.</div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4">
                {activePlans.map((p) => (
                  <PlanItem key={p._id} plan={p} />
                ))}
              </div>
            )}
          </section>
        )}

        {tab === 'completed' && (
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-heading text-[#1A1A19] dark:text-neutral-100">Completed</h2>
                <p className="text-sm text-[#1A1A19DB] dark:text-neutral-400 mt-1">Plans you’ve finished.</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/dashboard/plans">Open Dashboard</Link>
              </Button>
            </div>

            {!isLoggedIn ? (
              <div className="mt-6 text-[#1A1A19DB] dark:text-neutral-400">Please sign in to see completed plans.</div>
            ) : isFetching ? (
              <div className="mt-6 text-[#1A1A19DB] dark:text-neutral-400">Loading…</div>
            ) : error ? (
              <div className="mt-6 text-[#1A1A19DB] dark:text-neutral-400">{error}</div>
            ) : completedPlans.length === 0 ? (
              <div className="mt-6 text-[#1A1A19DB] dark:text-neutral-400">No completed plans yet.</div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4">
                {completedPlans.map((p) => (
                  <PlanItem key={p._id} plan={p} />
                ))}
              </div>
            )}
          </section>
        )}

        {tab === 'saved' && (
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-heading text-[#1A1A19] dark:text-neutral-100">Saved</h2>
                <p className="text-sm text-[#1A1A19DB] dark:text-neutral-400 mt-1">Plans you’ve bookmarked.</p>
              </div>
              <Button variant="outline" onClick={scrollToExplore}>
                Browse
              </Button>
            </div>

            {savedTemplates.length === 0 ? (
              <div className="mt-6 text-[#1A1A19DB] dark:text-neutral-400">
                No saved plans yet. Open a plan and tap “Save”.
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedTemplates.slice(0, 6).map((p) => (
                  <PlanTemplateListItem key={p.slug} plan={p} />
                ))}
              </div>
            )}
          </section>
        )}

        {tab === 'explore' && (
          <>
            {/* Explore Different Plans row */}
            <section className="w-full bg-white/60 dark:bg-neutral-800/60 rounded-2xl border border-black/10 dark:border-neutral-700 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4">
                  <h2 className="text-xl font-heading text-[#1A1A19] dark:text-neutral-100">Explore Different Plans</h2>
                  <p className="mt-2 text-sm text-[#1A1A19DB] dark:text-neutral-400">
                    Discover curated plans to enrich your Bible study and spiritual journey.
                  </p>
                  <Button
                    asChild
                    className="mt-4 bg-white dark:bg-neutral-700 text-[#1A1A19] dark:text-neutral-100 border border-black/10 dark:border-neutral-600 hover:bg-white dark:hover:bg-neutral-600 h-[38px] px-3 rounded-md"
                  >
                    <Link href="/#download" className="inline-flex items-center gap-2">
                      Get EOTCBible App
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#4C0E0F] text-white">
                        <ArrowUpRight size={16} />
                      </span>
                    </Link>
                  </Button>
                </div>

                <div className="lg:col-span-8">
                  <PlanCategoryCarousel />
                </div>
              </div>
            </section>

            <PlanSection id="featured" title="Featured Plans" plans={featuredGrid} />
            <PlanSection id="whole-bible" title="Whole Bible" plans={wholeBibleGrid} />
            <PlanSection id="encouragement" title="Encouragement" plans={encouragementGrid} />
            <PlanSection id="wisdom" title="Wisdom" plans={wisdomGrid} />
          </>
        )}
      </div>
    </div>
  )
}
