'use client'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react'
import { DotIcon, Eye, EyeOff } from 'lucide-react'

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
      label: 'At least 1 Uppercase letter',
      valid: /[A-Z]/.test(passwordValue || ''),
    },
    { label: 'At least 1 Number', valid: /\d/.test(passwordValue || '') },
    {
      label: 'At least 1 special character',
      valid: /[!@#$%^&*]/.test(passwordValue || ''),
    },
    { label: 'Minimum 8 characters', valid: passwordValue?.length >= 8 },
  ]

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsSubmitting(true)
    setMessage('')

    try {
      const res = await axios.post('/api/auth/reset-password', {
        token,
        ...data,
      })

      setMessage(res.data.message)

      if (res.data.success) {
        reset()
        setTimeout(() => router.push('/login'), 600)
      }
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Something went wrong, try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-gray-300 p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold">Create a new password</h1>
        <p className="text-center text-sm text-gray-700">
          Please enter a new password for your EOTCBible account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
          {/* 🔹 New Password */}
          <div className="flex flex-col">
            <label htmlFor="newPassword" className="m-0 p-0 text-sm text-gray-700">
              New password
            </label>
            <div className="relative">
              <Input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                className="rounded border border-gray-500 p-2"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
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
              Confirm password
            </label>

            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="rounded border p-2"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (val) => val === watch('newPassword') || 'Passwords do not match',
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
                {/* {c.valid ? "✔" : "✖"} */}
                <DotIcon className="-mr-2 inline" /> {c.label}
              </li>
            ))}
          </ul>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-[#621B1C] py-2 text-white disabled:opacity-70"
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.toLowerCase().includes('successful') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  )
}
