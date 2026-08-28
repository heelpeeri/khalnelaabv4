'use client';

import { useEffect, useState } from "react";
import GameLayout from "@/components/match/GameLayout";
import { CATEGORY_LETTERS as letters } from "@/data/categories";
import type { WinnerType } from "@/types/game";

export default function CategoriesGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
  currentRound = 1,
  timerEnabled = false,
  timerSeconds = 40,
}: {
  side1Name: string;
  side2Name: string;
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  currentRound?: number;
  timerEnabled?: boolean;
  timerSeconds?: number;
}) {
  const [letter, setLetter] = useState<string>(
    () => letters[Math.floor(Math.random() * letters.length)]
  );

  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [revealed, setRevealed] = useState(false);

  const [side1Ready, setSide1Ready] = useState(false);
  const [side2Ready, setSide2Ready] = useState(false);

  const [side1Time, setSide1Time] = useState<number | null>(null);
  const [side2Time, setSide2Time] = useState<number | null>(null);

  const instructionText =
    "فكروا في: إنسان – حيوان – نبات – جماد – بلاد، كلها بنفس الحرف. إذا خلص الفريق يبلغ صاحب الجلسة. إذا إجابات الفريقين صحيحة، الفائز هو الأسرع.";

  useEffect(() => {
    const next =
      letters[Math.floor(Math.random() * letters.length)];

    setLetter(next);

    setTimeLeft(timerSeconds);

    setRevealed(false);

    setSide1Ready(false);
    setSide2Ready(false);

    setSide1Time(null);
    setSide2Time(null);
  }, [roundKey, timerSeconds]);

  useEffect(() => {
    if (revealed) return;

    if (side1Ready && side2Ready) {
      setRevealed(true);
      return;
    }

    if (timerEnabled && timeLeft <= 0) {
      setRevealed(true);
      return;
    }

    if (!timerEnabled) return;

    const timer = setTimeout(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    timeLeft,
    revealed,
    side1Ready,
    side2Ready,
    timerEnabled,
  ]);

  function markReady(
    side: "side1" | "side2"
  ) {
    if (revealed) return;

    const elapsedTime = timerEnabled
      ? timerSeconds - timeLeft
      : null;

    if (side === "side1") {
      setSide1Ready(true);
      setSide1Time(elapsedTime);
    } else {
      setSide2Ready(true);
      setSide2Time(elapsedTime);
    }
  }

  const timerTextClass =
    timeLeft <= 5
      ? "animate-pulse text-red-300"
      : timeLeft <= 10
        ? "text-yellow-200"
        : "text-cyan-200";

  const progressWidth =
    timerEnabled && timerSeconds > 0
      ? `${Math.max(
          0,
          Math.min(
            100,
            (timeLeft / timerSeconds) * 100
          )
        )}%`
      : "100%";

  return (
    <GameLayout
      title="إنسان حيوان نبات جماد بلاد"
      side1={side1Name || "فريق 1"}
      side2={side2Name || "فريق 2"}

      side1Score={
        side1Ready ? (
          <span className="text-2xl sm:text-3xl">
            ✓ خلص
          </span>
        ) : (
          "..."
        )
      }

      side2Score={
        side2Ready ? (
          <span className="text-2xl sm:text-3xl">
            ✓ خلص
          </span>
        ) : (
          "..."
        )
      }

      turn={
        revealed
          ? "انتهى الوقت"
          : "الفريقين يلعبون"
      }

      turnSide="both"

      currentRound={currentRound}
    >
      <div className="flex flex-col gap-5">

        {/* Timer */}
        {timerEnabled && !revealed && (
          <div className="mx-auto w-full max-w-md">
            <div
              className={`text-3xl font-black ${timerTextClass}`}
            >
              ⏱️ {timeLeft}
            </div>

            <div className="mx-auto mt-2 h-2.5 w-full overflow-hidden rounded-full border border-white/10 bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-1000"
                style={{
                  width: progressWidth,
                }}
              />
            </div>
          </div>
        )}

        {/* Letter */}
        <div className="flex justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-[28px] border border-cyan-300/25 bg-[#1b1537] text-6xl font-black text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.15)] sm:h-32 sm:w-32 sm:text-7xl">
            {letter}
          </div>
        </div>

        {/* Instructions */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base font-black text-white">
            إنسان • حيوان • نبات • جماد • بلاد
          </p>

          <p className="mt-2 text-sm leading-7 text-white/55">
            {instructionText}
          </p>
        </div>

        {/* Finish buttons */}
        {!revealed && (
          <div className="grid gap-3 sm:grid-cols-2">

            <button
              type="button"
              onClick={() =>
                markReady("side1")
              }
              disabled={side1Ready}
              className={`rounded-2xl border px-5 py-4 font-black transition disabled:cursor-not-allowed ${
                side1Ready
                  ? "border-fuchsia-300/20 bg-fuchsia-500/10 text-fuchsia-100/50"
                  : "border-fuchsia-300/40 bg-fuchsia-500/15 text-fuchsia-100 hover:bg-fuchsia-500/25"
              }`}
            >
              {side1Ready
                ? "✓ خلص"
                : `${side1Name || "فريق 1"} خلص`}
            </button>

            <button
              type="button"
              onClick={() =>
                markReady("side2")
              }
              disabled={side2Ready}
              className={`rounded-2xl border px-5 py-4 font-black transition disabled:cursor-not-allowed ${
                side2Ready
                  ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-100/50"
                  : "border-cyan-300/40 bg-cyan-400/15 text-cyan-100 hover:bg-cyan-400/25"
              }`}
            >
              {side2Ready
                ? "✓ خلص"
                : `${side2Name || "فريق 2"} خلص`}
            </button>

          </div>
        )}

        {/* Results */}
        {revealed && (
          <div className="space-y-4">

            {(side1Time !== null ||
              side2Time !== null) && (
              <div className="flex flex-wrap justify-center gap-3">

                {side1Time !== null && (
                  <div className="rounded-full border border-fuchsia-300/20 bg-fuchsia-500/10 px-4 py-2 text-sm font-bold text-fuchsia-100">
                    {side1Name || "فريق 1"}:
                    {" "}
                    {side1Time} ث
                  </div>
                )}

                {side2Time !== null && (
                  <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-100">
                    {side2Name || "فريق 2"}:
                    {" "}
                    {side2Time} ث
                  </div>
                )}

              </div>
            )}

            <button
              type="button"
              onClick={() =>
                onRoundEnd()
              }
              className="btn-primary"
            >
              إنهاء الجولة
            </button>
          </div>
        )}

      </div>
    </GameLayout>
  );
}
