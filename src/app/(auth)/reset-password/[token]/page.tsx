'use client'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react'
import { DotIcon, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl' 
import { toast } from 'sonner'

type ResetPasswordForm = {
  newPassword: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const { token } = useParams()
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const t = useTranslations('Auth.resetPassword') 
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordForm>()

  const passwordValue = watch('newPassword')

  const passwordCriteria = [
    {
      label: t('passwordCriteria.uppercase'),
      valid: /[A-Z]/.test(passwordValue || ''),
    },
    { label: t('passwordCriteria.number'), valid: /\d/.test(passwordValue || '') },
    {
      label: t('passwordCriteria.special'),
      valid: /[!@#$%^&*]/.test(passwordValue || ''),
    },
    { label: t('passwordCriteria.minLength'), valid: passwordValue?.length >= 8 },
  ]

  const allCriteriaValid = passwordCriteria.every((c) => c.valid)

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!allCriteriaValid) {
      setMessage('Password does not meet all requirements.')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const res = await axios.post('/api/auth/reset-password', {
        token,
        ...data,
      })

      setMessage(res.data.message)
      res.status == 200 && toast.success(res.data.message || 'Password reset successful')
      if (res.data.success) {
        reset()
        setTimeout(() => router.push('/login'), 600)
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.error || error?.message || 'Password reset failed'
      setMessage(msg)
      toast.error(msg)
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-gray-300 p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold">{t('title')}</h1>
        <p className="text-center text-sm text-gray-700">
          {t('description')}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
          {/* 🔹 New Password */}
          <div className="flex flex-col">
            <label htmlFor="newPassword" className="m-0 p-0 text-sm text-gray-700">
              {t('fields.newPassword')}
            </label>
            <div className="relative">
              <Input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                className="rounded border border-gray-500 p-2"
                {...register('newPassword', {
                  required: t('validation.newPasswordRequired'),
                  minLength: {
                    value: 6,
                    message: t('validation.passwordMinLength', { count: 6 }),
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          {/* 🔹 Confirm Password */}
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="m-0 p-0 text-sm text-gray-700">
              {t('fields.confirmPassword')}
            </label>

            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="rounded border p-2"
                {...register('confirmPassword', {
                  required: t('validation.confirmPasswordRequired'),
                  validate: (val) => val === watch('newPassword') || t('validation.passwordMismatch'),
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
          <ul className="mb-1 flex flex-wrap items-center text-sm">
            {passwordCriteria.map((c, i) => (
              <li key={i} className={c.valid ? 'text-green-600' : 'text-gray-500'}>
                <DotIcon className="-mr-2 inline" /> {c.label}
              </li>
            ))}
          </ul>
          <Button
            type="submit"
            disabled={isSubmitting || !allCriteriaValid}
            className="rounded bg-[#621B1C] py-2 text-white disabled:opacity-70"
          >
            {isSubmitting ? t('buttons.resetting') : t('buttons.resetPassword')}
          </Button>
        </form>

      </div>
    </section>
  )
}
