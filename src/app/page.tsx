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
    <main className="min-h-screen px-4 py-8 text-white">

      <div className="mx-auto max-w-7xl">

        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/logo.png"
            alt="خل نلعب"
            className="w-[210px]"
          />
        </div>

        {/* Description */}
        <section className="mx-auto mt-6 max-w-3xl text-center">

          <p className="text-lg leading-8 text-white/80 md:text-2xl">
            منصة ألعاب عائلية سعودية بتجربة سريعة، واضحة، وممتعة داخل البيت.
          </p>

        </section>

        <section className="mt-14 grid gap-8 xl:grid-cols-2">

          {/* تحدي الجلسة */}
          <GlassCard className="rounded-[32px] border border-white/15 bg-black/20 p-8">

            <div className="text-right">

              <p className="text-sm font-bold text-white/60">
                الوضع الرئيسي
              </p>

              <h2 className="mt-2 text-4xl font-black">
                تحدي الجلسة 🏆
              </h2>

              <p className="mt-4 leading-8 text-white/80">
                سجل أسماء الفرق مرة واحدة، اختر الألعاب اللي تبيها،
                وكل لعبة تكون جولة مستقلة وفي النهاية يبان الفائز بالنقاط.
              </p>

            </div>

            <div className="mt-8 flex justify-center">

              <Link
                href="/match?mode=session"
                className="
                inline-flex
                min-w-[230px]
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                bg-white/10
                px-8
                py-4
                text-lg
                font-black
                text-[#FFD84D]
                shadow-[0_0_24px_rgba(255,216,77,0.45)]
                backdrop-blur-md
                transition
                hover:scale-[1.04]
                hover:bg-white/15
                active:scale-95
                "
              >
                ابدأ تحدي الجلسة
              </Link>

            </div>

          </GlassCard>

          {/* لعبة سريعة */}
          <GlassCard className="rounded-[32px] border border-white/15 bg-black/20 p-8">

            <div className="text-right">

              <p className="text-sm font-bold text-white/60">
                الوضع السريع
              </p>

              <h2 className="mt-2 text-4xl font-black">
                لعبة سريعة ⚡
              </h2>

              <p className="mt-4 leading-8 text-white/80">
                اختر لعبة واحدة فقط، حدد عدد الجولات، وابدأ مباشرة بدون تعقيد.
              </p>

            </div>

            <div className="mt-8 flex justify-center">

              <button
                type="button"
                onClick={() => setShowQuickCards(prev => !prev)}
                className="
                inline-flex
                min-w-[230px]
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                bg-white/10
                px-8
                py-4
                text-lg
                font-black
                text-[#35C4FF]
                shadow-[0_0_24px_rgba(53,196,255,0.45)]
                backdrop-blur-md
                transition
                hover:scale-[1.04]
                hover:bg-white/15
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

        </section>

      </div>

    </main>
  );
}
