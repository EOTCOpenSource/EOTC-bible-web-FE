'use client'

import { useState, FormEvent } from 'react'
import { Input } from '../ui/input'
import { ArrowUpRight, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import axiosInstance from '@/lib/axios'

const Subscription = () => {
  const t = useTranslations('Subscription')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    try {
      const response = await axiosInstance.post('/api/notifications/subscribe', { email })
      if (response.status === 201 || response.status === 200) {
        toast.success('✅ Subscribed successfully!')
        setEmail('')
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('You are already subscribed to our newsletter!')
      } else {
        toast.error(error.response?.data?.message || 'Failed to subscribe. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center bg-white dark:bg-neutral-900 pt-10 md:py-20">
      <div className="flex h-auto w-full flex-col justify-center gap-8 rounded-lg bg-[#FFFBF5] dark:bg-neutral-800 px-6 py-8 md:h-[123px] md:w-[1344px] md:flex-row md:justify-center md:gap-20 md:px-12 md:py-0">
        <h3 className="text-left text-2xl font-bold md:text-left">
          {t('title')
            .split('\n')
            .map((line, idx) => (
              <span key={idx}>
                {line}
                <br className="hidden md:block" />
              </span>
            ))}
        </h3>
        <div>
          <p className="pb-2 text-left md:text-left">{t('subtitle')}</p>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 md:flex-row">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('placeholder')}
              required
              disabled={isSubmitting}
              className="h-10 w-full rounded-md border-gray-300 bg-gray-100 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white sm:w-80 disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 rounded-md bg-[#4C0E0F] py-2 pr-2 pl-6 text-white sm:w-auto disabled:opacity-50 transition-opacity"
            >
              <span>{isSubmitting ? 'Subscribing...' : t('button')}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white p-1 text-[#4C0E0F]">
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <ArrowUpRight size={20} />}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Subscription
