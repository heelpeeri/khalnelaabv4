'use client';

import { useEffect, useState } from "react";
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
  category,
}: {
  side1Name: string;
  side2Name: string;
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  category?: QuizCategoryKey | null;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [side1QuizScore, setSide1QuizScore] = useState(0);
  const [side2QuizScore, setSide2QuizScore] = useState(0);

  // 🔥 بداية الجولة
  useEffect(() => {
    if (!category) return;

    const picked = quizQuestions[category] ?? [];
    const selected = shuffleArray(picked).slice(0, 5);

    setQuestions(selected);
    setIndex(0);
    setShowAnswer(false);
    setSide1QuizScore(0);
    setSide2QuizScore(0);
  }, [category, roundKey]);

  function finishQuiz(final1: number, final2: number) {
    if (final1 > final2) return onRoundEnd("side1");
    if (final2 > final1) return onRoundEnd("side2");
    return onRoundEnd("none");
  }

  function goNextQuestion(next1: number, next2: number) {
    if (index + 1 >= questions.length) {
      finishQuiz(next1, next2);
      return;
    }

    setIndex((i) => i + 1);
    setShowAnswer(false);
  }

  function chooseWinner(winner: "side1" | "side2" | "none") {
    const next1 = side1QuizScore + (winner === "side1" ? 1 : 0);
    const next2 = side2QuizScore + (winner === "side2" ? 1 : 0);

    setSide1QuizScore(next1);
    setSide2QuizScore(next2);

    goNextQuestion(next1, next2);
  }

  if (!category) {
    return (
      <div className="text-center text-white">
        <p>ما تم تحديد فئة</p>
      </div>
    );
  }

  const current = questions[index];
  const meta = quizCategoryMeta[category];

  if (!current) {
    return (
      <div className="text-center text-white">
        <p>ما فيه أسئلة</p>
        <button onClick={() => onRoundEnd("none")} className="btn-primary mt-4">
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
        <div className="rounded-2xl bg-pink-500/10 p-4">
          <p>{side1Name}</p>
          <p className="text-3xl font-black">{side1QuizScore}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <p>السؤال</p>
          <p className="text-2xl font-black">
            {index + 1} / {questions.length}
          </p>
        </div>

        <div className="rounded-2xl bg-cyan-400/10 p-4">
          <p>{side2Name}</p>
          <p className="text-3xl font-black">{side2QuizScore}</p>
        </div>
      </div>

      <div className="mt-7 p-6">
        {current.image && (
          <img src={current.image} className="mx-auto mb-5 max-h-[260px]" />
        )}

        <p className="text-2xl font-black">{current.question}</p>
      </div>

      {showAnswer && (
        <div className="mt-5">
          <p>الإجابة:</p>
          <p className="text-xl font-bold">{current.answer}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {!showAnswer ? (
          <button onClick={() => setShowAnswer(true)} className="btn-primary">
            إظهار الإجابة
          </button>
        ) : (
          <>
            <button onClick={() => chooseWinner("side1")} className="btn-primary">
              {side1Name}
            </button>
            <button onClick={() => chooseWinner("side2")} className="btn-primary">
              {side2Name}
            </button>
            <button onClick={() => chooseWinner("none")} className="btn-secondary">
              لا أحد
            </button>
          </>
        )}
      </div>
    </div>
  );
}
