"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

const MOYASAR_VERSION = "1.14.0";
const MOYASAR_CDN = `https://cdn.moyasar.com/mpf/${MOYASAR_VERSION}`;

type MoyasarGlobal = {
  init: (options: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    Moyasar?: MoyasarGlobal;
  }
}

export default function BuyForm({
  publishableKey,
  amount,
  emailEnabled,
  next,
}: {
  publishableKey: string;
  amount: number;
  emailEnabled: boolean;
  next: string;
}) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"details" | "pay">("details");
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);

  useEffect(() => {
    if (step !== "pay" || !scriptReady || !window.Moyasar) {
      return;
    }

    const origin = window.location.origin;
    const trimmedEmail = email.trim();

    window.Moyasar.init({
      element: ".mysr-form",
      amount,
      currency: "SAR",
      description: "خل نلعب - اللعبة كاملة",
      publishable_api_key: publishableKey,
      callback_url: `${origin}/api/purchase/complete`,
      methods: ["creditcard", "applepay"],
      apple_pay: {
        country: "SA",
        label: "خل نلعب",
        validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
      },
      language: "ar",
      metadata: trimmedEmail ? { email: trimmedEmail } : {},
    });
  }, [step, scriptReady, amount, publishableKey, email]);

  if (!publishableKey) {
    return (
      <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
        <p className="text-lg font-black text-white">الدفع قريبًا 🎮</p>
        <p className="mt-1 text-sm font-bold text-white/60">
          نجهز بوابة الدفع، ارجع لنا بعد شوي.
        </p>
        <UnlockLinks next={next} />
      </section>
    );
  }

  return (
    <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      {step === "details" ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setStep("pay");
          }}
        >
          {emailEnabled && (
            <label className="block text-right">
              <span className="text-sm font-black text-white/80">
                تبي نرسل لك الكود على إيميلك؟ (اختياري)
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                dir="ltr"
                maxLength={200}
                className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-black/25 px-4 text-center text-base font-bold text-white outline-none placeholder:text-white/30 focus:border-cyan-300/60"
              />

              <span className="mt-1 block text-xs font-bold text-white/45">
                نستخدمه بس لإرسال الكود، وما نحتفظ فيه.
              </span>
            </label>
          )}

          <button
            type="submit"
            className="btn-primary mt-4 w-full py-3 text-lg"
          >
            متابعة للدفع
          </button>
        </form>
      ) : (
        <>
          <link rel="stylesheet" href={`${MOYASAR_CDN}/moyasar.css`} />

          <Script
            src={`${MOYASAR_CDN}/moyasar.js`}
            strategy="afterInteractive"
            onReady={() => setScriptReady(true)}
            onError={() => setScriptFailed(true)}
          />

          {scriptFailed ? (
            <p className="text-center text-sm font-bold text-red-100">
              ما قدرنا نحمّل نموذج الدفع. تأكد من الاتصال وحدّث الصفحة.
            </p>
          ) : (
            <>
              {!scriptReady && (
                <p className="text-center text-sm font-bold text-white/60">
                  لحظة نجهز الدفع...
                </p>
              )}
              <div className="mysr-form" dir="ltr" />
            </>
          )}

          <button
            type="button"
            onClick={() => setStep("details")}
            className="btn-secondary mt-3 w-full"
          >
            رجوع
          </button>
        </>
      )}

      <p className="mt-3 text-center text-xs font-bold text-white/45">
        بالشراء أنت موافق على{" "}
        <Link href="/terms" className="underline">
          الشروط وسياسة الاسترجاع
        </Link>
        .
      </p>

      <UnlockLinks next={next} />
    </section>
  );
}

function UnlockLinks({ next }: { next?: string }) {
  const query = next && next !== "/" ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <p className="mt-3 text-center text-sm font-bold text-white/60">
      اشتريت قبل أو عندك كود؟{" "}
      <Link href={`/unlock${query}`} className="text-cyan-200 underline">
        فعّل من هنا
      </Link>
    </p>
  );
}
