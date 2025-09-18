"use client"

import type React from "react"
import { useAuthStore } from "@/lib/stores/useUserStore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"

type FormData = {
  email: string
  password: string
}

export default function LoginForm() {
  const { loadSession } = useAuthStore()
  const router = useRouter()
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setErr(null)
    setLoading(true)

    try {
      const res = await axios.post("/api/auth/login", data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })

      if (!res.data) {
        setErr("Empty response from server")
        return
      }

      await loadSession()
      router.push("/dashboard")
    } catch (error: any) {
      if (error.response) {
        setErr(error.response.data?.error || "Login failed")
      } else {
        setErr(error.message || "Login failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm space-y-4">
      <input
        className="w-full border p-3 rounded-lg"
        placeholder="Email"
        type="email"
        {...register("email", { required: "Email is required" })}
      />
      {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

      <input
        className="w-full border p-3 rounded-lg"
        placeholder="Password"
        type="password"
        {...register("password", { required: "Password is required" })}
      />
      {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}

      <p>
        you don't have account yet?{" "}
        <a className="inline text-blue-500" href="/register">
          register
        </a>
      </p>

      {err && <p className="text-red-600 text-sm">{err}</p>}

      <button
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  )
}
