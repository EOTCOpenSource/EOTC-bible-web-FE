import { create } from "zustand";
import axios from "axios";

type User = {
  id: string;
  email: string;
  name?: string;
  settings?: {
    theme: "light" | "dark";
    fontSize: number;
  };
};

type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
  otpStatus: "idle" | "pending" | "verified" | "failed";
  otpCountdown: number;
  error: string | null;
  success: string | null;

  setUser: (user: User | null) => void;
  loadSession: () => Promise<void>;
  logout: () => void;

  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string, name: string) => Promise<void>;
  startCountdown: (seconds: number) => void;
  clearMessages: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  otpStatus: "idle",
  otpCountdown: 0,
  error: null,
  success: null,

  setUser: (user) => set({ user, isLoggedIn: !!user }),

  loadSession: async () => {
    try {
      const res = await axios.get("/api/auth/profile", { withCredentials: true });
      if (res.status === 200) {
        set({ user: res.data.user, isLoggedIn: true });
      }
    } catch (err) {
      set({ user: null, isLoggedIn: false }, err as any);
    }
  },

  logout: () => {
    axios.post("/api/auth/logout", {}, { withCredentials: true }).catch(() => {});
    set({ user: null, isLoggedIn: false });
  },

  verifyOtp: async (email, otp) => {
    set({ otpStatus: "pending", error: null, success: null });
    try {
      const res = await axios.post(
        "/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true }
      );
      set({
        user: res.data.user,
        isLoggedIn: true,
        otpStatus: "verified",
        success: "OTP verified successfully!",
      });
    } catch (err: any) {
      set({
        otpStatus: "failed",
        error: err.response?.data?.message || "Verification failed",
      });
    }
  },

  resendOtp: async (email, name) => {
    set({ error: null, success: null });
    try {
      await axios.post("/api/auth/resend-otp", { email, name });
      set({ success: "New OTP sent to your email!" });
    } catch (err: any) {
      set({
        error: err.response?.data?.error || "Failed to resend OTP",
      });
    }
  },

  startCountdown: (seconds) => {
    set({ otpCountdown: seconds });
    const interval = setInterval(() => {
      set((state) => {
        if (state.otpCountdown <= 1) {
          clearInterval(interval);
          return { otpCountdown: 0 };
        }
        return { otpCountdown: state.otpCountdown - 1 };
      });
    }, 1000);
  },

  clearMessages: () => set({ error: null, success: null }),
}));
