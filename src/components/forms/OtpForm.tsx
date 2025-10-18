'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/stores/useUserStore'
import { useForm, Controller } from 'react-hook-form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

type OtpFormData = { otp: string }

export default function OtpForm() {
  const t = useTranslations('Auth.verify')
  const router = useRouter()
  const { loadSession } = useUserStore()

  const { otpStatus, otpCountdown, error, success, verifyOtp, resendOtp, startCountdown } =
    useAuthStore()

  const { control, handleSubmit, watch } = useForm<OtpFormData>({
    defaultValues: { otp: '' },
  })

  const otpValue = watch('otp')
  const inputRefs = useRef<HTMLInputElement[]>([])

  const [clientEmail, setClientEmail] = useState('')
  const [clientName, setClientName] = useState('')

  useEffect(() => {
    const storedEmail = localStorage.getItem('registeredEmail') || ''
    const storedName = localStorage.getItem('registeredName') || ''
    setClientEmail(storedEmail)
    setClientName(storedName)
    // if(clientEmail === "") {
    //   router.push("/register");
    // }
  }, [])
  useEffect(() => {
    if (otpStatus === 'verified') {
      loadSession()
      localStorage.removeItem('registeredEmail')
      localStorage.removeItem('registeredName')
      setTimeout(() => router.push('/dashboard'), 1000)
    }
  }, [otpStatus, loadSession, router])

   useEffect(() => {
      if (success) toast.success(success)
      if (error) toast.error(error)
    }, [success, error])
  
  const onSubmit = async (data: OtpFormData) => {
    await verifyOtp(clientEmail, data.otp)
  }

  const handleResendOtp = async () => {
    await resendOtp(clientEmail, clientName)
    startCountdown(60)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const maskEmail = (email: string) => {
    if (!email) return ''
    const [user, domain] = email.split('@')
    if (!domain) return email
    if (user.length <= 2) return email
    return `${user.substring(0, 2)}***${user.substring(user.length - 1)}@${domain}`
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-[10px] text-center">
      <div className="flex flex-col gap-[10px]">
        <h2 className="text-3xl font-semibold text-[#1F2937]">{t('title')}</h2>
        <p className="text-md h-[65px] w-[330px] font-normal">
          {t('subtitle')}{' '}
          <span className="font-bold">{clientEmail ? maskEmail(clientEmail) : ''}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-[10px]">
        <Controller
          control={control}
          name="otp"
          rules={{ required: true, minLength: 6, maxLength: 6 }}
          render={({ field }) => (
            <InputOTP maxLength={6} {...field} containerClassName="gap-[10px]">
              <InputOTPGroup className="gap-[10px]">
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="h-[60px] w-[60px] rounded-[8px] border border-gray-300"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, i)}
                    ref={(el) => {
                      inputRefs.current[i] = el as HTMLInputElement
                    }}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        
        <button
          type="submit"
          disabled={otpStatus === 'pending' || otpValue.length !== 6}
          className={`h-[48px] w-full rounded-md py-3 text-base font-medium text-white transition-colors ${
            otpStatus === 'pending' || otpValue.length !== 6
              ? 'cursor-not-allowed bg-gray-300'
              : 'cursor-pointer bg-[#7B1D1D] hover:bg-[#5f1515]'
          }`}
        >
          {otpStatus === 'pending' ? t('loading') : t('buttons.verify')}
        </button>
      </form>

      <div className="flex items-center justify-center gap-1 pt-3 text-center">
        {otpCountdown > 0 ? (
          <p className="text-[14px] text-[#4B5563]">
            {t('resendCountdown', { seconds: otpCountdown })}
          </p>
        ) : (
          <>
            <p className="text-[14px] text-[#4B5563]">{t('didNotReceive')}</p>
            <button
              type="button"
              onClick={handleResendOtp}
              className="cursor-pointer text-sm font-medium text-[#7B1D1D] hover:underline"
            >
              {t('buttons.resend')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
