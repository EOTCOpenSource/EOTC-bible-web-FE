// store/uiStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createBrowserStorage } from "./storage";

type ModalKey = "search" | "settings" | "notes" | null;

interface UIState {
  theme: "light" | "dark" | "system";
  fontSize: "sm" | "md" | "lg";
  activeModal: ModalKey;
  isSidebarOpen: boolean;
  isNavMenuOpen: boolean;
  isNavSearchOpen: boolean;
  notifications: { id: string; message: string; createdAt: string }[];
  aboutScrollRef: HTMLDivElement | null;

  setTheme: (t: UIState["theme"]) => void;
  setFontSize: (s: UIState["fontSize"]) => void;
  openModal: (m: ModalKey) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  toggleNavMenu: () => void;
  toggleNavSearch: () => void;
  closeNavMenu: () => void;
  closeNavSearch: () => void;
  pushNotification: (message: string) => void;
  removeNotification: (id: string) => void;
  setAboutScrollRef: (ref: HTMLDivElement | null) => void;
  scrollAboutLeft: () => void;
  scrollAboutRight: () => void;
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
        isNavMenuOpen: false,
        isNavSearchOpen: false,
        notifications: [],
        aboutScrollRef: null,

        setTheme: (theme) => set({ theme }),
        setFontSize: (fontSize) => set({ fontSize }),
        openModal: (modal) => set({ activeModal: modal }),
        closeModal: () => set({ activeModal: null }),
        toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
        toggleNavMenu: () => set((s) => ({ isNavMenuOpen: !s.isNavMenuOpen })),
        toggleNavSearch: () =>
          set((s) => ({ isNavSearchOpen: !s.isNavSearchOpen })),
        closeNavMenu: () => set({ isNavMenuOpen: false }),
        closeNavSearch: () => set({ isNavSearchOpen: false }),
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
        setAboutScrollRef: (ref) => set({ aboutScrollRef: ref }),
        scrollAboutLeft: () => {
          const ref = get().aboutScrollRef;
          if (ref && ref.children[0]) {
            const cardWidth = ref.children[0].clientWidth;
            ref.scrollBy({ left: -cardWidth, behavior: "smooth" });
          }
        },
        scrollAboutRight: () => {
          const ref = get().aboutScrollRef;
          if (ref && ref.children[0]) {
            const cardWidth = ref.children[0].clientWidth;
            ref.scrollBy({ left: cardWidth, behavior: "smooth" });
          }
        },
      }),

      {
        name: "ui",
        storage: createBrowserStorage("eotc-"),
        partialize: (state) => ({
          theme: state.theme,
          fontSize: state.fontSize,
          isSidebarOpen: state.isSidebarOpen,
          // I explicitly specified these states because
          // I wanted to exclude the modal, notification,
          // and navbar states from persistence.
        }),
      }
    )
  )
);
