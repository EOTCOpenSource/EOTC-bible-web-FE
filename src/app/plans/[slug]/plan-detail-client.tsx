'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Bookmark, Share2, Calendar, Eye, Heart, Users, Medal } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import Subscription from '@/components/landing/Subscription'
import { HorizontalScrollCarousel } from '@/components/ui/horizontal-scroll-carousel'
import { plansData } from './plan-data'

interface Plan {
  id: string
  title: string
  description: string
  image: string
  slug?: string
}

interface PlanDetailClientProps {
  slug: string
}

export default function PlanDetailClient({ slug }: PlanDetailClientProps) {
  const t = useTranslations('PlanDetail')
  const tPlans = useTranslations('DiscoverPlans')

  const plan = plansData[slug]
  const fallbackPlans: Plan[] = tPlans.raw('fallbackPlans') as Plan[]
  const similarPlans = fallbackPlans.filter(p => p.slug !== slug)

  if (!plan) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-20">
          <h1 className="text-2xl font-bold text-gray-900">{t('notFound.title')}</h1>
          <p className="mt-2 text-gray-600">{t('notFound.description')}</p>
          <Link
            href="/"
            className="mt-6 rounded-lg bg-red-900 px-6 py-2 text-white hover:bg-red-800"
          >
            {t('notFound.goBack')}
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 mt-24">

        <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
          {/* Main Card */}
          <div className="overflow-hidden rounded-[32px] bg-[#FDFBF7] shadow-sm border border-[#EAE0D5]">
            <div className="flex flex-col lg:flex-row">
              {/* Left Column - Image */}
              <div className="relative h-[400px] w-full lg:h-auto lg:w-[45%] flex-shrink-0">
                <Image
                  src={plan.image}
                  alt={plan.title}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Overlay text on image */}
                <div className="absolute bottom-8 left-8 text-white z-10">
                  {/* In the design there is text on image, we can keep it clean or add if needed based on specific plan data */}
                  {/* For this specific design, the text is part of the image art, so we leave it clean */}
                </div>
              </div>

              {/* Right Column - Content */}
              <div className="flex flex-1 flex-col p-8 lg:p-12 relative">

                {/* Header Section */}
                <div>
                  <h1 className="text-[40px] leading-tight font-bold text-[#1A1A1A] font-serif tracking-tight">
                    {plan.title.split(' ').map((word, i) => (
                      <span key={i} className={i === 1 ? "ml-2" : ""}>{word}</span>
                    ))}
                  </h1>

                  <div className="flex items-center gap-3 mt-3 mb-4">
                    <div className="h-1 w-12 bg-[#8B2525] rounded-full"></div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Day 62 of 90</span>
                    <span className="bg-[#EDEAE6] text-[#5A5A5A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded">Featured</span>
                    <span className="bg-[#EDEAE6] text-[#5A5A5A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded">Wisdom</span>
                  </div>

                  <p className="mt-4 text-[15px] leading-relaxed text-[#4A4A4A] max-w-lg">
                    {plan.description}
                  </p>
                </div>

                {/* Actions Row */}
                <div className="mt-8 flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E0D8] bg-white hover:bg-gray-50 transition-colors text-[#4A4A4A] text-sm font-medium">
                    <Bookmark size={18} />
                    <span>Save</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5E0D8] bg-white hover:bg-gray-50 transition-colors text-[#4A4A4A] text-sm font-medium">
                    <Share2 size={18} />
                    <span>Share</span>
                  </button>

                  <div className="flex items-center ml-2">
                    <div className="flex -space-x-2">
                      {plan.participants.slice(0, 3).map((participant) => (
                        <Avatar key={participant.id} className="h-8 w-8 border-2 border-white">
                          <AvatarFallback className="bg-[#8B2525] text-white text-[10px]">
                            {participant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <div className="ml-2 flex items-center justify-center h-8 w-8 rounded-full bg-[#8B2525] text-white text-xs font-medium border-2 border-white -ml-2 z-10">
                      +5
                    </div>
                  </div>
                </div>

                {/* Bottom Stats & CTA */}
                <div className="mt-12 pt-8 border-t border-[#EAE0D5] flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center gap-1">
                      <Calendar size={20} className="text-[#4A4A4A]" />
                      <span className="text-sm font-bold text-[#1A1A1A]">{plan.duration}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Users size={20} className="text-[#4A4A4A]" />
                      <span className="text-sm font-bold text-[#1A1A1A]">{plan.views}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Medal size={20} className="text-[#4A4A4A]" />
                      <span className="text-sm font-bold text-[#1A1A1A]">{plan.likes}</span>
                    </div>
                  </div>

                  <Link
                    href={`/plans/${slug}/reading`}
                    className="flex items-center gap-2 rounded bg-[#3E3E3E] pl-6 pr-2 py-2 text-white hover:bg-black transition-colors"
                  >
                    <span className="font-medium text-sm">{t('continuePlan')}</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10">
                      <ArrowUpRight size={16} className="text-white" />
                    </div>
                  </Link>
                </div>

              </div>
            </div>
          </div>

          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 lg:text-2xl">
                {t('similarPlans')}
              </h2>
            </div>

            <HorizontalScrollCarousel>
              {similarPlans.map((similarPlan) => (
                <Link
                  key={similarPlan.id}
                  href={`/plans/${similarPlan.slug}`}
                  className="group flex-shrink-0"
                >
                  <div className="relative h-64 w-64 overflow-hidden rounded-2xl bg-gray-100">
                    <Image
                      src={similarPlan.image}
                      alt={similarPlan.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900">{similarPlan.title}</p>
                    <span className="text-xs text-red-900 hover:underline">
                      {t('planDetails')} &gt;
                    </span>
                  </div>
                </Link>
              ))}
            </HorizontalScrollCarousel>
          </section>
        </div>
      </main>

      <Footer />
      <Subscription />
    </div>
  )
}