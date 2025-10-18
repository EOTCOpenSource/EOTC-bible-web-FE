'use client'

import { loginFormSchema, type LoginFormSchema } from '@/lib/form-validation'
import { useUserStore } from '@/lib/stores/useUserStore'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
export default function LoginForm() {
  const router = useRouter()
  const { loadSession } = useUserStore()
  const [loading, setLoading] = useState(false)
  const t = useTranslations('Auth.login');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormSchema) => {
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/login', data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })

      toast.success('Login successful')
      await loadSession()
      router.push('/dashboard')
    } catch (error: any) {
      const msg =
        error?.response?.data?.error || error?.message || 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-w-md space-y-1 p-4">
      <h2 className="my-0 py-0 text-2xl font-semibold">{t('title')}</h2>
      <p className="mb-4 text-sm text-gray-600">
        {t('noAccount')}{' '}
        <a className="text-blue-500 underline" href="/register">
          {t('signup')}
        </a>
      </p>
      <div>
        <label htmlFor="email" className="text-sm text-gray-700">
          {t('fields.email')}
        </label>
        <input
          className="w-full rounded-lg border p-2"
          placeholder={t('placeholders.email')}
          id="email"
          type="email"
          {...register('email', { required: t('validation.emailRequired') })}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="text-sm text-gray-700">
          {t('fields.password')}
        </label>
        <input
          className="w-full rounded-lg border p-2"
          placeholder={t('placeholders.password')}
          type="password"
          id="password"
          {...register('password', { required: t('validation.passwordRequired') })}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Remember me + Forgot password */}
      <div className="my-3 flex items-center justify-between text-gray-700">
        <div>
          <input type="checkbox" name="checkbox" id="checkbox" />
          <label htmlFor="checkbox"> {t('rememberMe')}</label>
        </div>
        <Link
          href="/forgot-password"
          className="text-blue-500 underline"
        >
          {t('forgotPassword')}
        </Link>
      </div>

      {/* Submit */}
      <button
        disabled={loading}
        className="w-full cursor-pointer rounded-lg bg-[#621B1C] p-2 text-white hover:bg-[#471314] disabled:opacity-50"
      >
        {loading ? t('loading') : t('submit')}
      </button>

      <div className="my-2 flex items-center gap-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-sm text-gray-500">{t('or')}</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Google Login */}
      <button
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c9c9c9] p-1 text-gray-700 hover:bg-gray-400 disabled:bg-gray-400"
      >
        <img
          src="https://hackaday.com/wp-content/uploads/2016/08/google-g-logo.png"
          alt="google logo"
          className="w-[30px]"
        />
        {loading ? t('loading') : t('continueWithGoogle')}
      </button>
    </form>
  )
}
