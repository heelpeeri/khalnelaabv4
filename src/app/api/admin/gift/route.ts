import { NextResponse, type NextRequest } from "next/server";
import { createLicenseCode, randomId } from "@/lib/license";

export const dynamic = "force-dynamic";

async function sha256(text: string) {
  return new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)),
  );
}

async function passwordMatches(input: string, expected: string) {
  const [a, b] = await Promise.all([sha256(input), sha256(expected)]);
  let diff = 0;

  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }

  return diff === 0;
}

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const giftSecret = process.env.GIFT_SECRET;

  if (!adminPassword || !giftSecret) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as {
    password?: unknown;
    days?: unknown;
  } | null;

  const password = typeof body?.password === "string" ? body.password : "";

  if (!(await passwordMatches(password, adminPassword))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const days = Number(body?.days);
  const validDays =
    Number.isInteger(days) && days > 0 && days <= 3650 ? days : undefined;

  const code = await createLicenseCode({
    type: "gift",
    id: randomId(),
    secret: giftSecret,
    validDays,
  });

  return NextResponse.json({ ok: true, code, validDays: validDays ?? null });
}
