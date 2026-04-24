'use client';

import { useState } from "react";
import { quizCategoryMeta, QuizCategoryKey } from "@/data/quiz";

export default function QuizCategorySelect({
  onSelect,
}: {
  onSelect: (category: QuizCategoryKey) => void;
}) {
  const [open, setOpen] = useState(false);

  const categories = Object.entries(quizCategoryMeta) as [
    QuizCategoryKey,
    {
      title: string;
      emoji: string;
      desc?: string;
    }
  ][];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 text-center shadow-[0_0_24px_rgba(255,255,255,0.04)]">
        <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
          اختر الفئة
        </p>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="btn-primary mt-4 min-w-[240px] transition hover:scale-[1.03]"
        >
          {open ? "إخفاء الفئات" : "عرض الفئات"}
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ${
            open
              ? "mt-6 max-h-[700px] opacity-100"
              : "mt-0 max-h-0 opacity-0"
          }`}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {categories.map(([key, meta], index) => (
              <button
                key={key}
                onClick={() => onSelect(key)}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-right transition hover:-translate-y-1 hover:bg-white/10"
                style={{
                  animation: open
                    ? `fade-in-up 0.3s ease ${index * 50}ms both`
                    : "none",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{meta.emoji}</span>

                  <div className="text-right">
                    <h3 className="font-black">{meta.title}</h3>
                    <p className="text-sm text-white/60">{meta.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
