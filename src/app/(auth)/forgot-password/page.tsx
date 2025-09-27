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
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await axios.post("/api/auth/forgot-password", data);
      setMessage(res.data.message);
      reset(); // clear the form after success
      if (res.data.success) {
        //////  navigate to the next page (to announce the user that the email has been sent) that is not separate page actually. you can overlay here.  //////
        ///See the design here...  https://www.figma.com/design/Wvg2S3xylwA5NJbpRvBurN/Bible-web--APP?node-id=1023-678&t=misqSZlmBoJIGKXq-4  ///
      }
    } catch (error: any) {
      console.error(error);
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
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <p className="text-center text-sm text-gray-700">
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

          {message && (
            <p
              className={`mt-2 text-sm ${
                message.toLowerCase().includes("sent")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="text-white py-3 my-6 bg-[#621B1C] hover:bg-[#4d1516] cursor-pointer rounded-lg disabled:opacity-70"
          >
            {isSubmitting ? "Sending..." : "Send Email"}
          </Button>
        </form>

        <p className="text-center text-gray-700">
          Remembered password?{" "}
          <a href="/login" className="underline text-[#621B1C]">
            Login
          </a>
        </p>
      </div>
    </section>
  );
}
