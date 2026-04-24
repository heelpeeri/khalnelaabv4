'use client';

import { useEffect, useState } from "react";
import QuizCategorySelect from "@/components/match/QuizCategorySelect";
import { quizQuestions, quizCategoryMeta } from "@/data/quiz";
import type { QuizCategoryKey, QuizQuestion } from "@/data/quiz";
import type { WinnerType } from "@/types/game";

function shuffleArray<T>(items: T[]) {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export default function QuizGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
  category: initialCategory,
  onProgressChange,
}: {
  side1Name: string;
  side2Name: string;
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  category?: QuizCategoryKey | null;
  onProgressChange?: (current: number, total: number) => void;
}) {
  const [category, setCategory] = useState<QuizCategoryKey | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  function startCategory(cat: QuizCategoryKey) {
    const picked = quizQuestions[cat] ?? [];
    const selected = shuffleArray(picked).slice(0, 5);

    setCategory(cat);
    setQuestions(selected);
    setIndex(0);
    setShowAnswer(false);
    onProgressChange?.(selected.length > 0 ? 1 : 0, selected.length);
  }

  useEffect(() => {
    if (!initialCategory) return;
    startCategory(initialCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCategory, roundKey]);

  function nextQuestion() {
    if (index + 1 >= questions.length) {
      onRoundEnd("none");
      return;
    }

    const next = index + 1;
    setIndex(next);
    setShowAnswer(false);
    onProgressChange?.(next + 1, questions.length);
  }

  if (!category && !initialCategory) {
    return <QuizCategorySelect onSelect={startCategory} />;
  }

  const current = questions[index];
  const meta = category ? quizCategoryMeta[category] : null;

  if (!current) {
    return (
      <div className="text-center text-white">
        <p>ما فيه أسئلة في هذه الفئة</p>
        <button className="btn-primary mt-4" onClick={() => onRoundEnd("none")}>
          إنهاء الجولة
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-black/20 p-6 text-center text-white">
      <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
        QUIZ
      </p>

      <h2 className="mt-2 text-3xl font-black">
        {meta?.emoji} {meta?.title}
      </h2>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-pink-300/20 bg-pink-500/10 p-4">
          <p>{side1Name}</p>
        </div>

        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
          <p>السؤال</p>
          <p className="text-2xl font-black">
            {index + 1} / {questions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-300/20 bg-white/10 p-4">
          <p>{side2Name}</p>
        </div>
      </div>

      <div className="mt-7 rounded-3xl border border-white/15 bg-white/10 p-6">
        <p className="text-2xl font-black leading-relaxed">
          {current.question}
        </p>

        {current.options && current.options.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {current.options.map((option) => (
              <div
                key={option}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 text-lg font-bold"
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      {showAnswer && (
        <div className="mt-5 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-5">
          <p className="text-sm text-white/70">الإجابة الصحيحة</p>
          <p className="mt-2 text-2xl font-black text-yellow-100">
            {current.answer}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {!showAnswer ? (
          <button
            className="btn-primary min-w-[180px]"
            onClick={() => setShowAnswer(true)}
          >
            إظهار الإجابة
          </button>
        ) : (
          <button className="btn-primary min-w-[180px]" onClick={nextQuestion}>
            {index + 1 >= questions.length ? "إنهاء الجولة" : "التالي"}
          </button>
        )}

        <button
          className="btn-secondary min-w-[180px]"
          onClick={() => onRoundEnd("none")}
        >
          إنهاء الجولة
        </button>
      </div>
    </div>
  );
}
