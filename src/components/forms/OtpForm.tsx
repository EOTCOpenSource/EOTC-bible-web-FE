"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/useUserStore"
import axios from "axios"
import { useForm, Controller } from "react-hook-form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import React from "react"

type OtpFormData = {
  otp: string
}

export default function OtpForm() {
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

  const maskEmail = (email: string) => {
    if (!email) return ""
    const [user, domain] = email.split("@")
    if (!domain) return email
    if (user.length <= 2) return email
    return `${user.substring(0, 2)}***${user.substring(user.length - 1)}@${domain}`
  }

  const onSubmit = async (data: OtpFormData) => {
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const otpToUse = data.otp

      await axios.post(
        "/api/auth/verify-otp",
        { email, otp: otpToUse },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      )

      await loadSession()
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

    <div className="w-full h-full flex flex-col justify-between items-center text-center gap-[10px]">
     
      <div className="flex flex-col gap-[10px]">
        <h2 className="text-[28px] font-semibold text-[#1F2937]">Verify your email</h2>
        <p className=" text-[16px] w-[330px] h-[65px] font-normal">
          We’ve sent a verification code to your email:{" "}
          <span className="font-bold">{maskEmail(email)}</span>. Be sure to
          check spam folder, and input the code down below.

        </p>
      </div>

      
      <div className="flex flex-col items-center gap-[10px]">
        <Controller
          control={control}
          name="otp"
          rules={{ required: true, minLength: 6, maxLength: 6 }}
          render={({ field }) => (
            <InputOTP maxLength={6} {...field} containerClassName="gap-[10px]">
              <InputOTPGroup className="gap-[10px]">
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} className="w-[60px] h-[60px] border border-gray-300 rounded-[8px]" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />
      </div>

      
      <div className="flex flex-col items-center w-full gap-[10px]">
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">{success}</p>}

        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-[#621B1C] text-white p-3 rounded-lg hover:bg-[#461314] cursor-pointer disabled:opacity-50"
          disabled={loading || otpValue.length !== 6}
          className={`w-full h-[48px] py-3 rounded-md text-white text-base font-medium transition-colors
            ${loading || otpValue.length !== 6 ? "bg-gray-300 cursor-not-allowed" : "bg-[#7B1D1D] hover:bg-[#5f1515] cursor-pointer"}`}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>


        <div className="text-center flex items-center justify-center gap-1">
          <p className="text-[14px] text-[#4B5563] pt-3">Didn’t receive the code?</p>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendLoading}
            className="text-[#7B1D1D] hover:underline text-sm font-medium disabled:opacity-50 cursor-pointer pt-3"
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>
        </div>

      </div>
    </div>
  )
}
