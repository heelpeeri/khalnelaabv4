"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

const DURATIONS = [
  { days: 0, label: "بدون انتهاء" },
  { days: 7, label: "أسبوع" },
  { days: 30, label: "شهر" },
];

export default function GiftCodeForm() {
  const [password, setPassword] = useState("");
  const [days, setDays] = useState(0);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setError("");
    setCode("");

    try {
      const response = await fetch("/api/admin/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, days }),
      });

      const data = (await response.json().catch(() => null)) as {
        code?: string;
      } | null;

      if (response.ok && data?.code) {
        setCode(data.code);
      } else if (response.status === 401) {
        setError("كلمة المرور غلط.");
      } else {
        setError("أكواد الهدايا غير مفعلة. تأكد من الإعدادات في Vercel.");
      }
    } catch {
      setError("صار خطأ، جرّب مرة ثانية.");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void generate();
      }}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5"
    >
      <label className="block text-right">
        <span className="text-sm font-black text-white/80">كلمة المرور</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-black/25 px-4 text-center text-base font-bold text-white outline-none focus:border-cyan-300/60"
        />
      </label>

      <fieldset>
        <legend className="text-sm font-black text-white/80">مدة الكود</legend>

        <div className="mt-2 grid grid-cols-3 gap-2">
          {DURATIONS.map((option) => (
            <button
              key={option.days}
              type="button"
              aria-pressed={days === option.days}
              onClick={() => setDays(option.days)}
              className={`h-11 rounded-xl border text-sm font-black transition-colors ${
                days === option.days
                  ? "border-cyan-200/70 bg-cyan-400/25 text-cyan-50"
                  : "border-white/10 bg-white/[0.04] text-white/60"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={!password || loading}
        className="btn-primary w-full py-3 text-lg"
      >
        {loading ? "لحظة..." : "طلّع كود هدية"}
      </button>

      {error && (
        <p role="alert" className="text-center text-sm font-bold text-red-200">
          {error}
        </p>
      )}

      {code && (
        <div className="space-y-2 text-center">
          <p
            dir="ltr"
            className="select-all break-words rounded-xl border border-cyan-300/30 bg-black/30 px-3 py-3 text-lg font-black tracking-wide text-cyan-100"
          >
            {code}
          </p>
          <CopyButton text={code} />
          <p className="text-xs font-bold text-white/50">
            أرسله للشخص، ويفعّله من صفحة «عندي كود».
          </p>
        </div>
      )}
    </form>
  );
}
