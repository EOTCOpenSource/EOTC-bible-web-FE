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

const avatarImages = [
  { src: '/figmaAssets/ellipse-14.png', alt: 'User' },
  { src: '/figmaAssets/ellipse-13.png', alt: 'User' },
  { src: '/figmaAssets/ellipse-12.png', alt: 'User' },
]

type Avatar = { src: string; alt: string }

export const FeaturedPlanCard = ({ plan, usePlanHref }: Props) => {
  const t = useTranslations('PlansExplore')
  const progressText = t('dayNOfM', { n: 1, m: plan.durationInDays })
  const progressPct = Math.max(0, Math.min(1, 1 / Math.max(1, plan.durationInDays)))
  const { user } = useAuthStore()
  const { isBookmarked, toggleBookmark, isReady } = usePlanTemplateBookmarks(user?.id)
  const [isSharing, setIsSharing] = useState(false)
  const [displayAvatars, setDisplayAvatars] = useState<Avatar[]>(avatarImages)
  const [extraAvatarCount, setExtraAvatarCount] = useState<number | null>(null)

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

  useEffect(() => {
    let cancelled = false

    const matchesTemplate = (p: any) => {
      const nameMatches = typeof p?.name === 'string' && p.name.trim() === plan.title.trim()
      const durationMatches = Number(p?.durationInDays) === plan.durationInDays
      const startMatches = p?.startBook === plan.startBook && Number(p?.startChapter) === plan.startChapter
      const endMatches = p?.endBook === plan.endBook && Number(p?.endChapter) === plan.endChapter
      return (durationMatches && startMatches && endMatches) || nameMatches
    }

    const getOwner = (p: any) => p?.user ?? p?.owner ?? p?.createdBy ?? p?.createdByUser ?? null

    const getAvatarUrl = (owner: any) =>
      owner?.avatarUrl ??
      owner?.photo_url ??
      owner?.photoUrl ??
      owner?.imageUrl ??
      owner?.image ??
      owner?.avatar ??
      owner?.profileImageUrl ??
      null

    const getOwnerName = (owner: any) => owner?.name ?? owner?.username ?? owner?.first_name ?? 'User'

    const load = async () => {
      try {
        const res = await axiosInstance.get('/api/reading-plans', { params: { page: 1, limit: 100 } })
        const plans =
          res.data?.data?.data ??
          res.data?.data?.items ??
          res.data?.items ??
          res.data?.data ??
          []

        if (!Array.isArray(plans)) return

        const matching = plans.filter((p) => {
          if (typeof p?.isPublic === 'boolean' && p.isPublic !== true) return false
          return matchesTemplate(p)
        })

        const owners = matching.map(getOwner).filter(Boolean)
        const avatars = owners
          .map((o) => {
            const url = getAvatarUrl(o)
            if (!url || typeof url !== 'string') return null
            return { src: url, alt: getOwnerName(o) } satisfies Avatar
          })
          .filter(Boolean) as Avatar[]

        const uniq = Array.from(new Map(avatars.map((a) => [a.src, a])).values())
        if (uniq.length === 0) return

        const top = uniq.slice(0, 3)
        const filled = [...top]
        while (filled.length < 3) {
          filled.push(avatarImages[filled.length])
        }

        if (cancelled) return
        setDisplayAvatars(filled)
        setExtraAvatarCount(Math.max(0, uniq.length - 3))
      } catch {
        // Not logged in or backend doesn't support it; keep mocks.
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [plan.title, plan.durationInDays, plan.startBook, plan.startChapter, plan.endBook, plan.endChapter])

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
            <h1 className="font-normal text-[#121212] dark:text-neutral-100 text-[40px] tracking-[-0.80px] leading-10 mb-0">
              {plan.title}
            </h1>

            <div className="flex flex-wrap items-center gap-[9px] mt-[6px]">
              <div className="inline-flex items-center gap-1 flex-shrink-0">
                <div className="relative w-[59px] h-1.5 bg-[#d7d5cb] dark:bg-neutral-600 rounded-sm">
                  <div
                    className="h-1.5 bg-[#621b1c] rounded-sm"
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

              <TooltipProvider delayDuration={150}>
                <div className="inline-flex items-center">
                  {displayAvatars.map((avatar, index) => (
                    <Tooltip key={`${avatar.src}-${index}`}>
                      <TooltipTrigger asChild>
                        <div className={cn('shrink-0', index > 0 && '-ml-1.5')}>
                          <Avatar className="h-[26px] w-[26px] border border-solid border-[#ffffffb0]">
                            <AvatarImage src={avatar.src} alt={avatar.alt} />
                            <AvatarFallback className="text-[10px]">
                              {getInitials(avatar.alt)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="text-xs">{avatar.alt}</TooltipContent>
                    </Tooltip>
                  ))}
                {extraAvatarCount === null ? (
                  <div className="w-[26px] h-[26px] -ml-1.5 flex-shrink-0">
                    <div className="flex flex-col w-[26px] h-[26px] items-center justify-center p-[5px] rounded-[13px] bg-[linear-gradient(311deg,rgba(200,55,57,1)_0%,rgba(98,27,28,1)_100%)]">
                      <span className="font-normal text-white text-xs leading-[10px] whitespace-nowrap">
                        +5
                      </span>
                    </div>
                  </div>
                ) : extraAvatarCount > 0 ? (
                  <div className="w-[26px] h-[26px] -ml-1.5 flex-shrink-0">
                    <div className="flex flex-col w-[26px] h-[26px] items-center justify-center p-[5px] rounded-[13px] bg-[linear-gradient(311deg,rgba(200,55,57,1)_0%,rgba(98,27,28,1)_100%)]">
                      <span className="font-normal text-white text-xs leading-[10px] whitespace-nowrap">
                        +{extraAvatarCount}
                      </span>
                    </div>
                  </div>
                ) : null}
                </div>
              </TooltipProvider>
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
