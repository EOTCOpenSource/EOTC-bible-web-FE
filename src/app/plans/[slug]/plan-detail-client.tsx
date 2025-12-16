'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Bookmark, Share2, ChevronLeft, ChevronRight, Calendar, Eye, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import Subscription from '@/components/landing/Subscription'

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

const plansData: Record<string, {
  id: string
  title: string
  subtitle: string
  categories: string[]
  description: string
  image: string
  duration: string
  views: string
  likes: string
  participants: { id: number; name: string; avatar: string }[]
}> = {
  'becoming-resilient': {
    id: '3',
    title: 'Becoming Resilient',
    subtitle: 'A study plan for spiritual strength',
    categories: ['Day of plan', 'Gratitude', 'Wisdom'],
    description: 'The "Becoming Resilient" study plan is designed to empower you to confront challenges with unwavering faith. Each session is thoughtfully crafted and includes insightful questions, practical applications, and heartfelt prayers aimed at fortifying your spiritual foundation.',
    image: '/plans/plan3.png',
    duration: '90 Days',
    views: '18.2k',
    likes: '5.6k',
    participants: [
      { id: 1, name: 'User 1', avatar: '' },
      { id: 2, name: 'User 2', avatar: '' },
      { id: 3, name: 'User 3', avatar: '' },
    ]
  },
  'psalms-30-days': {
    id: '1',
    title: 'Psalms in 30 days',
    subtitle: 'A meditation journey through Psalms',
    categories: ['Meditation', 'Prayer', 'Worship'],
    description: 'Join our 30-day Psalms meditation journey. Reflect on hope, faith, and the timeless wisdom found in the book of Psalms. Each day brings you closer to understanding God\'s eternal love.',
    image: '/plans/plan1.png',
    duration: '30 Days',
    views: '24.5k',
    likes: '8.3k',
    participants: [
      { id: 1, name: 'User 1', avatar: '' },
      { id: 2, name: 'User 2', avatar: '' },
    ]
  },
  'body-of-christ': {
    id: '2',
    title: 'The Body of Christ',
    subtitle: 'Understanding the community of believers',
    categories: ['Community', 'Fellowship', 'Unity'],
    description: 'A deep dive into what it means to be part of the community of believers. Explore the metaphor of the body of Christ and discover your unique role in God\'s family.',
    image: '/plans/plan2.png',
    duration: '21 Days',
    views: '15.8k',
    likes: '4.2k',
    participants: [
      { id: 1, name: 'User 1', avatar: '' },
      { id: 2, name: 'User 2', avatar: '' },
      { id: 3, name: 'User 3', avatar: '' },
      { id: 4, name: 'User 4', avatar: '' },
    ]
  },
  'good-shepherd': {
    id: '4',
    title: 'The Good Shepherd',
    subtitle: 'Finding guidance in Psalm 23',
    categories: ['Guidance', 'Protection', 'Trust'],
    description: 'Reflect on the guidance and protection found in the 23rd Psalm. Learn to trust in the Lord as your shepherd who leads you through life\'s valleys.',
    image: '/plans/plan4.png',
    duration: '14 Days',
    views: '19.1k',
    likes: '6.7k',
    participants: [
      { id: 1, name: 'User 1', avatar: '' },
      { id: 2, name: 'User 2', avatar: '' },
    ]
  },
  'moving-forward': {
    id: '5',
    title: 'Moving Forward in Faith',
    subtitle: 'Steps into the unknown with God',
    categories: ['Faith', 'Trust', 'Journey'],
    description: 'A series on trusting God\'s plan and taking steps into the unknown. Learn to walk by faith, not by sight, as you move forward in your spiritual journey.',
    image: '/plans/plan5.png',
    duration: '45 Days',
    views: '12.4k',
    likes: '3.9k',
    participants: [
      { id: 1, name: 'User 1', avatar: '' },
      { id: 2, name: 'User 2', avatar: '' },
      { id: 3, name: 'User 3', avatar: '' },
    ]
  },
  'believers-journey': {
    id: '6',
    title: "The Believer's Journey",
    subtitle: 'A path of spiritual growth',
    categories: ['Growth', 'Discipleship', 'Faith'],
    description: 'A 30-day meditation on the path of spiritual growth and discipleship. Discover what it means to follow Christ daily and grow in your faith.',
    image: '/plans/plan6.png',
    duration: '30 Days',
    views: '21.3k',
    likes: '7.1k',
    participants: [
      { id: 1, name: 'User 1', avatar: '' },
      { id: 2, name: 'User 2', avatar: '' },
    ]
  },
}

export default function PlanDetailClient({ slug }: PlanDetailClientProps) {
  const router = useRouter()
  const t = useTranslations('PlanDetail')
  const tPlans = useTranslations('DiscoverPlans')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const plan = plansData[slug]
  const fallbackPlans: Plan[] = tPlans.raw('fallbackPlans') as Plan[]
  const similarPlans = fallbackPlans.filter(p => p.slug !== slug)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

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
      
      <main className="flex-1">
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
                  <button className="flex items-center gap-2 rounded-lg bg-red-900 px-6 py-2.5 text-white hover:bg-red-800 transition-colors">
                    <span className="font-medium">{t('continuePlan')}</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-white">
                      <ArrowUpRight size={14} className="text-red-900" />
                    </div>
                  </button>
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
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {similarPlans.map((similarPlan) => (
                <Link
                  key={similarPlan.id}
                  href={`/plans/${similarPlan.slug}`}
                  className="group flex-shrink-0"
                >
                  <div className="relative h-48 w-56 overflow-hidden rounded-lg">
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