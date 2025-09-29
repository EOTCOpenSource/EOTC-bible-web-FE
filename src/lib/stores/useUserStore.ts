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
  setUser: (user: User | null) => void;
  loadSession: () => Promise<void>;
  logout: () => void;
};

export const useUserStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  setUser: (user) => set({ user, isLoggedIn: !!user }),

  loadSession: async () => {
    try {
       const res = await axios.get("/api/auth/profile", { withCredentials: true });

      if (res.status !== 200) {
        if (res.status === 401) {
          set({ user: null, isLoggedIn: false });
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const userData = res.data;
      set({ user: userData.user, isLoggedIn: true });
    } catch (err) {
      console.error("Load session error:", err);
      set({ user: null, isLoggedIn: false });
    }
  },
  logout: () => {

    axios
      .post("/api/auth/logout", {}, { withCredentials: true })
      .catch((err) => console.error("Logout error:", err));
    set({ user: null, isLoggedIn: false });
  },
}));