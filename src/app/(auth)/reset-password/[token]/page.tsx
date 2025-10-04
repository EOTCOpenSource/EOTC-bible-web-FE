"use client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

type ResetPasswordForm = {
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordForm>();

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await axios.post("/api/auth/reset-password", {
        token,
        ...data,
      });

      setMessage(res.data.message);

      if (res.data.success) {
        reset(); // clear the form
        setTimeout(() => router.push("/login"), 600);
      }
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message || "Something went wrong, try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-gray-300 p-8 shadow-lg">
        <h1 className="text-2xl text-center font-bold">Create a new password</h1>
        <p className="text-center text-sm text-gray-700">
          Please enter a new password for your EOTCBible account.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
          {/* 🔹 New Password */}
          <div className="flex flex-col">
            <label
              htmlFor="newPassword"
              className="text-gray-700 m-0 p-0 text-sm"
            >
              New password
            </label>
            <Input
              type="password"
              id="newPassword"
              className="border border-gray-500 p-2 rounded"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.newPassword && (
              <p className="text-red-600 text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* 🔹 Confirm Password */}
          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="text-gray-700 m-0 p-0 text-sm"
            >
              Confirm password
            </label>
            <Input
              type="password"
              id="confirmPassword"
              className="border p-2 rounded"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (val) =>
                  val === watch("newPassword") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {/* //////////   check the password stregth and show same ui with "/register" page   ////////// */}
          {/* //////////   list password criterias here (you can copy the "register" page logic)   ////////// */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#621B1C] text-white py-2 rounded disabled:opacity-70"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.toLowerCase().includes("successful")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
