'use client'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl' 
import { toast } from 'sonner'

type ForgotPasswordForm = {
  email: string
}

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const t = useTranslations('Auth.forgotPassword')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordForm>()

  function maskEmail(email: string) {
    const [localPart, domain] = email.split('@')
    if (!domain || localPart.length < 3) return email 

    const start = localPart.slice(0, 2)
    const end = localPart.slice(-2)
    const masked = '*'.repeat(Math.max(localPart.length - 4, 3)) 

    return `${start}${masked}${end}@${domain}`
  }

  const sendEmail = async (email: string) => {
    setIsSubmitting(true)
    try {
      const res = await axios.post('/api/auth/forgot-password', { email })
      if (res.data.success) {
        setEmailSent(true)
        toast.success('Password reset email sent successfully')
        setUserEmail(email)
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.error || error?.message || 'Failed to send password reset email'
      toast.error(msg)
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (data: ForgotPasswordForm) => {
    await sendEmail(data.email)
    reset()
  }

  const handleResend = async () => {
    if (!userEmail) return
    await sendEmail(userEmail)
  }

  const handleChangeEmail = () => {
    setEmailSent(false)
    reset()
  }

  return (
    <section className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-gray-300 p-8 text-center shadow-lg">
        {!emailSent ? (
          <>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="mt-2 text-sm text-gray-700">
              {t('description')}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                {t('fields.emailAddress')}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t('placeholders.email')}
                className="rounded border p-2 focus:ring-2 focus:outline-none"
                {...register('email', {
                  required: t('validation.emailRequired'),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t('validation.invalidEmail'),
                  },
                })}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="my-6 cursor-pointer rounded-lg bg-[#621B1C] py-3 text-white hover:bg-[#4d1516] disabled:opacity-70"
              >
                {isSubmitting ? t('buttons.sending') : t('buttons.sendEmail')}
              </Button>
            </form>

            <p className="mt-4 text-gray-700">
              {t('rememberedPassword')}{' '}
              <a href="/login" className="text-[#621B1C] underline">
                {t('buttons.login')}
              </a>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">{t('emailSent.title')}</h1>
            <p className="mt-2 text-sm text-gray-700">
              {t('emailSent.description')}: <br />
              <strong>{maskEmail(userEmail)}</strong>.
              <br />
              {t('emailSent.checkSpam')}
            </p>

            <p className="mt-10 text-sm font-bold text-gray-700">
              {t('emailSent.didNotReceive')}{' '}
              <button
                onClick={handleResend}
                disabled={isSubmitting}
                className="ml-1 text-[#621B1C] underline disabled:opacity-70"
              >
                {isSubmitting ? t('buttons.resending') : t('buttons.resendEmail')}
              </button>
              <br />
              {t('emailSent.wrongEmail')}{' '}
              <button onClick={handleChangeEmail} className="ml-1 text-[#621B1C] underline">
                {t('buttons.changeEmail')}
              </button>
            </p>
          </>
        )}
      </div>
    </section>
  )
}
