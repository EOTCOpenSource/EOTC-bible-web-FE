export const ENV = {
  backendBaseUrl: process.env.BACKEND_BASE_URL!,
  jwtCookieName: process.env.JWT_COOKIE_NAME ?? "auth_token",
};
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

