"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/useUserStore";

export default function Navbar() {
  const { user, isLoggedIn, loadSession, logout } = useAuthStore();

  useEffect(() => {
    loadSession(); // hydrate on mount
  }, [loadSession]);
isLoggedIn
  return (
    <nav className="flex justify-between p-4 border-b">
      <span className="font-bold">Bible App</span>
      {isLoggedIn ? (
        <span>Hi, {user?.name}</span>
      ) : (
        <a href="/login" className="text-blue-500">Login</a>
      )}
    </nav>
  );
}
