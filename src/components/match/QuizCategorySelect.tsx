'use client';

import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { quizCategoryList } from "@/data/quiz";
import type { QuizCategoryKey } from "@/data/quiz";

export default function QuizCategorySelect({
  onSelect,
}: {
  onSelect: (category: QuizCategoryKey) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <GlassCard className="min-h-[700px] p-8 text-center">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/75">
          QUIZ
        </p>
        <h2 className="mt-2 text-3xl font-black">الأسئلة</h2>
        <p className="mt-3 text-white/75">
          اضغط على القائمة، اختر الفئة، ثم ابدأ الجولة.
        </p>

        <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-4 text-right shadow-[0_0_18px_rgba(255,255,255,0.04)]">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-4 text-lg font-black text-white transition hover:bg-cyan-400/15"
          >
            <span>اختر الفئة</span>
            <span className={`transition ${open ? "rotate-180" : ""}`}>⌄</span>
          </button>

          {open && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {quizCategoryList.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => onSelect(cat.key)}
                  className="group relative rounded-2xl border border-white/15 bg-white/10 p-5 text-right transition hover:-translate-y-1 hover:bg-white/20 active:scale-[0.98]"
                >
                  <div className="text-3xl">{cat.emoji}</div>
                  <h3 className="mt-3 text-xl font-black text-white">{cat.title}</h3>
                  <p className="mt-1 text-sm text-white/70">{cat.desc}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
