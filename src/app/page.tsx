'use client';

import Link from "next/link";
import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";

const quickGames = [
  { href: "/match?game=word", emoji: "💬", title: "خمن الكلمة" },
  { href: "/match?game=wheel", emoji: "🎡", title: "لف وخمن" },
  { href: "/match?game=quiz", emoji: "❓", title: "الأسئلة" },
  { href: "/match?game=scramble", emoji: "🧩", title: "حروف بالخلاط" },
  { href: "/match?game=draw", emoji: "✏️", title: "خمن المثل" },
  { href: "/match?game=categories", emoji: "🌍", title: "إنسان حيوان نبات جماد بلاد" },
];

export default function Home() {
  const [showQuickCards, setShowQuickCards] = useState(false);

  return (
    <main className="min-h-screen px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/logo.png"
            alt="خل نلعب"
            className="h-auto w-[210px]"
          />
        </div>

        {/* Description */}
        <section className="mx-auto mt-6 max-w-3xl text-center">
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/80 md:text-2xl">
            منصة ألعاب عائلية سعودية بتجربة سريعة، واضحة، وممتعة داخل البيت.
          </p>
        </section>

        <section className="mt-14 grid gap-8 xl:grid-cols-2">

          {/* الوضع السريع */}
          <GlassCard className="rounded-[32px] border border-white/15 bg-black/20 p-7 md:p-8">

            <div className="text-right">
              <p className="text-sm font-bold text-white/60">
                الوضع السريع
              </p>

              <h2 className="mt-1 text-4xl font-black md:text-5xl">
                لعبة سريعة ⚡
              </h2>

              <p className="mt-4 text-sm leading-8 text-white/80 md:text-lg">
                اختر لعبة واحدة فقط، حدد عدد الجولات، وابدأ مباشرة بدون تعقيد.
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowQuickCards((prev) => !prev)}
                className="
                inline-flex
                min-w-[220px]
                items-center
                justify-center
                rounded-full
                bg-gradient-to-r
                from-[#65D6FF]
                via-[#27B7FF]
                to-[#007BFF]
                px-8
                py-4
                text-lg
                font-black
                text-[#07111F]
                border
                border-cyan-300/50
                shadow-[0_0_35px_rgba(39,183,255,0.65)]
                transition-all
                hover:scale-[1.05]
                hover:shadow-[0_0_50px_rgba(39,183,255,0.8)]
                active:scale-95
                "
              >
                {showQuickCards
                  ? "إخفاء الألعاب"
                  : "اختر لعبة سريعة"}
              </button>
            </div>

            {showQuickCards && (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {quickGames.map((game) => (
                  <Link
                    key={game.title}
                    href={game.href}
                  >
                    <div className="
                    rounded-2xl
                    border
                    border-white/15
                    bg-white/10
                    px-5
                    py-4
                    transition
                    hover:-translate-y-1
                    hover:bg-white/15
                    ">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">
                          {game.emoji}
                        </span>

                        <span className="font-bold">
                          {game.title}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>

          {/* تحدي الجلسة */}
          <GlassCard className="rounded-[32px] border border-white/15 bg-black/20 p-7 md:p-8">

            <div className="text-right">
              <p className="text-sm font-bold text-white/60">
                الوضع الرئيسي
              </p>

              <h2 className="mt-1 text-4xl font-black md:text-5xl">
                تحدي الجلسة 🏆
              </h2>

              <p className="mt-4 text-sm leading-8 text-white/80 md:text-lg">
                سجل أسماء الفرق مرة واحدة، اختر الألعاب اللي تبيها، وكل لعبة تكون جولة مستقلة، وفي النهاية يبان الفائز بالنقاط.
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/match?mode=session"
                className="
                inline-flex
                min-w-[220px]
                items-center
                justify-center
                rounded-full
                bg-gradient-to-r
                from-[#FFD84D]
                via-[#FFC107]
                to-[#FF9800]
                px-8
                py-4
                text-lg
                font-black
                text-[#2a1600]
                border
                border-yellow-300/50
                shadow-[0_0_35px_rgba(255,193,7,0.65)]
                transition-all
                hover:scale-[1.05]
                hover:shadow-[0_0_50px_rgba(255,193,7,0.85)]
                active:scale-95
                "
              >
                ابدأ تحدي الجلسة
              </Link>
            </div>

          </GlassCard>

        </section>

      </div>
    </main>
  );
}
