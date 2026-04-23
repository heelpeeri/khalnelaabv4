"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Copy, Play } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

export default function RoomPage() {
  const params = useParams<{ roomId: string }>();
  const searchParams = useSearchParams();
  const game = searchParams.get("game") ?? "word";
  const name = searchParams.get("name") ?? "لاعب";

  const roomUrl = typeof window !== "undefined" ? window.location.href : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(roomUrl);
      alert("تم نسخ رابط الغرفة");
    } catch {
      alert("انسخ الرابط يدويًا");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <GlassCard className="w-full max-w-2xl p-8">
        <Logo size={100} />
        <h1 className="mt-4 text-center text-3xl font-black">غرفة اللعب</h1>
        <p className="mt-2 text-center text-white/80">مرحبًا {name}، هذا رقم غرفتك: {params.roomId}</p>

        <div className="mt-8 rounded-3xl border border-white/20 bg-white/10 p-4">
          <p className="text-sm text-white/70">رابط الغرفة</p>
          <div className="mt-2 break-all rounded-2xl bg-black/10 p-3 text-sm">{roomUrl || "سيظهر بعد النشر"}</div>
          <button onClick={copyLink} className="btn-secondary mt-4 inline-flex items-center gap-2">
            <Copy className="h-4 w-4" />
            نسخ الرابط
          </button>
        </div>

        <div className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-4">
          <p className="text-sm text-white/70">اللاعبون</p>
          <div className="mt-3 rounded-2xl bg-black/10 p-3 font-bold">{name}</div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/game/${params.roomId}?game=${game}&name=${encodeURIComponent(name)}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            بدء اللعبة
          </Link>
        </div>
      </GlassCard>
    </main>
  );
}