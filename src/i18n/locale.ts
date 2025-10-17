
import { cookies } from "next/headers";

const SUPPORTED_LOCALES = ["en", "am",] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export async function getLocaleFromCookie(): Promise<"en" | "am"> {
  const cookieStore = cookies();
  const cookieLocale =  (await cookieStore).get("NEXT_LOCALE")?.value;

  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  return "en";
}

