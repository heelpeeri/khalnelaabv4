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
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [array[i], array[j]] = [
      array[j],
      array[i],
    ];
  }

  return array;
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

  /*
    الفريق الأساسي يتغير
    مع كل سؤال.
  */
  const mainTurn: TeamSide =
    useMemo(
      () =>
        index % 2 === 0
          ? "side1"
          : "side2",
      [index]
    );

  /*
    إذا ضاعت فرصة الفريق الأول
    تنتقل الفرصة للفريق الثاني.
  */
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
      !current
    ) {
      return;
    }

    if (timeLeft <= 0) {
      /*
        انتهى وقت الفريق الأساسي:
        نعطي الفريق الثاني 10 ثواني.
      */
      if (!secondTurn) {
        setSecondTurn(true);

        setTimeLeft(SECOND_TIME);

        setShowOptions(false);
      } else {
        /*
          انتهى وقت الفريقين.
        */
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

  function nextQuestion() {
    /*
      إذا كان هذا آخر سؤال:
      ننهي الجولة بدون إرسال فائز،
      عشان تظهر شاشة "من فاز؟"
    */
    if (
      index + 1 >=
      questions.length
    ) {
      onRoundEnd();
      return;
    }

    setIndex(
      (currentIndex) =>
        currentIndex + 1
    );

    setShowAnswer(false);
    setShowOptions(false);

    setSecondTurn(false);

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

    nextQuestion();
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

  return (
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
            currentOptions.length >
              0 && (
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
              {/* Hint */}
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

              {/* Show answer */}
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
            <>
              {/* Point team 1 */}
              <button
                type="button"
                onClick={() =>
                  givePoint("side1")
                }
                className="btn-primary"
              >
                {side1Name ||
                  "فريق 1"}
              </button>

              {/* Point team 2 */}
              <button
                type="button"
                onClick={() =>
                  givePoint("side2")
                }
                className="btn-primary"
              >
                {side2Name ||
                  "فريق 2"}
              </button>

              {/* Nobody */}
              <button
                type="button"
                onClick={() =>
                  givePoint("none")
                }
                className="btn-secondary"
              >
                لا أحد
              </button>
            </>
          )}
        </div>
      </div>
    </GameLayout>
  );
}
