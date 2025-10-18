'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, DotIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { registerFormSchema, type RegisterFormSchema } from '@/lib/form-validation'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: authRegister, success, error } = useAuthStore()

  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const passwordValue = watch('password') || ''

  // Password criteria feedback
  const passwordCriteria = [
    { label: 'At least 1 Uppercase letter', valid: /[A-Z]/.test(passwordValue) },
    { label: 'At least 1 Number', valid: /\d/.test(passwordValue) },
    { label: 'At least 1 special character', valid: /[!@#$%^&*]/.test(passwordValue) },
    { label: 'Minimum 8 characters', valid: passwordValue.length >= 8 },
  ]

  const onSubmit = async (data: RegisterFormSchema) => {
    setLoading(true)
    try {
      await authRegister({ name: data.name, email: data.email, password: data.password })
      localStorage.setItem('registeredEmail', data.email)
      localStorage.setItem('registeredName', data.name)
      reset()
      router.push('/verify-otp')
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (success) toast.success(success)
    if (error) toast.error(error)
  }, [success, error])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1 p-2">
      <h2 className="text-3xl font-semibold">Create an Account</h2>
      <p className="mb-4 text-sm text-gray-600">
        Already have an account?{' '}
        <a className="text-blue-500 underline" href="/login">
          Login
        </a>
      </p>

      {/* Name */}
      <div>
        <label htmlFor="name" className="text-sm text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          className="w-full rounded border p-2"
          placeholder="Your name"
          {...register('name')}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="text-sm text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded border p-2"
          placeholder="you@example.com"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="items-baseline space-y-2 md:flex md:gap-2">
        <div className="flex-1">
          <label htmlFor="password" className="text-sm text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded border p-2"
              placeholder="Enter password"
              autoComplete="off"
              {...register('password')}
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

        {/* Confirm Password */}
        <div className="flex-1">
          <label htmlFor="confirm-password" className="text-sm text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              className="w-full rounded border p-2"
              placeholder="Re-enter password"
              {...register('confirmPassword')}
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
      </div>

      {/* Password Criteria */}
      <ul className="mb-1 flex flex-wrap items-center text-sm">
        {passwordCriteria.map((c, i) => (
          <li key={i} className={c.valid ? 'text-green-600' : 'text-gray-500'}>
            <DotIcon className="-mr-2 inline" /> {c.label}
          </li>
        ))}
      </ul>

      {/* Terms */}
      <div className="mb-3 flex items-center gap-2">
        <input type="checkbox" id="checkbox" />
        <label htmlFor="checkbox" className="text-sm">
          I agree to the{' '}
          <a href="#" className="text-red-900 underline">
            Terms & Conditions
          </a>
        </label>
      </div>

      {/* Submit */}
      <button
        disabled={loading}
        className="w-full cursor-pointer rounded-lg bg-[#621B1C] p-2 text-white hover:bg-[#491415] disabled:bg-gray-400"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>

      <div className="my-1 flex items-center gap-3">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Google Button */}
      <button
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c9c9c9] p-1 text-gray-700 hover:bg-gray-400 disabled:bg-gray-400"
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
