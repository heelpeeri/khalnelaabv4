'use client';

import Link from "next/link";
import { quizCategoryMeta, QuizCategoryKey } from "@/data/quiz";
import { GlassCard } from "@/components/GlassCard";

export default function QuizPage() {
  const categories = Object.entries(quizCategoryMeta) as [
    QuizCategoryKey,
    {
      title: string;
      emoji: string;
      desc?: string;
    }
  ][];

  return (
    <main className="min-h-screen p-6 text-white">
      <div className="mx-auto max-w-6xl">
        
        {/* العنوان */}
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.2em] text-cyan-300/80">
            QUIZ
          </p>

          <h1 className="mt-2 text-4xl font-black">
            اختر الفئة
          </h1>

          <p className="mt-3 text-white/70">
            كل فئة تعتبر لعبة مستقلة
          </p>
        </div>

        {/* الفئات */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categories.map(([key, meta]) => (
            <Link
              key={key}
              href={`/match?game=quiz&category=${key}`}
            >
              <GlassCard className="cursor-pointer p-5 text-right transition hover:-translate-y-1 hover:bg-white/15">
                
                <div className="text-3xl">{meta.emoji}</div>

                <h3 className="mt-3 text-xl font-black">
                  {meta.title}
                </h3>

                {meta.desc && (
                  <p className="mt-1 text-sm text-white/70">
                    {meta.desc}
                  </p>
                )}
              </GlassCard>
            </Link>
          ))}
        </div>

        {/* رجوع */}
        <div className="mt-10 text-center">
          <Link href="/" className="text-white/60 hover:text-white">
            رجوع
          </Link>
        </div>
      </div>
    </main>
  );
}
