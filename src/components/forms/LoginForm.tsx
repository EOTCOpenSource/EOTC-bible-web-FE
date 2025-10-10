'use client'

import type React from 'react'
import { useUserStore } from '@/lib/stores/useUserStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
}

export default function LoginForm() {
  const { loadSession } = useUserStore()
  const router = useRouter()
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setErr(null)
    setLoading(true)

    try {
      const res = await axios.post('/api/auth/login', data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })

      if (!res.data) {
        setErr('Empty response from server')
        return
      }

      await loadSession()
      router.push('/dashboard')
    } catch (error: any) {
      if (error.response) {
        setErr(error.response.data?.error || 'Login failed')
      } else {
        setErr(error.message || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-w-md space-y-1 p-4">
      <h2 className="my-0 py-0 text-2xl font-semibold">Welcome Back!</h2>
      <p className="mb-4 text-sm text-gray-600">
        Dont have an account yet?{' '}
        <a className="text-blue-500 underline" href="/register">
          Signup
        </a>
      </p>{' '}
      <div>
        <label htmlFor="email" className="text-sm text-gray-700">
          Email
        </label>
        <input
          className="w-full rounded-lg border p-3"
          placeholder="Email"
          id="email"
          type="email"
          {...register('email', { required: 'Email is required' })}
        />
      </div>
      {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      <div>
        <label htmlFor="password" className="text-sm text-gray-700">
          Password
        </label>
        <input
          className="w-full rounded-lg border p-3"
          placeholder="Password"
          type="password"
          id="password"
          {...register('password', { required: 'Password is required' })}
        />
      </div>
      {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="my-3 flex items-center justify-between text-gray-700">
        <div>
          <input type="checkbox" name="checkbox" id="checkbox" />
          <label htmlFor="checkbox"> Remember me</label>
        </div>
        <a
          href=""
          onClick={() => {
            router.push('/forgot-password')
          }}
          className="text-blue-500 underline"
        >
          Forgot password?
        </a>
      </div>
      <button
        className="w-full cursor-pointer rounded-lg bg-[#621B1C] p-3 text-white hover:bg-[#471314] disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
      <div className="my-2 flex items-center gap-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      <button
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#c9c9c9] p-2 text-gray-700 hover:bg-gray-400 disabled:bg-gray-400"
        disabled={loading}
      >
        <img
          className="w-[30px]"
          src="https://hackaday.com/wp-content/uploads/2016/08/google-g-logo.png"
          alt="google logo  image"
        />{' '}
        {loading ? '...' : 'Continue with Google'}
      </button>
    </form>
  )
}
