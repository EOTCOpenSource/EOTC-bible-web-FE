import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createBrowserStorage } from "./storage";

type ModalKey = "search" | "settings" | "notes" | null;

interface UIState {
  theme: "light" | "dark" | "system";
  fontSize: "sm" | "md" | "lg";
  activeModal: ModalKey;
  isSidebarOpen: boolean;
  notifications: { id: string; message: string; createdAt: string }[];

  setTheme: (t: UIState["theme"]) => void;
  setFontSize: (s: UIState["fontSize"]) => void;
  openModal: (m: ModalKey) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  pushNotification: (message: string) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        //I WILL IMPLEMENT THE GET HELPER ON DEMAND HERE AS WELL
        theme: "system",
        fontSize: "md",
        activeModal: null,
        isSidebarOpen: false,
        notifications: [],

        setTheme: (theme) => set({ theme }),
        setFontSize: (fontSize) => set({ fontSize }),
        openModal: (modal) => set({ activeModal: modal }),
        closeModal: () => set({ activeModal: null }),
        toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
        pushNotification: (message) => {
          const id =
            crypto.randomUUID?.() || Math.random().toString(36).slice(2, 9);
          set((s) => ({
            notifications: [
              ...s.notifications,
              { id, message, createdAt: new Date().toISOString() },
            ],
          }));
        },
        removeNotification: (id) =>
          set((s) => ({
            notifications: s.notifications.filter((n) => n.id !== id),
          })),
      }),
      {
        name: "ui",
        storage: createBrowserStorage("eotc-"),
      }
    )
  )
);
