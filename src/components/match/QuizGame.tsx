'use client';

import { useEffect, useMemo, useState } from "react";
import { quizQuestions, quizCategoryMeta } from "@/data/quiz";
import type { QuizCategoryKey, QuizQuestion } from "@/data/quiz";
import type { WinnerType } from "@/types/game";

const TOTAL_QUESTIONS = 6;

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
  const [showOptions, setShowOptions] = useState(false);

  const [side1QuizScore, setSide1QuizScore] = useState(0);
  const [side2QuizScore, setSide2QuizScore] = useState(0);

  useEffect(() => {
    if (!category) return;

    const picked = quizQuestions[category] ?? [];
    const selected = shuffleArray(picked).slice(0, TOTAL_QUESTIONS);

    setQuestions(selected);
    setIndex(0);
    setShowAnswer(false);
    setShowOptions(false);
    setSide1QuizScore(0);
    setSide2QuizScore(0);
  }, [category, roundKey]);

  const current = questions[index];
  const meta = category ? quizCategoryMeta[category] : null;

  const currentTurn: "side1" | "side2" = useMemo(() => {
    return index % 2 === 0 ? "side1" : "side2";
  }, [index]);

  const currentTeamName =
    currentTurn === "side1" ? side1Name || "فريق 1" : side2Name || "فريق 2";

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
    setShowOptions(false);
  }

  function markCorrect() {
    const next1 = side1QuizScore + (currentTurn === "side1" ? 1 : 0);
    const next2 = side2QuizScore + (currentTurn === "side2" ? 1 : 0);

    setSide1QuizScore(next1);
    setSide2QuizScore(next2);

    goNextQuestion(next1, next2);
  }

  function markWrongOrSkip() {
    goNextQuestion(side1QuizScore, side2QuizScore);
  }

  if (!category) {
    return (
      <div className="text-center text-white">
        <p>ما تم تحديد فئة</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="text-center text-white">
        <p>ما فيه أسئلة كافية</p>
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
        <div
          className={`rounded-2xl p-4 ${
            currentTurn === "side1"
              ? "border border-pink-300/40 bg-pink-500/20"
              : "bg-pink-500/10"
          }`}
        >
          <p>{side1Name || "فريق 1"}</p>
          <p className="text-3xl font-black">{side1QuizScore}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <p>السؤال</p>
          <p className="text-2xl font-black">
            {index + 1} / {TOTAL_QUESTIONS}
          </p>
          <p className="mt-1 text-sm font-bold text-cyan-200">
            الدور: {currentTeamName}
          </p>
        </div>

        <div
          className={`rounded-2xl p-4 ${
            currentTurn === "side2"
              ? "border border-cyan-300/40 bg-cyan-400/20"
              : "bg-cyan-400/10"
          }`}
        >
          <p>{side2Name || "فريق 2"}</p>
          <p className="text-3xl font-black">{side2QuizScore}</p>
        </div>
      </div>

      <div className="mt-7 rounded-3xl border border-white/10 bg-white/10 p-6">
        {current.image && (
          <img
            src={current.image}
            alt={current.question}
            className="mx-auto mb-5 max-h-[260px] w-full rounded-2xl object-contain"
          />
        )}

        <p className="text-2xl font-black leading-relaxed">
          {current.question}
        </p>

        {showOptions && current.options && current.options.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {current.options.map((option) => (
              <div
                key={option}
                className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center text-lg font-bold"
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      {showAnswer && (
        <div className="mt-5 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-5">
          <p className="text-sm text-white/70">الإجابة:</p>
          <p className="mt-2 text-xl font-bold text-yellow-100">
            {current.answer}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {!showAnswer ? (
          <>
            {current.options && current.options.length > 0 && !showOptions && (
              <button
                onClick={() => setShowOptions(true)}
                className="btn-secondary"
              >
                إظهار الخيارات
              </button>
            )}

            <button onClick={() => setShowAnswer(true)} className="btn-primary">
              إظهار الإجابة
            </button>
          </>
        ) : (
          <>
            <button onClick={markCorrect} className="btn-primary">
              إجابة صحيحة
            </button>

            <button onClick={markWrongOrSkip} className="btn-secondary">
              خطأ / تخطي
            </button>
          </>
        )}
      </div>
    </div>
  );
}
