import type { Metadata } from "next";
import BuyForm from "@/components/BuyForm";
import PageShell from "@/components/PageShell";
import { isEmailEnabled } from "@/lib/email";
import { safeNextPath } from "@/lib/licenseCookie";
import { PRICING, getCurrentPrice, toHalalas } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "اشترِ خل نلعب",
};

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  payment: "ما تمت عملية الدفع، وما انسحب منك شي. جرّب مرة ثانية.",
  config: "الدفع غير متاح الحين، جرّب بعد شوي.",
};

const FEATURES = [
  "ثمان ألعاب جماعية للجلسات",
  "جلسات بلا حد، العبها كل ما اجتمعتوا",
  "دفع مرة وحدة، بدون اشتراك",
  "أي محتوى جديد نضيفه يوصلك مجانًا",
];

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const price = getCurrentPrice();

  return (
    <PageShell title="خل نلعب كاملة">
      <section className="arcade-card p-5 text-center sm:p-7">
        <div className="flex items-baseline justify-center gap-3">
          {PRICING.onSale && (
            <span className="text-2xl font-black text-white/40 line-through">
              {PRICING.basePrice}
            </span>
          )}

          <span className="text-5xl font-black text-white">{price}</span>
          <span className="text-xl font-black text-white/70">ريال</span>
        </div>

        {PRICING.onSale && (
          <p className="mt-2 inline-block rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-1 text-sm font-black text-yellow-100">
            سعر الإطلاق لفترة محدودة
          </p>
        )}

        <ul className="mx-auto mt-5 max-w-sm space-y-2 text-right">
          {FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-base font-bold text-white/85"
            >
              <span aria-hidden="true" className="text-emerald-300">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {error && ERRORS[error] && (
        <p
          role="alert"
          className="mt-4 rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-center text-sm font-bold text-red-100"
        >
          {ERRORS[error]}
        </p>
      )}

      <BuyForm
        publishableKey={process.env.MOYASAR_PUBLISHABLE_KEY ?? ""}
        amount={toHalalas(price)}
        emailEnabled={isEmailEnabled()}
        next={safeNextPath(next)}
      />
    </PageShell>
  );
}
