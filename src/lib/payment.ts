import { PRICING, isAcceptedAmount } from "@/lib/pricing";

export type MoyasarPayment = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string> | null;
};

export function isPaidPurchase(payment: MoyasarPayment) {
  return (
    payment.status === "paid" &&
    payment.currency === PRICING.currency &&
    isAcceptedAmount(payment.amount)
  );
}

export function isValidPaymentId(id: string) {
  return /^[A-Za-z0-9_-]{8,64}$/.test(id);
}

export async function fetchMoyasarPayment(
  id: string,
): Promise<MoyasarPayment | null> {
  const secretKey = process.env.MOYASAR_SECRET_KEY;

  if (!secretKey || !isValidPaymentId(id)) {
    return null;
  }

  const base = process.env.MOYASAR_API_BASE || "https://api.moyasar.com/v1";

  try {
    const response = await fetch(`${base}/payments/${encodeURIComponent(id)}`, {
      headers: {
        Authorization: `Basic ${btoa(`${secretKey}:`)}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as MoyasarPayment;
  } catch {
    return null;
  }
}
