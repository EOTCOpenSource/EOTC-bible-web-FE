"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import type { User } from "./types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string | null;

  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  loginWithGoogle: (googleToken: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;

  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    fetchCurrentUser: async () => {
      set({ isLoading: true });
      try {
        const res = await axios.get("/api/auth/profile", {
          withCredentials: true,
        });

        const user: User = res.data.user;
        set({ user, isAuthenticated: true, isLoading: false });
      } catch {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    },

    register: async ({ name, email, password }) => {
      set({ isLoading: true, error: null });
      try {
        await axios.post(
          "/api/auth/register",
          { name, email, password },
          { withCredentials: true }
        );

        await get().fetchCurrentUser();
      } catch (err: any) {
        set({ error: err?.response?.data?.error ?? "Registration failed" });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    login: async ({ email, password }) => {
      set({ isLoading: true, error: null });
      try {
        await axios.post(
          "/api/auth/login",
          { email, password },
          { withCredentials: true }
        );

        await get().fetchCurrentUser();
      } catch (err: any) {
        set({ error: err?.response?.data?.error ?? "Login failed" });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    loginWithGoogle: async (googleToken: string) => {
      set({ isLoading: true, error: null });
      try {
        await axios.post(
          "/api/auth/google",
          { token: googleToken },
          { withCredentials: true }
        );

        await get().fetchCurrentUser();
      } catch (err: any) {
        set({ error: err?.response?.data?.error ?? "Google login failed" });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    logout: async () => {
      try {
        await axios.post(
          "/api/auth/logout",
          {},
          { withCredentials: true }
        );
      } finally {
        set({ user: null, isAuthenticated: false, error: null });
      }
    },
  }))
);
