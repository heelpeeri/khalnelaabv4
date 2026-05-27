'use client';

import Link from "next/link";
import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";

const quickGames = [
  {
    href: "/match?game=word",
    emoji: "💬",
    title: "خمن الكلمة",
  },
  {
    href: "/match?game=wheel",
    emoji: "🎡",
    title: "لف وخمن",
  },
  {
    href: "/match?game=quiz",
    emoji: "❓",
    title: "الأسئلة",
  },
  {
    href: "/match?game=scramble",
    emoji: "🧩",
    title: "حروف بالخلاط",
  },
  {
    href: "/match?game=draw",
    emoji: "✏️",
    title: "خمن المثل",
  },
  {
    href: "/match?game=categories",
    emoji: "🌍",
    title: "إنسان حيوان نبات جماد بلاد",
  },
];

export default function Home() {
  const [showQuickCards, setShowQuickCards] = useState(false);

  return (
    <main className="min-h-screen px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-center">
          <img src="/logo.png" alt="خل نلعب" className="w-[210px]" />
        </div>

        <section className="mx-auto mt-7 max-w-3xl text-center">
          <p className="text-lg leading-8 text-white/80 md:text-2xl">
          نسخة تجريبية
          </p>
        </section>

        <section className="mt-16 grid gap-8 xl:grid-cols-2">
          <GlassCard className="flex min-h-[310px] flex-col rounded-[32px] border border-purple-500/30 bg-black/20 p-8">
            <div className="text-right">
              <p className="text-sm font-bold text-white/60">الوضع الرئيسي</p>

              <h2 className="mt-2 text-5xl font-black">🏆 تحدي الجلسة</h2>

              <p className="mt-5 text-lg leading-9 text-white/80">
                سجل أسماء الفرق مرة واحدة، اختر الألعاب اللي تبيها، وكل لعبة
                تكون جولة مستقلة وفي النهاية يبان الفائز بالنقاط.
              </p>
            </div>

            <div className="mt-auto flex justify-center pt-10">
              <Link
                href="/match?mode=session"
                className="rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-12 py-4 font-black text-black shadow-[0_0_30px_rgba(255,221,0,.5)] transition hover:scale-105"
              >
                ابدأ تحدي الجلسة
              </Link>
            </div>
          </GlassCard>

          <GlassCard className="flex min-h-[310px] flex-col rounded-[32px] border border-purple-500/30 bg-black/20 p-8">
            <div className="text-right">
              <p className="text-sm font-bold text-white/60">الوضع السريع</p>

              <h2 className="mt-2 text-5xl font-black">⚡ لعبة سريعة</h2>

              <p className="mt-5 text-lg leading-9 text-white/80">
                اختر لعبة واحدة فقط، حدد عدد الجولات، وابدأ مباشرة بدون تعقيد.
              </p>
            </div>

            <div className="mt-auto flex justify-center pt-10">
              <button
                onClick={() => setShowQuickCards(!showQuickCards)}
                className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-12 py-4 font-black text-white shadow-[0_0_30px_rgba(0,180,255,.5)] transition hover:scale-105"
              >
                {showQuickCards ? "إخفاء الألعاب" : "اختر لعبة سريعة"}
              </button>
            </div>

            {showQuickCards && (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {quickGames.map((game) => (
                  <Link key={game.title} href={game.href}>
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 transition hover:-translate-y-1 hover:bg-white/15">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{game.emoji}</span>
                        <span className="font-bold">{game.title}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>
        </section>

        <div className="mt-10 flex justify-center">
          <Link
            href="/guide"
            className="rounded-full bg-gradient-to-r from-[#7A5CFF] to-[#119DFF] px-12 py-4 font-black text-white shadow-[0_0_28px_rgba(122,92,255,.5)] transition hover:scale-105"
          >
            🎮 طريقة اللعب
          </Link>
        </div>
      </div>
    </main>
  );
}
