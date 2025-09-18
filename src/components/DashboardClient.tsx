"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/useUserStore";
import type { UserProfile } from "@/types/api";
import { ENV } from "@/lib/env";
import axios from "axios";
import LogoutButton from "./LogoutButton";
import DeleteAccoutButton from "./DeleteAccountButton";

interface DashboardClientProps {
  initialUser: UserProfile | null;
}

export default function DashboardClient({ initialUser }: DashboardClientProps) {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser, setUser]);

  const displayUser = user || initialUser;

  if (!displayUser) {
    return (
      <main className="p-6">
        <div className="text-center">
          <p className="text-gray-600">
            You are not authorized to view this page.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={() => {
              // Clear the auth cookie
              document.cookie = `${ENV.jwtCookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
              // Redirect to login page
              window.location.href = "/register";
            }}
            className="bg-blue-600 text-white px-4 py-2 m-4 rounded-lg hover:bg-blue-700"
          >
            Register
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Welcome, {displayUser.name}</h1>
        <div className="space-x-4">
          <LogoutButton />
          <DeleteAccoutButton />
        </div>
      </div>

      <div className="bg-black rounded-lg p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-medium">Profile Information</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Email:</span> {displayUser.email}
          </p>
          {displayUser.settings && (
            <>
              <p>
                <span className="font-medium">Theme:</span>{" "}
                {displayUser.settings.theme}
              </p>
              <p>
                <span className="font-medium">Font Size:</span>{" "}
                {displayUser.settings.fontSize}
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
