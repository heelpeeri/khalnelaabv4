export const LICENSE_COOKIE = "kn_license";

export const LICENSE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365 * 10,
};

export function isPaywallEnabled() {
  return process.env.PAYWALL_ENABLED === "true";
}

export function safeNextPath(next: string | null | undefined) {
  return next && next.startsWith("/match") && !next.startsWith("//")
    ? next
    : "/match";
}
