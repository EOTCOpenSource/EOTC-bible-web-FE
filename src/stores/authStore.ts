import { create } from "zustand";
import { devtools } from "zustand/middleware";
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
      try {
        set({ isLoading: true });
        const res = await fetch("https://mylocalbackend/api/v1/auth/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        const user: User = {
          id: data.id,
          name: data.name,
          email: data.email,
        };

        set({ user, isAuthenticated: true, isLoading: false });
      } catch {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    },

    register: async ({ name, email, password }) => {
      set({ isLoading: true, error: null });
      try {
        const res = await fetch("https://mylocalbackend/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
          credentials: "include",
        });

        if (!res.ok) throw new Error("Registration failed");

        await get().fetchCurrentUser();
      } catch (err: any) {
        set({ error: err?.message ?? "Registration failed" });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    login: async ({ email, password }) => {
      set({ isLoading: true, error: null });
      try {
        const res = await fetch("https://mylocalbackend/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });

        if (!res.ok) throw new Error("Invalid credentials");

        await get().fetchCurrentUser();
      } catch (err: any) {
        set({ error: err?.message ?? "Login failed" });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    loginWithGoogle: async (googleToken: string) => {
      set({ isLoading: true, error: null });
      try {
        const res = await fetch("https://mylocalbackend/api/v1/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: googleToken }),
          credentials: "include",
        });

        if (!res.ok) throw new Error("Google authentication failed");

        await get().fetchCurrentUser();
      } catch (err: any) {
        set({ error: err?.message ?? "Google login failed" });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    logout: async () => {
      try {
        await fetch("https://mylocalbackend/api/v1/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } finally {
        set({ user: null, isAuthenticated: false, error: null });
      }
    },
  }))
);
