'use client';

import { useEffect, useMemo, useState } from "react";
import { quizQuestions, quizCategoryMeta } from "@/data/quiz";
import type { QuizCategoryKey, QuizQuestion } from "@/data/quiz";
import type { WinnerType } from "@/types/game";

const TOTAL_QUESTIONS = 6;
const SECOND_TIME = 10;

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
  timerEnabled = false,
  timerSeconds = 30,
}: {
  side1Name: string;
  side2Name: string;
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  category?: QuizCategoryKey | null;
  timerEnabled?: boolean;
  timerSeconds?: number;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [secondTurn, setSecondTurn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);

  const [side1Score, setSide1Score] = useState(0);
  const [side2Score, setSide2Score] = useState(0);

  const [side1HintUsed, setSide1HintUsed] = useState(false);
  const [side2HintUsed, setSide2HintUsed] = useState(false);

  useEffect(() => {
    if (!category) return;

    const picked = quizQuestions[category] ?? [];
    const selected = shuffleArray(picked).slice(0, TOTAL_QUESTIONS);

    setQuestions(selected);
    setIndex(0);
    setShowAnswer(false);
    setShowOptions(false);
    setSecondTurn(false);
    setTimeLeft(timerSeconds);
    setSide1Score(0);
    setSide2Score(0);
    setSide1HintUsed(false);
    setSide2HintUsed(false);
  }, [category, roundKey, timerSeconds]);

  const current = questions[index];
  const meta = category ? quizCategoryMeta[category] : null;
  const currentOptions = current?.options ?? [];

  const mainTurn: "side1" | "side2" = useMemo(
    () => (index % 2 === 0 ? "side1" : "side2"),
    [index]
  );

  const activeTurn: "side1" | "side2" = secondTurn
    ? mainTurn === "side1"
      ? "side2"
      : "side1"
    : mainTurn;

  const activeTeamName =
    activeTurn === "side1" ? side1Name || "فريق 1" : side2Name || "فريق 2";

  const activeTeamUsedHint =
    activeTurn === "side1" ? side1HintUsed : side2HintUsed;

  const canUseHint =
    currentOptions.length > 0 && !showOptions && !activeTeamUsedHint;

  useEffect(() => {
    if (!timerEnabled || showAnswer || !current) return;

    if (timeLeft <= 0) {
      if (!secondTurn) {
        setSecondTurn(true);
        setTimeLeft(SECOND_TIME);
        setShowOptions(false);
      } else {
        setShowAnswer(true);
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showAnswer, secondTurn, current, timerEnabled]);

  function useHint() {
    if (!canUseHint) return;

    setShowOptions(true);

    if (activeTurn === "side1") {
      setSide1HintUsed(true);
    } else {
      setSide2HintUsed(true);
    }
  }

  function finishQuiz(final1: number, final2: number) {
    if (final1 > final2) return onRoundEnd("side1");
    if (final2 > final1) return onRoundEnd("side2");
    return onRoundEnd("none");
  }

  function nextQuestion(next1: number, next2: number) {
    if (index + 1 >= questions.length) {
      finishQuiz(next1, next2);
      return;
    }

    setIndex((i) => i + 1);
    setShowAnswer(false);
    setShowOptions(false);
    setSecondTurn(false);
    setTimeLeft(timerSeconds);
  }

  function givePoint(winner: "side1" | "side2" | "none") {
    const next1 = side1Score + (winner === "side1" ? 1 : 0);
    const next2 = side2Score + (winner === "side2" ? 1 : 0);

    setSide1Score(next1);
    setSide2Score(next2);

    nextQuestion(next1, next2);
  }

  if (!category) {
    return <div className="text-center text-white">ما تم تحديد فئة</div>;
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

  const timerColor =
    timeLeft <= 5
      ? "text-red-300 animate-pulse"
      : timeLeft <= 10
      ? "text-yellow-300"
      : "text-cyan-300";

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
            activeTurn === "side1"
              ? "border border-pink-300/40 bg-pink-500/20"
              : "bg-pink-500/10"
          }`}
        >
          <p>{side1Name || "فريق 1"}</p>
          <p className="text-3xl font-black">{side1Score}</p>
          <p className="mt-1 text-xs text-white/45">
            المساعدة: {side1HintUsed ? "استخدمت" : "متاحة"}
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <p>{secondTurn ? "دور الفريق الثاني" : "الدور"}</p>
          <p className="text-lg font-black">{activeTeamName}</p>

          {timerEnabled ? (
            <p className={`text-3xl font-black ${timerColor}`}>{timeLeft}</p>
          ) : (
            <p className="text-sm font-bold text-white/50">بدون مؤقت</p>
          )}

          <p className="text-sm text-white/60">
            السؤال {index + 1} / {questions.length}
          </p>
        </div>

        <div
          className={`rounded-2xl p-4 ${
            activeTurn === "side2"
              ? "border border-cyan-300/40 bg-cyan-400/20"
              : "bg-cyan-500/10"
          }`}
        >
          <p>{side2Name || "فريق 2"}</p>
          <p className="text-3xl font-black">{side2Score}</p>
          <p className="mt-1 text-xs text-white/45">
            المساعدة: {side2HintUsed ? "استخدمت" : "متاحة"}
          </p>
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

        {showOptions && currentOptions.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {currentOptions.map((option) => (
              <div
                key={option}
                className="rounded-2xl border border-white/10 bg-black/20 p-4 text-lg font-bold"
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      {showAnswer && (
        <div className="mt-5 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-5">
          <p className="text-sm text-white/70">الإجابة</p>
          <p className="mt-2 text-xl font-bold text-yellow-100">
            {current.answer}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {!showAnswer ? (
          <>
            {canUseHint && (
              <button onClick={useHint} className="btn-secondary">
                💡 إظهار الخيارات
              </button>
            )}

            {!canUseHint && currentOptions.length > 0 && (
              <span className="text-sm font-bold text-white/45">
                مساعدة {activeTeamName}: مستخدمة
              </span>
            )}

            <button onClick={() => setShowAnswer(true)} className="btn-primary">
              إظهار الإجابة
            </button>
          </>
        ) : (
          <>
            <button onClick={() => givePoint("side1")} className="btn-primary">
              {side1Name || "فريق 1"}
            </button>

            <button onClick={() => givePoint("side2")} className="btn-primary">
              {side2Name || "فريق 2"}
            </button>

            <button onClick={() => givePoint("none")} className="btn-secondary">
              لا أحد
            </button>
          </>
        )}
      </div>
    </div>
  );
}
