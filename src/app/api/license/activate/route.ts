import { NextResponse, type NextRequest } from "next/server";
import { getLicenseSecrets, verifyLicenseCode } from "@/lib/license";
import { LICENSE_COOKIE, LICENSE_COOKIE_OPTIONS } from "@/lib/licenseCookie";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    code?: unknown;
  } | null;

  const code = typeof body?.code === "string" ? body.code.slice(0, 80) : "";
  const check = await verifyLicenseCode(code, getLicenseSecrets());

  if (!check.valid) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(LICENSE_COOKIE, code.trim().toUpperCase(), {
    ...LICENSE_COOKIE_OPTIONS,
    ...(check.expiresAt
      ? {
          maxAge: Math.max(
            60,
            Math.floor((check.expiresAt.getTime() - Date.now()) / 1000),
          ),
        }
      : {}),
  });

  return response;
}
