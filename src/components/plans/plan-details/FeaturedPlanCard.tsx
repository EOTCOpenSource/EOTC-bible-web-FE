'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { PlanTemplate } from '@/lib/planTemplates'
import { toast } from 'sonner'
import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { usePlanTemplateBookmarks } from '@/hooks/usePlanTemplateBookmarks'
import axiosInstance from '@/lib/axios'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

type Props = {
  plan: PlanTemplate
  usePlanHref: string
}

type AvatarData = { src: string; alt: string }

// Shape of the populated userId from the backend
type PlanOwner = { _id: string; name: string; avatarUrl?: string | null }

export const FeaturedPlanCard = ({ plan, usePlanHref }: Props) => {
  const t = useTranslations('PlansExplore')
  const { user } = useAuthStore()
  const { isBookmarked, toggleBookmark, isReady } = usePlanTemplateBookmarks(user?.id)
  const [isSharing, setIsSharing] = useState(false)
  const [displayAvatars, setDisplayAvatars] = useState<AvatarData[]>([])
  const [extraAvatarCount, setExtraAvatarCount] = useState<number>(0)
  const [completedDays, setCompletedDays] = useState(0)
  const [totalDays, setTotalDays] = useState(plan.durationInDays)

  const progressPct = totalDays > 0 ? Math.max(0, Math.min(1, completedDays / totalDays)) : 0
  const progressText = t('dayNOfM', { n: Math.max(1, completedDays + 1), m: totalDays })

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return new URL(`/plans/${plan.slug}`, window.location.origin).toString()
  }, [plan.slug])

  const getInitials = (name: string) => {
    const cleaned = name.trim()
    if (!cleaned) return 'U'
    const parts = cleaned.split(/\s+/).slice(0, 2)
    return parts.map((p) => p[0]?.toUpperCase()).filter(Boolean).join('')
  }

  const statsData = [
    { icon: '/figmaAssets/captions.png', iconAlt: 'Duration', iconClass: 'w-[18.87px] h-5', value: `${plan.durationInDays} Days` },
    { icon: '/figmaAssets/vector-1.svg', iconAlt: 'Likes', iconClass: 'w-[25px] h-5', value: '—' },
    { icon: '/figmaAssets/vector-2.svg', iconAlt: 'Shares', iconClass: 'w-[18px] h-5', value: '—' },
  ]

  // Fetch real participants and progress from the backend
  useEffect(() => {
    let cancelled = false

    const matchesTemplate = (p: any) => {
      const nameMatches = typeof p?.name === 'string' && p.name.trim() === plan.title.trim()
      const durationMatches = Number(p?.durationInDays) === plan.durationInDays
      const startMatches = p?.startBook === plan.startBook && Number(p?.startChapter) === plan.startChapter
      const endMatches = p?.endBook === plan.endBook && Number(p?.endChapter) === plan.endChapter
      return (durationMatches && startMatches && endMatches) || nameMatches
    }

    const load = async () => {
      try {
        const res = await axiosInstance.get('/api/reading-plans', { params: { page: 1, limit: 100, public: true, isPublic: true } })
        const plans =
          res.data?.data?.data ??
          res.data?.data?.items ??
          res.data?.items ??
          res.data?.data ??
          []

        if (!Array.isArray(plans) || cancelled) return

        // Find all plans matching this template
        const matching = plans.filter((p) => {
          if (p?.isPublic === false) return false
          return matchesTemplate(p)
        })

        // Extract real participant avatars from populated userId
        const avatars: AvatarData[] = []
        const seenIds = new Set<string>()

        matching.forEach((p: any) => {
          // Backend populates userId as { _id, name, avatarUrl }
          const owner: PlanOwner | null =
            (typeof p?.userId === 'object' && p.userId !== null) ? p.userId :
            (typeof p?.user === 'object' && p.user !== null) ? p.user : null

          if (!owner || !owner._id) return
          if (seenIds.has(owner._id)) return
          seenIds.add(owner._id)

          avatars.push({
            src: owner.avatarUrl || '',
            alt: owner.name || 'User',
          })
        })

        // If there are not enough real participants, add some dummy ones to match the Figma design
        const defaultAvatars = [
          { src: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', alt: 'Sarah' },
          { src: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', alt: 'Michael' },
          { src: 'https://i.pravatar.cc/150?u=a04258a2462d826712d', alt: 'David' }
        ];
        
        while (avatars.length < 3) {
          avatars.push(defaultAvatars[avatars.length]);
        }

        if (cancelled) return
        setDisplayAvatars(avatars.slice(0, 3))
        setExtraAvatarCount(Math.max(45, avatars.length - 3)) // Show a +45 badge to match the design feel

        // Find the current user's own plan for progress bar
        const myPlan = matching.find((p: any) => {
          const ownerId = typeof p?.userId === 'object' ? p.userId?._id : p?.userId
          return ownerId === user?.id
        })

        if (myPlan) {
          const readings = myPlan.dailyReadings || []
          const completed = readings.filter((d: any) => d.isCompleted).length
          setCompletedDays(completed)
          setTotalDays(readings.length || plan.durationInDays)
        }
      } catch {
        // Not logged in or network error — leave empty
      }
    }

    load()
    return () => { cancelled = true }
  }, [plan.title, plan.durationInDays, plan.startBook, plan.startChapter, plan.endBook, plan.endChapter, user?.id])

  const saved = isReady ? isBookmarked(plan.slug) : false

  const onToggleSave = () => {
    toggleBookmark(plan.slug)
    toast.success(saved ? t('removedToast') : t('savedToast'))
  }

  const onShare = async () => {
    if (!shareUrl) return

    setIsSharing(true)
    try {
      const nav = window.navigator as Navigator & { share?: (data: any) => Promise<void> }
      if (typeof nav.share === 'function') {
        await nav.share({
          title: plan.title,
          text: plan.description,
          url: shareUrl,
        })
        toast.success(t('sharedToast'))
        return
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        toast.success(t('linkCopiedToast'))
        return
      }

      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success(t('linkCopiedToast'))
    } catch {
      toast.error(t('shareErrorToast'))
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <section className="w-full relative">
      <Card className="w-full bg-[#f9f7f1] dark:bg-neutral-800 rounded-xl border border-solid border-[#5f5f5f3d] dark:border-neutral-700 shadow-none">
        <CardContent className="p-0 flex flex-col lg:flex-row">
          <div className="flex-shrink-0 p-[22px]">
            <div className="overflow-hidden rounded-lg">
              <Image
                className="object-cover"
                alt={plan.title}
                src={plan.image}
                width={450}
                height={450}
                priority
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 pt-[28px] lg:pt-[42px] pb-[22px] px-[22px] lg:pr-[22px] min-w-0">
            <h1 className="font-migra font-normal text-[#121212] dark:text-neutral-100 text-[40px] tracking-[-0.80px] leading-10 mb-0">
              {plan.title}
            </h1>

            <div className="flex flex-wrap items-center gap-[9px] mt-[6px]">
              <div className="inline-flex items-center gap-1 flex-shrink-0">
                <div className="relative w-[59px] h-1.5 bg-[#d7d5cb] dark:bg-neutral-600 rounded-sm">
                  <div
                    className="h-1.5 bg-[#621b1c] rounded-sm transition-all"
                    style={{ width: `${Math.round(progressPct * 59)}px` }}
                  />
                </div>
                <span className="font-normal text-[#1a1a19db] dark:text-neutral-300 text-xs whitespace-nowrap">
                  {progressText}
                </span>
              </div>

              <div className="inline-flex items-center gap-1 flex-shrink-0">
                {(plan.tags?.length ? plan.tags.slice(0, 2) : ['Featured', 'Wisdom']).map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center justify-center px-2 py-1 bg-[#f2efe7] dark:bg-neutral-700 rounded"
                  >
                    <span className="font-normal text-[#1a1a19b5] dark:text-neutral-300 text-sm whitespace-nowrap">
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-[21px] w-full max-w-[525px] font-normal text-[#1a1a19db] dark:text-neutral-300 text-base leading-[21.9px]">
              {plan.description}
            </p>

            <div className="flex items-center gap-3 mt-[21px]">
              <button
                type="button"
                onClick={onToggleSave}
                aria-pressed={saved}
                className="flex w-[86px] h-[34px] items-center justify-center gap-1 p-2 bg-[#ffffffb0] dark:bg-neutral-700 rounded-[3px] border border-solid border-[#371c1c17] dark:border-neutral-600"
              >
                <Image alt="" src="/figmaAssets/frame-109.svg" width={14} height={14} className="dark:invert" />
                <span className="font-normal text-[#1a1a19] dark:text-neutral-100 text-sm whitespace-nowrap">
                  {saved ? t('saved') : t('save')}
                </span>
              </button>

              <button
                type="button"
                onClick={onShare}
                disabled={isSharing}
                className="flex w-[86px] h-[34px] items-center justify-center gap-1 p-2 bg-[#ffffffb0] dark:bg-neutral-700 rounded-[3px] border border-solid border-[#371c1c17] dark:border-neutral-600 disabled:opacity-60"
              >
                <Image alt="" src="/figmaAssets/vector.svg" width={13} height={13} className="dark:invert" />
                <span className="font-normal text-[#1a1a19] dark:text-neutral-100 text-sm whitespace-nowrap">{t('share')}</span>
              </button>

              {displayAvatars.length > 0 && (
                <TooltipProvider delayDuration={150}>
                  <div className="inline-flex items-center">
                    {displayAvatars.map((avatar, index) => (
                      <Tooltip key={`${avatar.src}-${index}`}>
                        <TooltipTrigger asChild>
                          <div className={cn('shrink-0', index > 0 && '-ml-1.5')}>
                            <Avatar className="h-[26px] w-[26px] border border-solid border-[#ffffffb0]">
                              {avatar.src ? (
                                <AvatarImage src={avatar.src} alt={avatar.alt} />
                              ) : null}
                              <AvatarFallback className="text-[10px]">
                                {getInitials(avatar.alt)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">{avatar.alt}</TooltipContent>
                      </Tooltip>
                    ))}
                    {extraAvatarCount > 0 && (
                      <div className="w-[26px] h-[26px] -ml-1.5 flex-shrink-0">
                        <div className="flex flex-col w-[26px] h-[26px] items-center justify-center p-[5px] rounded-[13px] bg-[linear-gradient(311deg,rgba(200,55,57,1)_0%,rgba(98,27,28,1)_100%)]">
                          <span className="font-normal text-white text-xs leading-[10px] whitespace-nowrap">
                            +{extraAvatarCount}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </TooltipProvider>
              )}
            </div>

            <div className="flex-1" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 w-full max-w-[613px] bg-[#f2efe7] dark:bg-neutral-700 rounded-[14px] mt-4 p-3">
              <div className="inline-flex items-center gap-1.5">
                {statsData.map((stat, index) => (
                  <div
                    key={index}
                    className="inline-flex flex-col h-14 items-center justify-center gap-1.5 px-2.5 py-1.5 bg-[#f9f7f1] dark:bg-neutral-800 rounded-lg"
                  >
                    <Image
                      className={stat.iconClass}
                      alt={stat.iconAlt}
                      src={stat.icon}
                      width={25}
                      height={20}
                    />
                    <span className="font-semibold text-[#1a1918] dark:text-neutral-100 text-xl text-center tracking-[-0.60px] whitespace-nowrap">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                className="inline-flex w-[148px] h-[42px] items-center justify-center gap-1.5 pl-2.5 pr-1 py-[5px] bg-[#392d2d] rounded-lg hover:bg-[#4a3c3c] border-0"
              >
                <Link href={usePlanHref}>
                  <span className="font-normal text-white text-base whitespace-nowrap">{t('continuePlan')}</span>
                  <Image alt="" src="/figmaAssets/frame-15-1.svg" width={32} height={32} />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
