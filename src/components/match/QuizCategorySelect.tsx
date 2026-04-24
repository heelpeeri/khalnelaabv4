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
      <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 text-center">
        <p className="text-sm font-black text-cyan-300/80">
          اختر الفئة
        </p>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="btn-primary mt-4"
        >
          {open ? "إخفاء الفئات" : "عرض الفئات"}
        </button>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            open ? "max-h-[600px] opacity-100 mt-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map(([key, meta]) => (
              <button
                key={key}
                onClick={() => onSelect(key)}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-right hover:bg-white/10"
              >
                <div className="text-2xl">{meta.emoji}</div>
                <p className="font-bold">{meta.title}</p>
                <p className="text-sm text-white/60">{meta.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
