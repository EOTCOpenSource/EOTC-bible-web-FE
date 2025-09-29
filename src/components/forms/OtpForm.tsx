"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/useUserStore";
import { useForm, Controller } from "react-hook-form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type OtpFormData = { otp: string };

export default function OtpForm() {
  const router = useRouter();
  const { verifyOtp,
          resendOtp,
        startCountdown,
        loadSession,
        otpStatus,
        otpCountdown,
        error,
        success,
        clearMessages } =
    useAuthStore();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const { control, handleSubmit, watch } = useForm<OtpFormData>({
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp");

  useEffect(() => {
    const savedEmail = window.localStorage.getItem("registeredEmail");
    const savedName = window.localStorage.getItem("registeredName");

    if (savedEmail) setEmail(savedEmail);
    else router.push("/verify-otp");

    if (savedName) setName(savedName);
  }, [router]);

  // redirect after success
  useEffect(() => {
    if (otpStatus === "verified") {
      loadSession();
      window.localStorage.removeItem("registeredEmail");
      window.localStorage.removeItem("registeredName");
      setTimeout(() => router.push("/dashboard"), 1000);
    }
  }, [otpStatus, loadSession, router]);

  const onSubmit = async (data: OtpFormData) => {
    clearMessages();
    await verifyOtp(email, data.otp);
  };

  const handleResendOtp = async () => {
    clearMessages();
    await resendOtp(email, name);
    startCountdown(60);
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
          We've sent a verification code to your email:{" "}
          <span className="font-bold">{maskEmail(email)}</span>. Be sure to check spam folder, and input the code down below.
        </p>
      </div>

      {/* OTP input */}
      <div className="flex flex-col items-center gap-[10px]">
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
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col items-center w-full gap-[10px]">
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">{success}</p>}

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
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

        {/* Countdown + Resend */}
        <div className="text-center flex items-center justify-center gap-1 pt-3">
          {otpCountdown > 0 ? (
            <p className="text-[14px] text-[#4B5563]">
              Resend available in <span className="font-semibold text-[#7B1D1D]">{otpCountdown}s</span>
            </p>
          ) : (
            <>
              <p className="text-[14px] text-[#4B5563]">Didn't receive the code?</p>
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