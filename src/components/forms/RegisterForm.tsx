'use client'

import { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { DotIcon, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterForm() {
  const t = useTranslations('Auth.register')
  const [err, setErr] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const passwordValue = watch('password')

  const passwordCriteria = [
    { label: t('password.uppercase'), valid: /[A-Z]/.test(passwordValue || '') },
    { label: t('password.number'), valid: /\d/.test(passwordValue || '') },
    { label: t('password.special'), valid: /[!@#$%^&*]/.test(passwordValue || '') },
    { label: t('password.minLength'), valid: passwordValue?.length >= 8 },
  ]

  const onSubmit = async (data: FormData) => {
    setErr(null)
    setSuccess(null)

    if (data.password !== data.confirmPassword) {
      setErr(t('errors.passwordMismatch'))
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('/api/auth/register', data, {
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.data) {
        setErr(t('errors.emptyResponse'))
        return
      }

      setSuccess(res.data.message || t('success'))
      reset()

      window.localStorage.setItem('registeredEmail', data.email)
      window.localStorage.setItem('registeredName', data.name)

      window.location.href = '/verify-otp'
    } catch (error: any) {
      if (error.response) {
        setErr(error.response.data?.error || t('errors.failed'))
      } else {
        setErr(error.message || t('errors.failed'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1 p-2">
      <h2 className="my-0 py-0 text-3xl font-semibold">{t('title')}</h2>
      <p className="mb-4 text-sm text-gray-600">
        {t('haveAccount')}{' '}
        <a className="text-blue-500 underline" href="/login">
          {t('login')}
        </a>
      </p>

      <div>
        <label className="text-sm text-gray-700" htmlFor="name">
          {t('fields.name')}
        </label>
        <input
          className="w-full rounded border p-2"
          placeholder={t('placeholders.name')}
          id="name"
          type="text"
          {...register('name', { required: t('validation.nameRequired') })}
        />
      </div>
      {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}

      <div>
        <label className="text-sm text-gray-700" htmlFor="email">
          {t('fields.email')}
        </label>
        <input
          className="w-full rounded border p-2"
          placeholder={t('placeholders.email')}
          id="email"
          type="email"
          {...register('email', { required: t('validation.emailRequired') })}
        />
      </div>
      {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

      <div className="items-baseline space-y-2 md:flex md:gap-2">
        <div className="flex-1">
          <label htmlFor="password" className="text-sm text-gray-700">
            {t('fields.password')}
          </label>
          <div className="relative">
            <input
              className="w-full rounded border p-2"
              placeholder={t('placeholders.password')}
              id="password"
              autoComplete="off"
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: t('validation.passwordRequired') })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex-1">
          <label className="text-sm text-gray-700" htmlFor="confirm-password">
            {t('fields.confirmPassword')}
          </label>
          <div className="relative">
            <input
              className="w-full rounded border p-2"
              placeholder={t('placeholders.confirmPassword')}
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: t('validation.confirmPasswordRequired'),
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
        </div>
      </div>

      <ul className="mb-1 flex flex-wrap items-center text-sm">
        {passwordCriteria.map((c, i) => (
          <li key={i} className={c.valid ? 'text-green-600' : 'text-gray-500'}>
            <DotIcon className="-mr-2 inline" /> {c.label}
          </li>
        ))}
      </ul>

      {err && <p className="text-sm text-red-600">{err}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="mb-3">
        <input type="checkbox" id="checkbox" />
        <label className="text-sm" htmlFor="checkbox">
          {t('agreeTo')}{' '}
        </label>
        <a href="#" className="text-sm text-red-900 underline">
          {t('terms')}
        </a>
      </div>

      <button
        className="w-full rounded-lg bg-[#621B1C] p-2 text-white hover:bg-[#491415] disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? t('loading') : t('register')}
      </button>

      <div className="my-1 flex items-center gap-3">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-sm text-gray-500">{t('or')}</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c9c9c9] p-1 text-gray-700 hover:bg-gray-400"
        disabled={loading}
      >
        <img
          className="w-[30px]"
          src="https://hackaday.com/wp-content/uploads/2016/08/google-g-logo.png"
          alt="google logo"
        />
        {loading ? '...' : t('google')}
      </button>
    </form>
  )
}
