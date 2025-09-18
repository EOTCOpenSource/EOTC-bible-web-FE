"use client"

import { useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterForm() {
  const [err, setErr] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setErr(null)
    setSuccess(null)

    if (data.password !== data.confirmPassword) {
      setErr("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const res = await axios.post("/api/auth/register", data, {
        headers: { "Content-Type": "application/json" },
      })

      if (!res.data) {
        setErr("Empty response from server")
        return
      }

      setSuccess(res.data.message || "Registration successful")

      // Reset form values
      reset()

      // Store email & name for OTP verification
      window.localStorage.setItem("registeredEmail", data.email)
      window.localStorage.setItem("registeredName", data.name)

      // Redirect to OTP verification
      window.location.href = "/verify-otp"
    } catch (error: any) {
      if (error.response) {
        setErr(error.response.data?.error || "Registration failed")
      } else {
        setErr(error.message || "Registration failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm space-y-4">
      <input
        className="w-full border p-2 rounded"
        placeholder="Name"
        type="text"
        {...register("name", { required: "Name is required" })}
      />
      {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        type="email"
        {...register("email", { required: "Email is required" })}
      />
      {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

      <input
        className="w-full border p-2 rounded"
        placeholder="Password"
        type="password"
        {...register("password", { required: "Password is required" })}
      />
      {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}

      <input
        className="w-full border p-2 rounded"
        placeholder="Confirm Password"
        type="password"
        {...register("confirmPassword", { required: "Confirm Password is required" })}
      />
      {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>}

      <p>
        you already have an account?{" "}
        <a className="text-blue-500" href="/login">
          Login
        </a>
      </p>

      {err && <p className="text-red-600 text-sm">{err}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <button className="w-full border p-2 rounded" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  )
}
