"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/useUserStore"
import axios from "axios"
import { useForm, Controller } from "react-hook-form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

type OtpFormData = {
  otp: string
}

export default function VerifyOtpForm() {
  const router = useRouter()
  const { loadSession } = useAuthStore()

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const { control, handleSubmit, watch } = useForm<OtpFormData>({
    defaultValues: { otp: "" },
  })

  const otpValue = watch("otp")

  useEffect(() => {
    const savedEmail = window.localStorage.getItem("registeredEmail")
    const savedName = window.localStorage.getItem("registeredName")

    if (savedEmail) {
      setEmail(savedEmail)
    } else {
      router.push("/register")
    }

    if (savedName) {
      setName(savedName)
    }
  }, [router])

  const onSubmit = async (data: OtpFormData) => {
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const res = await axios.post(
        "/api/auth/verify-otp",
        { email, otp: data.otp },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      )

      await loadSession()

      // Clear stored values after success
      window.localStorage.removeItem("registeredEmail")
      window.localStorage.removeItem("registeredName")

      setSuccess("OTP verified successfully! Redirecting...")

      setTimeout(() => router.push("/dashboard"), 1000)
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Verification failed")
      } else {
        setError(err.message || "Verification failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!email || !name) {
      setError("Missing email or name information")
      return
    }

    setError(null)
    setSuccess(null)
    setResendLoading(true)

    try {
      await axios.post(
        "/api/auth/resend-otp",
        { email, name },
        { headers: { "Content-Type": "application/json" } }
      )
      setSuccess("New OTP sent to your email!")
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to resend OTP")
      } else {
        setError(err.message || "Failed to resend OTP")
      }
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="max-w-sm space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Verify Your Email</h2>
        <p className="text-sm text-gray-600">
          We’ve sent a verification code to your email: <span className="font-medium">{email} Be sure to check spams folder, and input the code down below.</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col items-center">
        <Controller
          control={control}
          name="otp"
          rules={{ required: true, minLength: 6, maxLength: 6 }}
          render={({ field }) => (
            <InputOTP maxLength={6} {...field}>
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          className="w-full bg-[#621B1C] text-white p-3 rounded-lg hover:bg-[#461314] cursor-pointer disabled:opacity-50"
          disabled={loading || otpValue.length !== 6}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendLoading}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer disabled:opacity-50"
        >
          {resendLoading ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  )
}
