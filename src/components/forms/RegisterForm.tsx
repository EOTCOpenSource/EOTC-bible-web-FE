'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { DotIcon, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { registerFormSchema, type RegisterFormSchema } from '@/lib/form-validation'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import FacebookSignInButton from '@/components/auth/FacebookSignInButton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function RegisterForm() {
  const t = useTranslations('Auth.register')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
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

  const passwordCriteria = [
    { label: t('password.uppercase'), valid: /[A-Z]/.test(passwordValue) },
    { label: t('password.number'), valid: /\d/.test(passwordValue) },
    { label: t('password.special'), valid: /[!@#$%^&*]/.test(passwordValue) },
    { label: t('password.minLength'), valid: passwordValue.length >= 8 },
  ]

  const onSubmit = async (data: RegisterFormSchema) => {
    if (!agreeToTerms) {
      toast.error(t('errors.termsRequired'))
      return
    }
    setLoading(true)
    try {
      await authRegister({ name: data.name, email: data.email, password: data.password })
      localStorage.setItem('registeredEmail', data.email)
      localStorage.setItem('registeredName', data.name)
      reset()
      router.push('/verify-otp')
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || t('errors.failed')
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
      <h2 className="my-0 py-0 text-3xl font-semibold dark:text-white">{t('title')}</h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {t('haveAccount')}{' '}
        <a className="text-blue-500 underline dark:text-blue-400" href="/login">
          {t('login')}
        </a>
      </p>

      {/* Name */}
      <div>
        <label className="text-sm text-gray-700 dark:text-gray-300" htmlFor="name">
          {t('fields.name')}
        </label>
        <input
          className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-primary"
          placeholder={t('placeholders.name')}
          id="name"
          type="text"
          {...register('name')}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="text-sm text-gray-700 dark:text-gray-300" htmlFor="email">
          {t('fields.email')}
        </label>
        <input
          className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-primary"
          placeholder={t('placeholders.email')}
          id="email"
          type="email"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="items-baseline space-y-2 md:flex md:gap-2">
        <div className="flex-1">
          <label className="text-sm text-gray-700 dark:text-gray-300" htmlFor="password">
            {t('fields.password')}
          </label>
          <div className="relative">
            <input
              className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-primary"
              placeholder={t('placeholders.password')}
              id="password"
              autoComplete="off"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2.5 right-3 cursor-pointer text-gray-600 dark:text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="flex-1">
          <label className="text-sm text-gray-700 dark:text-gray-300" htmlFor="confirm-password">
            {t('fields.confirmPassword')}
          </label>
          <div className="relative">
            <input
              className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-primary"
              placeholder={t('placeholders.confirmPassword')}
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-2.5 right-3 cursor-pointer text-gray-600 dark:text-gray-400"
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
          <li key={i} className={c.valid ? 'text-green-600 dark:text-green-500' : 'text-gray-500 dark:text-gray-500'}>
            <DotIcon className="-mr-2 inline" /> {c.label}
          </li>
        ))}
      </ul>

      {/* Terms */}
      <div className="mb-3 flex items-start gap-2 text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          id="checkbox"
          className="mt-0.5 dark:bg-neutral-800 dark:border-neutral-700"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
        />
        <label className="text-sm leading-relaxed" htmlFor="checkbox">
          {t('agreeTo')}{' '}
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="text-[#4C0E0F] underline hover:text-[#621B1C] dark:text-red-400 dark:hover:text-red-300"
          >
            {t('terms')}
          </button>
        </label>
      </div>

      {/* Submit Button */}
      <button
        disabled={loading}
        className="w-full cursor-pointer rounded-lg bg-[#621B1C] p-2 text-white hover:bg-[#491415] disabled:bg-gray-400 dark:disabled:bg-gray-700"
      >
        {loading ? t('loading') : t('register')}
      </button>

      <div className="my-1 flex items-center gap-3">
        <div className="flex-1 border-t border-gray-300 dark:border-neutral-700"></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{t('or')}</span>
        <div className="flex-1 border-t border-gray-300 dark:border-neutral-700"></div>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-between">
          <GoogleSignInButton />
          <FacebookSignInButton />
        </div>
      </div>

      {/* Terms Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b dark:border-neutral-800 shrink-0">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Terms and Conditions
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-6 text-sm text-gray-700 dark:text-gray-300">
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white">1. Acceptance of Terms</h3>
                <p className="mt-2 leading-relaxed">
                  By creating an account and using the EOTC Bible application, you agree to be bound by these Terms and Conditions.
                  If you do not agree to these Terms, please do not use this Service.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white">2. Description of Service</h3>
                <p className="mt-2 leading-relaxed">
                  EOTC Bible is a digital Bible platform providing access to Holy Scriptures in multiple languages including
                  Amharic, Ge&apos;ez, Tigrigna, and Oromiffa. Features include reading plans, bookmarks, highlights, notes,
                  and cross-device synchronization.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white">3. User Accounts</h3>
                <p className="mt-2 leading-relaxed">
                  You must provide accurate and complete registration information. You are responsible for maintaining the
                  security of your account and password. You must be at least 13 years old to use this Service.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white">4. User Conduct</h3>
                <p className="mt-2 leading-relaxed">
                  You agree not to use the Service for any unlawful purpose, to harass or harm others, to impersonate any
                  person or entity, or to interfere with the Service&apos;s functionality.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white">5. Intellectual Property</h3>
                <p className="mt-2 leading-relaxed">
                  The EOTC Bible application and its original content are protected by copyright and other intellectual property
                  laws. Bible translations are provided under appropriate licenses from their respective copyright holders.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white">6. Privacy</h3>
                <p className="mt-2 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use
                  your information.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white">7. Disclaimer of Warranties</h3>
                <p className="mt-2 leading-relaxed">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white">8. Limitation of Liability</h3>
                <p className="mt-2 leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE ETHIOPIAN ORTHODOX TEWAHEDO CHURCH SHALL NOT BE LIABLE FOR
                  ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white">9. Changes to Terms</h3>
                <p className="mt-2 leading-relaxed">
                  We reserve the right to modify these Terms at any time. Continued use of the Service after changes
                  constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-white">10. Contact Information</h3>
                <p className="mt-2 leading-relaxed">
                  For questions about these Terms, contact us at:{' '}
                  <a href="mailto:eotcopensource@gmail.com" className="text-red-700 underline dark:text-red-400">
                    eotcopensource@gmail.com
                  </a>
                </p>
              </section>

              <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-neutral-800">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Last updated: April 2026
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                  For the complete Terms and Conditions, please visit our website.
                </p>
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-3 border-t dark:border-neutral-800 px-6 py-4 shrink-0 bg-white dark:bg-neutral-900">
            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
            >
              Close
            </button>
            <a
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#621B1C] px-4 py-2 text-sm font-medium text-white hover:bg-[#491415]"
            >
              Read Full Terms
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  )
}
