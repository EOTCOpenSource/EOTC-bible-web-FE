// import { serverApiFetch } from "@/lib/server-fetch"
import type { UserProfile } from "@/types/api";
import DashboardClient from "@/components/DashboardClient";
import { ENV } from "@/lib/env";
import { cookies } from "next/headers";
import axios from "axios";
export default async function Dashboard() {
  let me: UserProfile | null = null;
  let error: string | null = null;

  const cookieStore = await cookies();

  try {
    // Import axios at the top of your file: import axios from "axios";
    const res = await axios.get(`${ENV.backendBaseUrl}/auth/profile`, {
      headers: {
      Authorization: `Bearer ${cookieStore.get("token")?.value}`,
      },
      validateStatus: () => true, // allow handling non-2xx status manually
    });

    if (res.status < 200 || res.status >= 300) {
      if (res.status === 401) {
        error = "Unauthorized";
        return;
      }
      throw new Error(`HTTP ${res.status}`);
    }

    const userData = res.data;
    me = userData.data.user;
  } catch (err: any) {
    error = err.message;
  }
 ///////////////// Handle configuration error in development//////////////////
  if (error && error.includes("Configuration error") && ENV.node_env === "development") {
    return (
      <main className="p-6 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h1 className="text-xl font-semibold text-yellow-800 mb-2">
            ⚠️ Configuration Required
          </h1>
          <p className="text-yellow-700 mb-4">
            Your backend API is not configured yet. To use this app, you need
            to:
          </p>
          <ol className="list-decimal list-inside text-yellow-700 space-y-2 mb-4">
            <li>Set up your backend API server</li>
            <li>
              Go to <strong>Project Settings</strong> (gear icon in top right)
            </li>
            <li>
              Add environment variable:{" "}
              <code className="bg-yellow-100 px-2 py-1 rounded">
                BACKEND_BASE_URL
              </code>
            </li>
            <li>
              Set it to your backend URL (e.g.,{" "}
              <code className="bg-yellow-100 px-2 py-1 rounded">
                https://your-api.com
              </code>
              )
            </li>
          </ol>
          <p className="text-sm text-yellow-600">
            Once configured, refresh the page to continue.
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h1 className="text-xl font-semibold text-red-800 mb-2">❌ Error</h1>
          <p className="text-red-700">{error}</p>
        </div>
       
      </main>
    );
  }

  return <DashboardClient initialUser={me} />;
}
