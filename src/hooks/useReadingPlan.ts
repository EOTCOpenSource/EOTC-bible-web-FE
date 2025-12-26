'use client'

import { useState, useEffect, useCallback } from 'react'
import axiosInstance from '@/lib/axios'
import { ReadingPlan, SimilarPlan } from '@/types/plans'

interface UseReadingPlanReturn {
  plan: ReadingPlan | null
  isLoading: boolean
  error: string | null
  markItemComplete: (itemId: string) => Promise<void>
  enrollInPlan: () => Promise<void>
  similarPlans: SimilarPlan[]
  refetch: () => Promise<void>
}

const MOCK_PLANS: Record<string, ReadingPlan> = {
  'becoming-resilient': {
    id: 'becoming-resilient',
    title: 'Becoming Resilient',
    description: 'The "Becoming Resilient" study plan is designed to empower you to confront challenges with unwavering faith. Each session is thoughtfully crafted and includes insightful questions, practical applications, and heartfelt prayers aimed at fortifying your spiritual foundation.',
    image: '/plans/plan3.png',
    slug: 'becoming-resilient',
    duration: 90,
    category: 'Wisdom',
    author: 'EOTC Bible Team',
    totalDays: 90,
    completedDays: 0,
    progress: 0,
    isEnrolled: false,
    items: Array.from({ length: 90 }, (_, i) => ({
      id: `item-${i + 1}`,
      day: i + 1,
      bookId: i < 30 ? 'psalms' : i < 60 ? 'proverbs' : 'ecclesiastes',
      bookName: i < 30 ? 'Psalms' : i < 60 ? 'Proverbs' : 'Ecclesiastes',
      chapter: (i % 30) + 1,
      title: `Day ${i + 1}: Finding Strength`,
      description: 'Reflect on God\'s promises and find resilience in faith.',
      isCompleted: false,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'psalms-30-days': {
    id: 'psalms-30-days',
    title: 'Psalms in 30 Days',
    description: 'Journey through the Book of Psalms in 30 days. Experience the full range of human emotion and divine comfort found in these ancient prayers and songs.',
    image: '/plans/plan1.png',
    slug: 'psalms-30-days',
    duration: 30,
    category: 'Psalms',
    author: 'EOTC Bible Team',
    totalDays: 30,
    completedDays: 0,
    progress: 0,
    isEnrolled: false,
    items: Array.from({ length: 30 }, (_, i) => ({
      id: `psalm-${i + 1}`,
      day: i + 1,
      bookId: 'psalms',
      bookName: 'Psalms',
      chapter: Math.floor(i * 5) + 1,
      verseStart: 1,
      title: `Day ${i + 1}: Psalms ${Math.floor(i * 5) + 1}-${Math.floor(i * 5) + 5}`,
      description: 'Read and meditate on these Psalms.',
      isCompleted: false,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'body-of-christ': {
    id: 'body-of-christ',
    title: 'The Body of Christ',
    description: 'A deep dive into what it means to be part of the community of believers. Explore unity, fellowship, and purpose.',
    image: '/plans/plan2.png',
    slug: 'body-of-christ',
    duration: 21,
    category: 'Fellowship',
    author: 'EOTC Bible Team',
    totalDays: 21,
    completedDays: 0,
    progress: 0,
    isEnrolled: false,
    items: Array.from({ length: 21 }, (_, i) => ({
      id: `body-${i + 1}`,
      day: i + 1,
      bookId: 'genesis',
      bookName: '1 Corinthians',
      chapter: Math.min(i + 1, 16),
      title: `Day ${i + 1}: Unity in Christ`,
      description: 'Discover your role in the body of Christ.',
      isCompleted: false,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'good-shepherd': {
    id: 'good-shepherd',
    title: 'The Good Shepherd',
    description: 'Reflect on the guidance and protection found in the 23rd Psalm and related passages about Christ as our Shepherd.',
    image: '/plans/plan4.png',
    slug: 'good-shepherd',
    duration: 14,
    category: 'Psalms',
    author: 'EOTC Bible Team',
    totalDays: 14,
    completedDays: 0,
    progress: 0,
    isEnrolled: false,
    items: Array.from({ length: 14 }, (_, i) => ({
      id: `shepherd-${i + 1}`,
      day: i + 1,
      bookId: 'psalms',
      bookName: 'Psalms',
      chapter: 23,
      title: `Day ${i + 1}: The Lord is My Shepherd`,
      description: 'Meditate on God\'s loving guidance.',
      isCompleted: false,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'moving-forward': {
    id: 'moving-forward',
    title: 'Moving Forward in Faith',
    description: 'A series on trusting God\'s plan and taking steps into the unknown with confidence and faith.',
    image: '/plans/plan5.png',
    slug: 'moving-forward',
    duration: 28,
    category: 'Faith',
    author: 'EOTC Bible Team',
    totalDays: 28,
    completedDays: 0,
    progress: 0,
    isEnrolled: false,
    items: Array.from({ length: 28 }, (_, i) => ({
      id: `forward-${i + 1}`,
      day: i + 1,
      bookId: 'genesis',
      bookName: 'Hebrews',
      chapter: Math.min(i + 1, 13),
      title: `Day ${i + 1}: Walking by Faith`,
      description: 'Learn to trust God in every step.',
      isCompleted: false,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'believers-journey': {
    id: 'believers-journey',
    title: 'The Believer\'s Journey',
    description: 'A 30-day meditation on the path of spiritual growth and discipleship.',
    image: '/plans/plan6.png',
    slug: 'believers-journey',
    duration: 30,
    category: 'Discipleship',
    author: 'EOTC Bible Team',
    totalDays: 30,
    completedDays: 0,
    progress: 0,
    isEnrolled: false,
    items: Array.from({ length: 30 }, (_, i) => ({
      id: `journey-${i + 1}`,
      day: i + 1,
      bookId: 'genesis',
      bookName: 'Matthew',
      chapter: Math.min(i + 1, 28),
      title: `Day ${i + 1}: Growing in Faith`,
      description: 'Discover the path of discipleship.',
      isCompleted: false,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
}

const SIMILAR_PLANS: SimilarPlan[] = [
  { id: 'psalms-30-days', title: 'Psalms in 30 days', description: 'Plan Details', image: '/plans/plan1.png', slug: 'psalms-30-days' },
  { id: 'believers-journey', title: 'The Believer\'s Journey', description: 'Plan Details', image: '/plans/plan6.png', slug: 'believers-journey' },
  { id: 'good-shepherd', title: 'The Good Shepherd', description: 'Plan Details', image: '/plans/plan4.png', slug: 'good-shepherd' },
  { id: 'body-of-christ', title: 'The Body of Christ', description: 'Plan Details', image: '/plans/plan2.png', slug: 'body-of-christ' },
  { id: 'becoming-resilient', title: 'Becoming Resilient', description: 'Plan Details', image: '/plans/plan3.png', slug: 'becoming-resilient' },
]

export function useReadingPlan(planId: string): UseReadingPlanReturn {
  const [plan, setPlan] = useState<ReadingPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [similarPlans, setSimilarPlans] = useState<SimilarPlan[]>([])

  const fetchPlan = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const foundPlan = MOCK_PLANS[planId]
      if (foundPlan) {
        let completedItems: string[] = []
        let isEnrolled = false
        
        if (typeof window !== 'undefined') {
          const savedProgress = localStorage.getItem(`plan-progress-${planId}`)
          if (savedProgress) {
            try {
              completedItems = JSON.parse(savedProgress)
            } catch {
              completedItems = []
            }
          }
          isEnrolled = localStorage.getItem(`plan-enrolled-${planId}`) === 'true'
        }
        
        const updatedItems = foundPlan.items.map(item => ({
          ...item,
          isCompleted: completedItems.includes(item.id),
        }))
        const completedDays = updatedItems.filter(item => item.isCompleted).length
        
        setPlan({
          ...foundPlan,
          items: updatedItems,
          completedDays,
          progress: Math.round((completedDays / foundPlan.totalDays) * 100),
          isEnrolled,
        })
        
        setSimilarPlans(SIMILAR_PLANS.filter(p => p.slug !== planId).slice(0, 5))
      } else {
        setError('Plan not found')
      }
    } catch (err) {
      setError('Failed to fetch plan')
    } finally {
      setIsLoading(false)
    }
  }, [planId])

  useEffect(() => {
    fetchPlan()
  }, [fetchPlan])

  const markItemComplete = useCallback(async (itemId: string) => {
    if (!plan) return

    try {
      const isCurrentlyCompleted = plan.items.find(item => item.id === itemId)?.isCompleted || false
      
      const response = await axiosInstance.post(`/api/reading-plans/${planId}/progress`, {
        itemId,
        isCompleted: !isCurrentlyCompleted,
      })

      const updatedPlan = response.data.plan as ReadingPlan
      setPlan(updatedPlan)

    } catch (err) {
      console.error('Failed to mark item complete:', err)
      setError('Failed to update reading progress')
    }
  }, [plan, planId])

  const enrollInPlan = useCallback(async () => {
    if (!plan || typeof window === 'undefined') return
    
    try {
      localStorage.setItem(`plan-enrolled-${planId}`, 'true')
      localStorage.setItem(`plan-start-${planId}`, new Date().toISOString())
      
      setPlan({
        ...plan,
        isEnrolled: true,
        startDate: new Date().toISOString(),
      })
    } catch (err) {
      console.error('Failed to enroll in plan:', err)
    }
  }, [plan, planId])

  return {
    plan,
    isLoading,
    error,
    markItemComplete,
    enrollInPlan,
    similarPlans,
    refetch: fetchPlan,
  }
}
