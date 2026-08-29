'use client';

import { useEffect, useMemo, useState } from "react";
import GameLayout from "@/components/match/GameLayout";
import { PROVERB_PUZZLES as puzzles } from "@/data/proverbs";
import type { WinnerType } from "@/types/game";

const TOTAL_ROUNDS = 6;
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

function ProverbWinnerModal({
  show,
  side1Name,
  side2Name,
  onPick,
}: {
  show: boolean;
  side1Name: string;
  side2Name: string;
  onPick: (
    winner: "side1" | "side2" | "none"
  ) => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="arcade-card w-full max-w-2xl p-8 text-center animate-fade-in-up">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/80">
          نتيجة المثل
        </p>

        <h1 className="arcade-title mt-5">
  من جاوب صح؟ ✅
</h1>

<p className="mt-3 text-lg font-bold text-white/70">
  اختر الفريق اللي جاوب الإجابة الصحيحة
</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onPick("side1")}
            className="arcade-button px-6 py-4 text-lg"
          >
            {side1Name || "فريق 1"}
          </button>

          <button
            type="button"
            onClick={() => onPick("side2")}
            className="arcade-button px-6 py-4 text-lg"
          >
            {side2Name || "فريق 2"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => onPick("none")}
          className="btn-secondary mt-4 w-full px-6 py-4 text-lg"
        >
          لا أحد
        </button>
      </div>
    </div>
  );
}

export default function ProverbGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
  currentRound = 1,
  timerEnabled = false,
  timerSeconds = 30,
}: {
  side1Name: string;
  side2Name: string;
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  currentRound?: number;
  timerEnabled?: boolean;
  timerSeconds?: number;
}) {
  const [rounds, setRounds] =
    useState<typeof puzzles>([]);

  const [index, setIndex] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(timerSeconds);

  const [revealed, setRevealed] =
    useState(false);

  const [secondTurn, setSecondTurn] =
    useState(false);

  const [showWinnerPicker, setShowWinnerPicker] =
    useState(false);

  const [side1Score, setSide1Score] =
    useState(0);

  const [side2Score, setSide2Score] =
    useState(0);

  useEffect(() => {
    const selected = shuffleArray(
      puzzles
    ).slice(0, TOTAL_ROUNDS);

    setRounds(selected);

    setIndex(0);

    setTimeLeft(timerSeconds);

    setRevealed(false);
    setSecondTurn(false);
    setShowWinnerPicker(false);

    setSide1Score(0);
    setSide2Score(0);
  }, [roundKey, timerSeconds]);

  const current = rounds[index];

  const mainTurn: TeamSide = useMemo(
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

  useEffect(() => {
    if (
      !timerEnabled ||
      revealed ||
      !current ||
      showWinnerPicker
    ) {
      return;
    }

    if (timeLeft <= 0) {
      if (!secondTurn) {
        setSecondTurn(true);
        setTimeLeft(SECOND_TIME);
      } else {
        setRevealed(true);
      }

      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(
        (previous) => previous - 1
      );
    }, 1000);

    return () =>
      clearTimeout(timer);
  }, [
    timeLeft,
    revealed,
    secondTurn,
    current,
    timerEnabled,
    showWinnerPicker,
  ]);

  function finishGame(
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

  function goNext(
    next1: number,
    next2: number
  ) {
    if (
      index + 1 >= rounds.length
    ) {
      finishGame(
        next1,
        next2
      );

      return;
    }

    setIndex(
      (currentIndex) =>
        currentIndex + 1
    );

    setTimeLeft(timerSeconds);

    setRevealed(false);
    setSecondTurn(false);
    setShowWinnerPicker(false);
  }

  function givePoint(
    winner:
      | "side1"
      | "side2"
      | "none"
  ) {
    const next1 =
      side1Score +
      (winner === "side1" ? 1 : 0);

    const next2 =
      side2Score +
      (winner === "side2" ? 1 : 0);

    setSide1Score(next1);
    setSide2Score(next2);

    setShowWinnerPicker(false);

    goNext(
      next1,
      next2
    );
  }

  if (!current) {
    return (
      <div className="text-center text-white">
        <p>ما فيه أمثال كافية</p>

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

  const timerTextClass =
    timeLeft <= 5
      ? "animate-pulse text-red-300"
      : timeLeft <= 10
        ? "text-yellow-200"
        : "text-cyan-200";

  const isLastProverb =
    index + 1 >= rounds.length;

  return (
    <>
      <GameLayout
        title="خمن المثل"
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

          {/* معلومات الجولة */}
          <div className="flex flex-wrap items-center justify-center gap-2">

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/70">
              المثل{" "}
              <span className="text-white">
                {index + 1}
              </span>
              {" / "}
              {rounds.length}
            </div>

            {secondTurn &&
              !revealed && (
                <div className="rounded-full border border-yellow-300/25 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-100">
                  فرصة ثانية
                </div>
              )}

            {timerEnabled &&
              !revealed && (
                <div
                  className={`rounded-full border border-white/10 bg-white/5 px-4 py-2 text-lg font-black ${timerTextClass}`}
                >
                  ⏱️ {timeLeft}
                </div>
              )}
          </div>

          {/* صورة المثل */}
          <img
            src={current.image}
            alt="لغز المثل"
            className="mx-auto max-h-[360px] w-full max-w-[520px] rounded-3xl object-contain"
          />

          {/* الإجابة */}
          {revealed && (
            <div className="rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-5">
              <p className="text-sm font-bold text-white/60">
                الإجابة
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                {current.answer}
              </p>
            </div>
          )}

          {/* الأزرار */}
          <div className="flex flex-wrap justify-center gap-3">
            {!revealed ? (
              <button
                type="button"
                onClick={() =>
                  setRevealed(true)
                }
                className="btn-primary"
              >
                إظهار الإجابة
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setShowWinnerPicker(true)
                }
                className="btn-primary min-w-[170px]"
              >
                {isLastProverb
                  ? "إنهاء الجولة"
                  : "التالي"}
              </button>
            )}
          </div>
        </div>
      </GameLayout>

      {/* شاشة من فاز؟ */}
      <ProverbWinnerModal
        show={showWinnerPicker}
        side1Name={side1Name}
        side2Name={side2Name}
        onPick={givePoint}
      />
    </>
  );
}
