"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/stores/useUserStore";
import { useForm, Controller } from "react-hook-form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuthStore } from "@/stores/authStore";

type OtpFormData = { otp: string };

export default function OtpForm() {
  const router = useRouter();
  const { loadSession } = useUserStore();

  const {
    otpStatus,
    otpCountdown,
    error,
    success,
    verifyOtp,
    resendOtp,
    startCountdown,
  } = useAuthStore();

  const { control, handleSubmit, watch } = useForm<OtpFormData>({
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp");
  const inputRefs = useRef<HTMLInputElement[]>([]);


  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("registeredEmail") || "";
    const storedName = localStorage.getItem("registeredName") || "";
    setClientEmail(storedEmail);
    setClientName(storedName);
  }, []);

  useEffect(() => {
    if (otpStatus === "verified") {
      loadSession();
      localStorage.removeItem("registeredEmail");
      localStorage.removeItem("registeredName");
      setTimeout(() => router.push("/dashboard"), 1000);
    }
  }, [otpStatus, loadSession, router]);

  const onSubmit = async (data: OtpFormData) => {
    await verifyOtp(clientEmail, data.otp);
  };

  const handleResendOtp = async () => {
    await resendOtp(clientEmail, clientName);
    startCountdown(60);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpValue[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
          <span className="font-bold">
            {clientEmail ? maskEmail(clientEmail) : ""}
          </span>. Be sure to check spam folder, and input the code down below.
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
                    className="w-[60px] h-[60px] border border-gray-300 rounded-[8px]"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, i)}
                    ref={(el) => {
                      inputRefs.current[i] = el as HTMLInputElement;
                    }}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />

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
      </form>

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
  );
}
