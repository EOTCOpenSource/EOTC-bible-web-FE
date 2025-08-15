"use server";

import { cookies } from "next/headers";
import { ENV } from "./env";

export async function getTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(ENV.jwtCookieName)?.value ?? null;
}
