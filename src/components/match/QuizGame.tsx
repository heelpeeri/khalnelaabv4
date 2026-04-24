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
          className="btn-primary mt-4 min-w-[240px] transition duration-200 hover:scale-[1.03]"
        >
          {open ? "إخفاء الفئات" : "عرض الفئات"}
        </button>

        <div
          className={`grid overflow-hidden transition-all duration-500 ${
            open
              ? "mt-6 max-h-[700px] opacity-100"
              : "mt-0 max-h-0 opacity-0"
          }`}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {categories.map(([key, meta], index) => (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-right transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.10)] active:scale-[0.98]"
                style={{
                  animation: open
                    ? `fade-in-up 0.35s ease ${index * 60}ms both`
                    : "none",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-3xl transition duration-300 group-hover:scale-110">
                    {meta.emoji}
                  </span>

                  <div className="text-right">
                    <h3 className="text-lg font-black text-white">
                      {meta.title}
                    </h3>

                    {meta.desc && (
                      <p className="mt-1 text-sm text-white/55">
                        {meta.desc}
                      </p>
                    )}
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
