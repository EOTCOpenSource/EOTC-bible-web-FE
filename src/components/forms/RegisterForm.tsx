'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { DotIcon, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterForm() {
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

  // Password validation criteria
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

  const onSubmit = async (data: FormData) => {
    setErr(null)
    setSuccess(null)

    if (data.password !== data.confirmPassword) {
      setErr('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('/api/auth/register', data, {
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.data) {
        setErr('Empty response from server')
        return
      }

      setSuccess(res.data.message || 'Registration successful')
      reset()

      window.localStorage.setItem('registeredEmail', data.email)
      window.localStorage.setItem('registeredName', data.name)

      window.location.href = '/verify-otp'
    } catch (error: any) {
      if (error.response) {
        setErr(error.response.data?.error || 'Registration failed')
      } else {
        setErr(error.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { 
    {err && toast.error(JSON.parse(err).message)}
      {success && toast.success(JSON.parse(success).message)}
  }, [err, success])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1 p-2">
      <h2 className="my-0 py-0 text-3xl font-semibold">Create an Account</h2>
      <p className="mb-4 text-sm text-gray-600">
        Already have an account?{' '}
        <a className="text-blue-500 underline" href="/login">
          Login
        </a>
      </p>
      <div>
        <label className="text-sm text-gray-700" htmlFor="name">
          Full Name
        </label>
        <input
          className="w-full rounded border p-2"
          placeholder="name"
          id="name"
          type="text"
          {...register('name', { required: 'Name is required' })}
        />
      </div>
      {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      <div>
        <label className="text-sm text-gray-700" htmlFor="email">
          Email
        </label>
        {/* Email Field */}
        <input
          className="w-full rounded border p-2"
          placeholder="email"
          id="email"
          type="email"
          {...register('email', { required: 'Email is required' })}
        />
      </div>
      {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      {/* Password Field */}
      <div className="items-baseline space-y-2 md:flex md:gap-2">
        <div className="flex-1">
          <label htmlFor="password" className="text-sm text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              className="w-full rounded border p-2"
              placeholder="Password"
              id="password"
              autoComplete="off"
              autoSave="off"
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        {/* Confirm Password Field */}
        <div className="flex-1">
          <label className="text-sm text-gray-700" htmlFor="confirm-password">
            Confirm password
          </label>
          <div className="relative">
            <input
              className="w-full rounded border p-2"
              placeholder="Confirm Password"
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
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
      {/* Password criteria feedback */}
      <ul className="mb-1 flex flex-wrap items-center text-sm">
        {passwordCriteria.map((c, i) => (
          <li key={i} className={c.valid ? 'text-green-600' : 'text-gray-500'}>
            {/* {c.valid ? "✔" : "✖"} */}
            <DotIcon className="-mr-2 inline" /> {c.label}
          </li>
        ))}
      </ul>
      {errors.confirmPassword && (
        <p className="text-sm text-red-600">{toast.error(errors.confirmPassword.message)}</p>
      )}
      <div className="mb-3">
        <input type="checkbox" name="checkbox" id="checkbox" />
        <label className="text-sm" htmlFor="checkbox">
          {' '}
          i agree to the{' '}
        </label>{' '}
        <a href="#" className="text-sm text-red-900 underline">
          Terms & Conditions
        </a>
      </div>
      <button
        className="w-full cursor-pointer rounded-lg bg-[#621B1C] p-2 text-white hover:bg-[#491415] disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
      <div className="my-1 flex items-center gap-3">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      <button
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#c9c9c9] p-1 text-gray-700 hover:bg-gray-400 disabled:bg-gray-400"
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
