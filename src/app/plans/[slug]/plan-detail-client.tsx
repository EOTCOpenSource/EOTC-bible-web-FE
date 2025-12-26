'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Bookmark, Share2, ChevronLeft, ChevronRight, Calendar, Eye, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import Subscription from '@/components/landing/Subscription'
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll'
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
  const { containerRef: scrollContainerRef, scrollLeft, scrollRight } = useHorizontalScroll(300)
  
  const plan = plansData[slug]
  const fallbackPlans: Plan[] = tPlans.raw('fallbackPlans') as Plan[]
  const similarPlans = fallbackPlans.filter(p => p.slug !== slug)

  if (!plan) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar className = "mb-2"/>
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
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="flex flex-col lg:flex-row">
              <div className="relative h-64 w-full lg:h-auto lg:w-[400px] flex-shrink-0">
                <Image
                  src={plan.image}
                  alt={plan.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
              
              <div className="flex flex-1 flex-col p-6 lg:p-8">
                <div className="flex items-center gap-2 text-sm text-red-900">
                  <span className="font-medium">—</span>
                  {plan.categories.map((category, index) => (
                    <span key={index} className="flex items-center">
                      <span>{category}</span>
                      {index < plan.categories.length - 1 && <span className="mx-2">|</span>}
                    </span>
                  ))}
                </div>
                
                <h1 className="mt-3 text-2xl font-bold text-gray-900 lg:text-3xl">
                  {plan.title}
                </h1>
                
                <p className="mt-4 leading-relaxed text-gray-600">
                  {plan.description}
                </p>
                
                <div className="mt-6 flex items-center gap-6">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                    <Bookmark size={18} />
                    <span className="text-sm font-medium">Save</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                    <Share2 size={18} />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                  
                  <div className="flex -space-x-2 ml-4">
                    {plan.participants.map((participant) => (
                      <Avatar key={participant.id} className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="bg-red-100 text-red-900 text-xs">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex items-center border-t border-b border-gray-200 py-4">
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Calendar size={16} />
                        <span className="font-semibold">{plan.duration}</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5">Duration</span>
                    </div>
                    <div className="h-8 w-px bg-gray-200" />
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Eye size={16} />
                        <span className="font-semibold">{plan.views}</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5">Views</span>
                    </div>
                    <div className="h-8 w-px bg-gray-200" />
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Heart size={16} />
                        <span className="font-semibold">{plan.likes}</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5">Likes</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Link
                    href={`/plans/${slug}/reading`}
                    className="flex items-center gap-2 rounded-lg bg-red-900 px-6 py-2.5 text-white hover:bg-red-800 transition-colors"
                  >
                    <span className="font-medium">{t('continuePlan')}</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-white">
                      <ArrowUpRight size={14} className="text-red-900" />
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
              <div className="flex items-center gap-2">
                <button 
                  onClick={scrollLeft}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={scrollRight}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide pr-32"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {similarPlans.map((similarPlan) => (
                <Link
                  key={similarPlan.id}
                  href={`/plans/${similarPlan.slug}`}
                  className="group flex-shrink-0"
                >
                  <div className="relative h-56 w-64 overflow-hidden rounded-lg">
                    <Image
                      src={similarPlan.image}
                      alt={similarPlan.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
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
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
      <Subscription />
    </div>
  )
}