'use client';

import Link from "next/link";
import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

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
    <main className="min-h-screen px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-center">
          <Logo size={210} />
        </div>

        <section className="mx-auto mt-6 max-w-3xl text-center">
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/80 md:text-2xl">
            منصة ألعاب عائلية سعودية بتجربة سريعة، واضحة، وممتعة داخل البيت.
          </p>
        </section>

        <section className="mt-14 grid gap-8 xl:grid-cols-2">
          <GlassCard className="rounded-[32px] border border-white/15 bg-black/20 p-7 md:p-8">
            <div className="text-right">
              <p className="text-sm font-bold text-white/60">الوضع الرئيسي</p>
              <h2 className="mt-1 text-4xl font-black md:text-5xl">
                تحدي الجلسة 🏆
              </h2>
              <p className="mt-4 text-sm leading-8 text-white/80 md:text-lg">
                سجل أسماء الفرق مرة واحدة، اختر الألعاب اللي تبيها، وكل لعبة تكون جولة
                مستقلة، وفي النهاية يبان الفائز بالنقاط.
              </p>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                href="/match?mode=session"
                className="btn-primary px-8 py-4 text-lg active:scale-95"
              >
                ابدأ تحدي الجلسة
              </Link>
            </div>
          </GlassCard>

          <GlassCard className="rounded-[32px] border border-white/15 bg-black/20 p-7 md:p-8">
            <div className="text-right">
              <p className="text-sm font-bold text-white/60">الوضع السريع</p>
              <h2 className="mt-1 text-4xl font-black md:text-5xl">
                لعبة سريعة ⚡
              </h2>
              <p className="mt-4 text-sm leading-8 text-white/80 md:text-lg">
                اختر لعبة واحدة فقط، حدد عدد الجولات، وابدأ مباشرة بدون تعقيد.
              </p>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setShowQuickCards((prev) => !prev)}
                className="btn-secondary px-8 py-4 text-lg active:scale-95"
              >
                {showQuickCards ? "إخفاء الألعاب" : "اختر لعبة سريعة"}
              </button>
            </div>

            {showQuickCards && (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {quickGames.map((game) => (
                  <Link
                    key={game.title}
                    href={game.href}
                    className="block"
                  >
                    <div className="rounded-2xl border border-white/15 bg-white/8 px-5 py-4 text-right transition duration-200 hover:-translate-y-1 hover:bg-white/14">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-2xl">{game.emoji}</span>
                        <span className="text-base font-bold md:text-lg">
                          {game.title}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>
        </section>
      </div>
    </main>
  );
}
