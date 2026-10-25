"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function UnlockForm({
  initialCode,
  next,
  paymentError,
}: {
  initialCode: string;
  next: string;
  paymentError: boolean;
}) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [paymentId, setPaymentId] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "invalid">("idle");
  const autoTried = useRef(false);

  async function activate(value: string) {
    if (!value.trim() || status === "checking") {
      return;
    }

    setStatus("checking");

    try {
      const response = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: value }),
      });

      if (response.ok) {
        router.replace(next);
        return;
      }
    } catch {}

    setStatus("invalid");
  }

  useEffect(() => {
    if (initialCode && !autoTried.current) {
      autoTried.current = true;
      void activate(initialCode);
    }
  });

  return (
    <div className="space-y-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void activate(code);
        }}
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5"
      >
        <label className="block text-right">
          <span className="text-base font-black text-white">كود التفعيل</span>

          <input
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              setStatus("idle");
            }}
            placeholder="KN-XXXX-XXXX-..."
            dir="ltr"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            maxLength={80}
            className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-black/25 px-4 text-center text-base font-black tracking-wide text-white outline-none placeholder:text-white/30 focus:border-cyan-300/60"
          />
        </label>

        {status === "invalid" && (
          <p
            role="alert"
            className="mt-2 text-center text-sm font-bold text-red-200"
          >
            الكود غير صحيح أو انتهت صلاحيته. تأكد منه وجرّب مرة ثانية.
          </p>
        )}

        <button
          type="submit"
          disabled={!code.trim() || status === "checking"}
          className="btn-primary mt-4 w-full py-3 text-lg"
        >
          {status === "checking" ? "لحظة..." : "فعّل اللعبة"}
        </button>
      </form>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          if (paymentId.trim()) {
            window.location.href = `/api/purchase/complete?from=restore&id=${encodeURIComponent(paymentId.trim())}`;
          }
        }}
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5"
      >
        <p className="text-base font-black text-white">ضيعت الكود؟</p>
        <p className="mt-1 text-sm font-bold text-white/60">
          اكتب رقم العملية اللي وصلك في إيصال ميسر، ونطلع لك الكود من جديد.
        </p>

        <input
          value={paymentId}
          onChange={(event) => setPaymentId(event.target.value)}
          placeholder="رقم العملية"
          dir="ltr"
          autoComplete="off"
          spellCheck={false}
          maxLength={64}
          className="mt-3 h-12 w-full rounded-xl border border-white/15 bg-black/25 px-4 text-center text-base font-bold text-white outline-none placeholder:text-white/30 focus:border-cyan-300/60"
        />

        {paymentError && (
          <p
            role="alert"
            className="mt-2 text-center text-sm font-bold text-red-200"
          >
            ما لقينا عملية دفع ناجحة بهذا الرقم.
          </p>
        )}

        <button
          type="submit"
          disabled={!paymentId.trim()}
          className="btn-secondary mt-3 w-full"
        >
          استرجع الكود
        </button>
      </form>

      <p className="text-center text-sm font-bold text-white/60">
        ما اشتريت للحين؟{" "}
        <Link href="/buy" className="text-cyan-200 underline">
          اشترِ اللعبة
        </Link>
      </p>
    </div>
  );
}
