'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useUserStore } from '@/lib/stores/useUserStore'
import { loginFormSchema, type LoginFormSchema } from '@/lib/form-validation'

export default function LoginForm() {
  const router = useRouter()
  const { loadSession } = useUserStore()
  const [loading, setLoading] = useState(false)

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
      <h2 className="text-2xl font-semibold">Welcome Back!</h2>
      <p className="mb-4 text-sm text-gray-600">
        Don’t have an account yet?{' '}
        <a className="text-blue-500 underline" href="/register">
          Signup
        </a>
      </p>

      {/* Email */}
      <div>
        <label htmlFor="email" className="text-sm text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border p-3"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="text-sm text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border p-3"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Remember me + Forgot password */}
      <div className="my-3 flex items-center justify-between text-gray-700">
        <div>
          <input type="checkbox" id="remember" />
          <label htmlFor="remember" className="ml-1">
            Remember me
          </label>
        </div>
        <button
          type="button"
          onClick={() => router.push('/forgot-password')}
          className="text-blue-500 underline"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit */}
      <button
        disabled={loading}
        className="w-full cursor-pointer rounded-lg bg-[#621B1C] p-3 text-white hover:bg-[#471314] disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      <div className="my-2 flex items-center gap-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Google Login */}
      <button
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c9c9c9] p-2 text-gray-700 hover:bg-gray-400 disabled:bg-gray-400"
      >
        <img
          src="https://hackaday.com/wp-content/uploads/2016/08/google-g-logo.png"
          alt="google logo"
          className="w-[30px]"
        />
        {loading ? '...' : 'Continue with Google'}
      </button>
    </form>
  )
}
