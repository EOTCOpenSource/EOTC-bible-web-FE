"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";

type ForgotPasswordForm = {
  email: string;
};

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState(""); 

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordForm>();

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");
  if (!domain || localPart.length < 3) return email; // return as-is if invalid or too short

  const start = localPart.slice(0, 2);
  const end = localPart.slice(-2);
  const masked = "*".repeat(Math.max(localPart.length - 4, 3)); // at least 3 asterisks

  return `${start}${masked}${end}@${domain}`;
}

  const sendEmail = async (email: string) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      if (res.data.success) {
        setEmailSent(true);
        setUserEmail(email); 
      }
    } catch (error: any) {
      console.error(error);
   
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: ForgotPasswordForm) => {
    await sendEmail(data.email);
    reset();
  };

  const handleResend = async () => {
    if (!userEmail) return;
    await sendEmail(userEmail);
  };

  const handleChangeEmail = () => {
    setEmailSent(false);    
    reset(); 
  };

  return (
    <section className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-gray-300 p-8 shadow-lg text-center">
        {!emailSent ? (
          <>
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-sm text-gray-700 mt-2">
              To reset your password, enter the email address you used to create the
              account
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col mt-4 gap-2"
            >
              <label
                htmlFor="email"
                className="text-gray-700 text-sm font-medium"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="border p-2 rounded focus:outline-none focus:ring-2"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-white py-3 my-6 bg-[#621B1C] hover:bg-[#4d1516] cursor-pointer rounded-lg disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send Email"}
              </Button>
            </form>

            <p className="text-gray-700 mt-4">
              Remembered password?{" "}
              <a href="/login" className="underline text-[#621B1C]">
                Login
              </a>
            </p>
          </>
        ) : (
          <>

            <h1 className="text-2xl font-bold">Email Sent</h1>
            <p className="text-sm text-gray-700 mt-2">
              We’ve sent you a password reset link to your email: <br />
              <strong>{maskEmail(userEmail)}</strong>.
              <br />
              (Be sure to check the spam folder)
            </p>
            
            <p className="mt-10 text-sm text-gray-700 font-bold">
              Didn’t receive the email?{" "}
              <button
                onClick={handleResend}
                disabled={isSubmitting}
                className="underline text-[#621B1C] ml-1 disabled:opacity-70"
              >
                {isSubmitting ? "Resending..." : "Resend email"}
              </button>
              <br />
              Wrong email address?{" "}
              <button
                onClick={handleChangeEmail}
                className="underline text-[#621B1C] ml-1"
              >
                Change email
              </button>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
