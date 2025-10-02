"use client";

import type React from "react";
import { useUserStore } from "@/lib/stores/useUserStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const { loadSession } = useUserStore();
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setErr(null);
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (!res.data) {
        setErr("Empty response from server");
        return;
      }

      await loadSession();
      router.push("/dashboard");
    } catch (error: any) {
      if (error.response) {
        setErr(error.response.data?.error || "Login failed");
      } else {
        setErr(error.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1 min-w-md p-4">
      <h2 className="text-2xl font-semibold py-0 my-0">Welcome Back!</h2>
      <p className="text-sm text-gray-600 mb-4">
        Dont have an account yet?{" "}
        <a className="text-blue-500 underline" href="/register">
          Signup
        </a>
      </p>{" "}
      <div>
        <label htmlFor="email" className="text-sm text-gray-700">Email</label>
        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Email"
          id="email"
          type="email"
          {...register("email", { required: "Email is required" })}
        />
      </div>
      {errors.email && (
        <p className="text-red-600 text-sm">{errors.email.message}</p>
      )}
      <div>
        <label htmlFor="password" className="text-sm text-gray-700">Password</label>
        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Password"
          type="password"
          id="password"
          {...register("password", { required: "Password is required" })}
        />
      </div>
      {errors.password && (
        <p className="text-red-600 text-sm">{errors.password.message}</p>
      )}
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <div className="flex justify-between items-center my-3 text-gray-700">
        <div>
          <input type="checkbox" name="checkbox" id="checkbox" />
          <label htmlFor="checkbox"> Remember me</label>
        </div>
        <a href="" onClick={() => {
          router.push("/forgot-password")
        }} className="text-blue-500 underline">
          Forgot password?
        </a>
      </div>
      <button
        className="w-full bg-[#621B1C] text-white p-3 rounded-lg hover:bg-[#471314] cursor-pointer disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <div className="flex items-center gap-4 my-2">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-gray-500 text-sm">OR</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      <button
        className="w-full flex justify-center items-center gap-2 bg-[#c9c9c9] cursor-pointer text-gray-700 p-2 rounded-lg hover:bg-gray-400 disabled:bg-gray-400"
        disabled={loading}
      >
        <img
          className="w-[30px]"
          src="https://hackaday.com/wp-content/uploads/2016/08/google-g-logo.png"
          alt="google logo  image"
        />{" "}
        {loading ? "..." : "Continue with Google"}
      </button>
    </form>
  );
}
