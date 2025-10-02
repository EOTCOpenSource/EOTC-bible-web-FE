"use client";

import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { DotIcon, Eye, EyeOff } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const passwordValue = watch("password");

  // Password validation criteria
  const passwordCriteria = [
    {
      label: "At least 1 Uppercase letter",
      valid: /[A-Z]/.test(passwordValue || ""),
    },
    { label: "At least 1 Number", valid: /\d/.test(passwordValue || "") },
    {
      label: "At least 1 special character",
      valid: /[!@#$%^&*]/.test(passwordValue || ""),
    },
    { label: "Minimum 8 characters", valid: passwordValue?.length >= 8 },
  ];

  const onSubmit = async (data: FormData) => {
    setErr(null);
    setSuccess(null);

    if (data.password !== data.confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", data, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.data) {
        setErr("Empty response from server");
        return;
      }

      setSuccess(res.data.message || "Registration successful");
      reset();

      window.localStorage.setItem("registeredEmail", data.email);
      window.localStorage.setItem("registeredName", data.name);

      window.location.href = "/verify-otp";
    } catch (error: any) {
      if (error.response) {
        setErr(error.response.data?.error || "Registration failed");
      } else {
        setErr(error.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-2">
      <h2 className="text-3xl font-semibold py-0 my-0">Create an Account</h2>
      <p className="text-sm text-gray-600 mb-4">
        Already have an account?{" "}
        <a className="text-blue-500 underline" href="/login">
          Login
        </a>
      </p>
      <div>
        <label className="text-gray-700 text-sm" htmlFor="name">
          Full Name
        </label>
        <input
          className="w-full border p-2 rounded"
          placeholder="name"
          id="name"
          type="text"
          {...register("name", { required: "Name is required" })}
        />
      </div>
      {errors.name && (
        <p className="text-red-600 text-sm">{errors.name.message}</p>
      )}
      <div>
        <label className="text-gray-700 text-sm" htmlFor="email">
          Email
        </label>
        {/* Email Field */}
        <input
          className="w-full border p-2 rounded"
          placeholder="email"
          id="email"
          type="email"
          {...register("email", { required: "Email is required" })}
        />
      </div>
      {errors.email && (
        <p className="text-red-600 text-sm">{errors.email.message}</p>
      )}
      {/* Password Field */}
      <div className="space-y-2 md:flex items-baseline md:gap-2">
        <div className="flex-1">
          <label htmlFor="password" className="text-gray-700 text-sm">
            Password
          </label>
          <div className="relative">
            <input
              className="w-full border p-2 rounded"
              placeholder="Password"
              id="password"
              autoComplete="off"
              autoSave="off"
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
        </div>
        {/* Confirm Password Field */}
        <div className="flex-1">
          <label className="text-gray-700 text-sm" htmlFor="confirm-password">
            Confirm password
          </label>
          <div className="relative">
            <input
              className="w-full border p-2 rounded"
              placeholder="Confirm Password"
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Confirm Password is required",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5  text-gray-600 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>
      {/* Password criteria feedback */}
      <ul className="text-sm space-y-1 flex flex-wrap  items-center mb-2">
        {passwordCriteria.map((c, i) => (
          <li key={i} className={c.valid ? "text-green-600" : "text-gray-500"}>
            {/* {c.valid ? "✔" : "✖"} */}
            <DotIcon className="inline -mr-2" /> {c.label}
          </li>
        ))}
      </ul>
      {errors.confirmPassword && (
        <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
      )}
      {err && <p className="text-red-600 text-sm">{err}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      {/* i agree checkbox */}
      <div className="mb-3">
        <input type="checkbox" name="checkbox" id="checkbox" />
        <label className="text-sm " htmlFor="checkbox">
          {" "}
          i agree to the{" "}
        </label>{" "}
        <a href="#" className="text-sm text-red-900 underline">
          Terms & Conditions
        </a>
      </div>
      <button
        className="w-full bg-[#621B1C] cursor-pointer text-white p-2 rounded-lg hover:bg-[#491415] disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-gray-500 text-sm">OR</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      <button
        className="w-full flex justify-center items-center gap-2 bg-[#c9c9c9] cursor-pointer text-gray-700 p-1 rounded-lg hover:bg-gray-400 disabled:bg-gray-400"
        disabled={loading}
      >
       <img className="w-[30px]" src="https://hackaday.com/wp-content/uploads/2016/08/google-g-logo.png" alt="google logo  image" /> {loading ? "..." : "Continue with Google"}
      </button>
    </form>
  );
}
