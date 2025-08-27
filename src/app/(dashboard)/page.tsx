import { serverApiFetch } from "@/lib/server-fetch";
import type { UserProfile } from "@/types/api";

export default async function Dashboard() {
  const me = await serverApiFetch<UserProfile>("/api/profile"); // protected route requires Bearer token :contentReference[oaicite:8]{index=8}


    { me ? <main className="p-6 space-y-4">
      <h1 className="text-2xl text-amber-50 font-semibold">Welcome, {me.name}</h1>
      <div className="space-y-1">
        <p>Email: {me.email}</p>
        <p>Theme: {me.settings.theme}</p>
        <p>Font Size: {me.settings.fontSize}</p>
        <p>Streak: {me.streak.current} (Longest: {me.streak.longest})</p>
      </div>
      <form action="/api/auth/logout" method="POST">
        <button className="border px-3 py-2 rounded">Logout</button>
      </form>
    </main> : 
    <p>you are not authorized</p>  
  }

}
