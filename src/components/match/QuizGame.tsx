'use client';

import { useEffect, useMemo, useState } from "react";
import GameLayout from "@/components/match/GameLayout";
import {
  quizQuestions,
  quizCategoryMeta,
} from "@/data/quiz";
import type {
  QuizCategoryKey,
  QuizQuestion,
} from "@/data/quiz";
import type { WinnerType } from "@/types/game";

const TOTAL_QUESTIONS = 6;
const SECOND_TIME = 10;

type TeamSide = "side1" | "side2";

function shuffleArray<T>(items: T[]) {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [
      array[j],
      array[i],
    ];
  }

  return array;
}

function AnswerJudgeModal({
  open,
  side1Name,
  side2Name,
  onSelect,
}: {
  open: boolean;
  side1Name: string;
  side2Name: string;
  onSelect: (
    winner: "side1" | "side2" | "none"
  ) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[30px] border border-white/15 bg-[#16102f]/95 p-6 text-center shadow-[0_25px_80px_rgba(0,0,0,0.55)] sm:p-7">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-300/20 bg-purple-500/15 text-3xl">
          ✓
        </div>

        <h3 className="mt-4 text-2xl font-black text-white sm:text-3xl">
          من جاوب صح؟
        </h3>

        <p className="mt-2 text-sm font-bold text-white/50">
          اختر الفريق اللي جاوب الإجابة الصحيحة
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => onSelect("side1")}
            className="w-full rounded-2xl border border-fuchsia-300/40 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/15 px-5 py-4 text-lg font-black text-fuchsia-50 transition hover:scale-[1.01] hover:bg-fuchsia-500/25 active:scale-[0.99]"
          >
            {side1Name || "فريق 1"}
          </button>

          <button
            type="button"
            onClick={() => onSelect("side2")}
            className="w-full rounded-2xl border border-cyan-300/40 bg-gradient-to-r from-cyan-400/20 to-blue-500/15 px-5 py-4 text-lg font-black text-cyan-50 transition hover:scale-[1.01] hover:bg-cyan-400/25 active:scale-[0.99]"
          >
            {side2Name || "فريق 2"}
          </button>

          <button
            type="button"
            onClick={() => onSelect("none")}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-lg font-black text-white/70 transition hover:bg-white/10 active:scale-[0.99]"
          >
            لا أحد
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuizGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
  category,
  currentRound = 1,
  timerEnabled = false,
  timerSeconds = 30,
}: {
  side1Name: string;
  side2Name: string;

  onRoundEnd: (
    winner?: WinnerType
  ) => void;

  roundKey: number;

  category?: QuizCategoryKey | null;

  currentRound?: number;

  timerEnabled?: boolean;
  timerSeconds?: number;
}) {
  const [questions, setQuestions] =
    useState<QuizQuestion[]>([]);

  const [index, setIndex] =
    useState(0);

  const [
    showAnswer,
    setShowAnswer,
  ] = useState(false);

  const [
    showOptions,
    setShowOptions,
  ] = useState(false);

  const [
    secondTurn,
    setSecondTurn,
  ] = useState(false);

  const [
    showJudge,
    setShowJudge,
  ] = useState(false);

  const [timeLeft, setTimeLeft] =
    useState(timerSeconds);

  const [
    side1Score,
    setSide1Score,
  ] = useState(0);

  const [
    side2Score,
    setSide2Score,
  ] = useState(0);

  const [
    side1HintUsed,
    setSide1HintUsed,
  ] = useState(false);

  const [
    side2HintUsed,
    setSide2HintUsed,
  ] = useState(false);

  useEffect(() => {
    if (!category) return;

    const picked =
      quizQuestions[category] ?? [];

    const selected =
      shuffleArray(picked).slice(
        0,
        TOTAL_QUESTIONS
      );

    setQuestions(selected);

    setIndex(0);

    setShowAnswer(false);
    setShowOptions(false);
    setSecondTurn(false);
    setShowJudge(false);

    setTimeLeft(timerSeconds);

    setSide1Score(0);
    setSide2Score(0);

    setSide1HintUsed(false);
    setSide2HintUsed(false);
  }, [
    category,
    roundKey,
    timerSeconds,
  ]);

  const current =
    questions[index];

  const meta = category
    ? quizCategoryMeta[category]
    : null;

  const currentOptions =
    current?.options ?? [];

  const mainTurn: TeamSide =
    useMemo(
      () =>
        index % 2 === 0
          ? "side1"
          : "side2",
      [index]
    );

  const activeTurn: TeamSide =
    secondTurn
      ? mainTurn === "side1"
        ? "side2"
        : "side1"
      : mainTurn;

  const activeTeamName =
    activeTurn === "side1"
      ? side1Name || "فريق 1"
      : side2Name || "فريق 2";

  const activeTeamUsedHint =
    activeTurn === "side1"
      ? side1HintUsed
      : side2HintUsed;

  const canUseHint =
    currentOptions.length > 0 &&
    !showOptions &&
    !activeTeamUsedHint;

  useEffect(() => {
    if (
      !timerEnabled ||
      showAnswer ||
      !current ||
      showJudge
    ) {
      return;
    }

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
      setTimeLeft(
        (time) => time - 1
      );
    }, 1000);

    return () =>
      clearTimeout(timer);
  }, [
    timeLeft,
    showAnswer,
    secondTurn,
    current,
    timerEnabled,
    showJudge,
  ]);

  function useHint() {
    if (!canUseHint) return;

    setShowOptions(true);

    if (activeTurn === "side1") {
      setSide1HintUsed(true);
    } else {
      setSide2HintUsed(true);
    }
  }

  function finishQuiz(
    final1: number,
    final2: number
  ) {
    if (final1 > final2) {
      onRoundEnd("side1");
      return;
    }

    if (final2 > final1) {
      onRoundEnd("side2");
      return;
    }

    onRoundEnd("none");
  }

  function nextQuestion(
    next1: number,
    next2: number
  ) {
    if (
      index + 1 >=
      questions.length
    ) {
      finishQuiz(
        next1,
        next2
      );

      return;
    }

    setIndex(
      (currentIndex) =>
        currentIndex + 1
    );

    setShowAnswer(false);
    setShowOptions(false);
    setSecondTurn(false);
    setShowJudge(false);

    setTimeLeft(timerSeconds);
  }

  function givePoint(
    winner:
      | "side1"
      | "side2"
      | "none"
  ) {
    const next1 =
      side1Score +
      (winner === "side1"
        ? 1
        : 0);

    const next2 =
      side2Score +
      (winner === "side2"
        ? 1
        : 0);

    setSide1Score(next1);
    setSide2Score(next2);

    setShowJudge(false);

    nextQuestion(
      next1,
      next2
    );
  }

  if (!category) {
    return (
      <div className="text-center text-white">
        ما تم تحديد فئة
      </div>
    );
  }

  if (!current) {
    return (
      <div className="text-center text-white">
        <p>
          ما فيه أسئلة كافية
        </p>

        <button
          type="button"
          onClick={() =>
            onRoundEnd("none")
          }
          className="btn-primary mt-4"
        >
          إنهاء الجولة
        </button>
      </div>
    );
  }

  const timerColor =
    timeLeft <= 5
      ? "animate-pulse text-red-300"
      : timeLeft <= 10
        ? "text-yellow-300"
        : "text-cyan-300";

  const isLastQuestion =
    index + 1 >= questions.length;

  return (
    <>
      <GameLayout
        title={`${meta?.emoji ?? "❓"} ${
          meta?.title ?? "كويز"
        }`}
        side1={
          side1Name || "فريق 1"
        }
        side2={
          side2Name || "فريق 2"
        }
        side1Score={side1Score}
        side2Score={side2Score}
        turn={activeTeamName}
        turnSide={activeTurn}
        currentRound={currentRound}
      >
        <div className="flex flex-col gap-4">

          {/* معلومات السؤال */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/70">
              السؤال{" "}
              <span className="text-white">
                {index + 1}
              </span>
              {" / "}
              {questions.length}
            </div>

            {secondTurn &&
              !showAnswer && (
                <div className="rounded-full border border-yellow-300/25 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-100">
                  فرصة ثانية
                </div>
              )}

            {timerEnabled &&
              !showAnswer && (
                <div
                  className={`rounded-full border border-white/10 bg-white/5 px-4 py-2 text-lg font-black ${timerColor}`}
                >
                  ⏱️ {timeLeft}
                </div>
              )}
          </div>

          {/* السؤال */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 sm:p-6">
            {current.image && (
              <img
                src={current.image}
                alt={current.question}
                className="mx-auto mb-5 max-h-[260px] w-full rounded-2xl object-contain"
              />
            )}

            <p className="text-xl font-black leading-relaxed text-white sm:text-2xl">
              {current.question}
            </p>

            {/* الخيارات */}
            {showOptions &&
              currentOptions.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {currentOptions.map(
                    (option) => (
                      <div
                        key={option}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4 text-base font-bold text-white sm:text-lg"
                      >
                        {option}
                      </div>
                    )
                  )}
                </div>
              )}
          </div>

          {/* الإجابة */}
          {showAnswer && (
            <div className="rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-5">
              <p className="text-sm font-bold text-white/60">
                الإجابة
              </p>

              <p className="mt-2 text-xl font-black text-yellow-100">
                {current.answer}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!showAnswer ? (
              <>
                {currentOptions.length >
                  0 && (
                  <button
                    type="button"
                    onClick={useHint}
                    disabled={!canUseHint}
                    className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {activeTeamUsedHint
                      ? "المساعدة استخدمت"
                      : showOptions
                        ? "الخيارات ظاهرة"
                        : "💡 إظهار الخيارات"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setShowAnswer(true)
                  }
                  className="btn-primary"
                >
                  إظهار الإجابة
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setShowJudge(true)
                }
                className="btn-primary min-w-[160px]"
              >
                {isLastQuestion
                  ? "إنهاء الكويز"
                  : "السؤال التالي"}
              </button>
            )}
          </div>
        </div>
      </GameLayout>

      <AnswerJudgeModal
        open={showJudge}
        side1Name={side1Name}
        side2Name={side2Name}
        onSelect={givePoint}
      />
    </>
  );
}
