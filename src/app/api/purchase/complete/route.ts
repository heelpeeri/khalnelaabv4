import { NextResponse, type NextRequest } from "next/server";
import { sendLicenseEmail } from "@/lib/email";
import { createLicenseCode, derivePurchaseId } from "@/lib/license";
import { LICENSE_COOKIE, LICENSE_COOKIE_OPTIONS } from "@/lib/licenseCookie";
import { fetchMoyasarPayment, isPaidPurchase } from "@/lib/payment";
import { getSiteOrigin } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.nextUrl.origin), 303);
}

export async function GET(request: NextRequest) {
  const paymentId = request.nextUrl.searchParams.get("id") ?? "";
  const from = request.nextUrl.searchParams.get("from");
  const failedPath =
    from === "restore" ? "/unlock?error=payment" : "/buy?error=payment";
  const secret = process.env.LICENSE_SECRET;

  if (!secret) {
    return redirectTo(request, "/buy?error=config");
  }

  const payment = await fetchMoyasarPayment(paymentId);

  if (!payment || !isPaidPurchase(payment)) {
    return redirectTo(request, failedPath);
  }

  const code = await createLicenseCode({
    type: "purchase",
    id: await derivePurchaseId(secret, payment.id),
    secret,
  });

  const email = payment.metadata?.email;

  if (email && from !== "restore") {
    await sendLicenseEmail({
      to: email,
      code,
      origin: getSiteOrigin(request.nextUrl.origin),
    });
  }

  const response = redirectTo(request, "/buy/success");
  response.cookies.set(LICENSE_COOKIE, code, LICENSE_COOKIE_OPTIONS);

  return response;
}
