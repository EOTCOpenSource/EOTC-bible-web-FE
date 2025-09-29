"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/stores/useUserStore";
import { useForm, Controller } from "react-hook-form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import axios from "axios";

type OtpFormData = { otp: string };

export default function OtpForm() {
  const router = useRouter();
  const { loadSession } = useUserStore();
  const [otpStatus, setOtpStatus] = useState<"idle" | "pending" | "verified" | "failed">("idle");
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const { control, handleSubmit, watch } = useForm<OtpFormData>({
    defaultValues: { otp: "" },
  });

  // handle key down
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // input refs
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const otpDigits = watch("otp").split("");
  const otpValue = watch("otp");

  useEffect(() => {
    const savedEmail = window.localStorage.getItem("registeredEmail");
    const savedName = window.localStorage.getItem("registeredName");

    if (savedEmail) setEmail(savedEmail);
    else router.push("/verify-otp");

    if (savedName) setName(savedName);
  }, [router]);

  
  useEffect(() => {
    if (otpStatus === "verified") {
      loadSession();
      window.localStorage.removeItem("registeredEmail");
      window.localStorage.removeItem("registeredName");
      setTimeout(() => router.push("/dashboard"), 1000);
    }
  }, [otpStatus, loadSession, router]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      setOtpStatus("pending");
      clearMessages();
      await axios.post(
        "/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true },
      );
      setOtpStatus("verified");
      setSuccess("OTP verified successfully");
    } catch (err: any) {
      setOtpStatus("failed");
      setError(err?.response?.data?.error ?? "OTP verification failed");
    }
  };

  const resendOtp = async (email: string, name: string) => {
    try {
      clearMessages();
      await axios.post(
        "/api/auth/resend-otp",
        { email, name },
        { withCredentials: true }
      );
      setSuccess("OTP resent successfully");
      startCountdown(60);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Failed to resend OTP");
    }
  };

  const startCountdown = (seconds: number) => {
    setOtpCountdown(seconds);
    const interval = setInterval(() => {
      setOtpCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const onSubmit = async (data: OtpFormData) => {
    await verifyOtp(email, data.otp);
  };

  const handleResendOtp = async () => {
    await resendOtp(email, name);
  };

  const maskEmail = (email: string) => {
    if (!email) return "";
    const [user, domain] = email.split("@");
    if (!domain) return email;
    if (user.length <= 2) return email;
    return `${user.substring(0, 2)}***${user.substring(user.length - 1)}@${domain}`;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center text-center gap-[10px]">
      <div className="flex flex-col gap-[10px]">
        <h2 className="text-[28px] font-semibold text-[#1F2937]">Verify your email</h2>
        <p className="text-[16px] w-[330px] h-[65px] font-normal">
          We&apos;ve sent a verification code to your email:{" "}
          <span className="font-bold">{maskEmail(email)}</span>. Be sure to check spam folder, and input the code down below.
        </p>
      </div>

      
      <div className="flex flex-col items-center gap-[10px]">
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
                      className="w-[60px] h-[60px] border border-gray-300 rounded-[8px]"
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
        </form>
      </div>

      
      <div className="flex flex-col items-center w-full gap-[10px]">
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">{success}</p>}

        <button
          type="submit"
          disabled={otpStatus === "pending" || otpValue.length !== 6}
          className={`w-full h-[48px] py-3 rounded-md text-white text-base font-medium transition-colors
            ${
              otpStatus === "pending" || otpValue.length !== 6
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#7B1D1D] hover:bg-[#5f1515] cursor-pointer"
            }`}
        >
          {otpStatus === "pending" ? "Verifying..." : "Verify Code"}
        </button>

        
        <div className="text-center flex items-center justify-center gap-1 pt-3">
          {otpCountdown > 0 ? (
            <p className="text-[14px] text-[#4B5563]">
              Resend available in <span className="font-semibold text-[#7B1D1D]">{otpCountdown}s</span>
            </p>
          ) : (
            <>
              <p className="text-[14px] text-[#4B5563]">Didn&apos;t receive the code?</p>
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-[#7B1D1D] hover:underline text-sm font-medium cursor-pointer"
              >
                Resend OTP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
