'use client';

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import RoundBadge from "@/components/match/RoundBadge";
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
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    timeLeft,
    revealed,
    side1Ready,
    side2Ready,
    timerEnabled,
  ]);

  function markReady(side: "side1" | "side2") {
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
          Math.min(100, (timeLeft / timerSeconds) * 100)
        )}%`
      : "100%";

  return (
    <GlassCard className="relative min-h-[700px] overflow-hidden border border-white/10 bg-[#121028]/80 p-5 text-center shadow-[0_0_30px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-7">
      <RoundBadge currentRound={currentRound} />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            إنسان حيوان نبات جماد بلاد
          </h2>
        </div>

        {/* Teams + Both Playing */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Team 1 */}
          <div
            className={`flex min-h-[128px] flex-col items-center justify-center rounded-2xl border px-4 py-4 transition-all duration-500 ${
              side1Ready
                ? "border-fuchsia-300/30 bg-fuchsia-500/10 opacity-65"
                : "scale-[1.02] border-fuchsia-300/70 bg-gradient-to-br from-fuchsia-500/30 via-pink-500/20 to-purple-500/15 shadow-[0_0_32px_rgba(217,70,239,0.30)]"
            }`}
          >
            <p
              className={`text-sm font-bold ${
                side1Ready
                  ? "text-white/55"
                  : "text-fuchsia-100"
              }`}
            >
              {side1Name || "فريق 1"}
            </p>

            <p
              className={`mt-2 flex min-h-[52px] items-center justify-center font-black leading-none ${
                side1Ready
                  ? "text-2xl text-fuchsia-100"
                  : "text-4xl text-fuchsia-100 sm:text-5xl"
              }`}
            >
              {side1Ready ? "✓ خلص" : "..."}
            </p>

            {side1Time !== null && (
              <p className="mt-1 text-xs font-bold text-white/55">
                {side1Time} ث
              </p>
            )}
          </div>

          {/* Both Playing */}
          <div className="flex min-h-[128px] flex-col items-center justify-center rounded-2xl border border-purple-300/70 bg-gradient-to-r from-fuchsia-500/30 via-purple-500/25 to-cyan-400/30 px-4 py-4 shadow-[0_0_38px_rgba(168,85,247,0.30)]">
            <p className="text-sm font-bold text-white/65">
              اللعب الآن
            </p>

            <p className="mt-2 text-2xl font-black text-white sm:text-3xl">
              الفريقين يلعبون
            </p>

            {timerEnabled && !revealed && (
              <p
                className={`mt-2 text-3xl font-black ${timerTextClass}`}
              >
                ⏱️ {timeLeft}
              </p>
            )}
          </div>

          {/* Team 2 */}
          <div
            className={`flex min-h-[128px] flex-col items-center justify-center rounded-2xl border px-4 py-4 transition-all duration-500 ${
              side2Ready
                ? "border-cyan-300/30 bg-cyan-400/10 opacity-65"
                : "scale-[1.02] border-cyan-300/70 bg-gradient-to-br from-cyan-400/30 via-sky-500/20 to-blue-500/15 shadow-[0_0_32px_rgba(34,211,238,0.30)]"
            }`}
          >
            <p
              className={`text-sm font-bold ${
                side2Ready
                  ? "text-white/55"
                  : "text-cyan-100"
              }`}
            >
              {side2Name || "فريق 2"}
            </p>

            <p
              className={`mt-2 flex min-h-[52px] items-center justify-center font-black leading-none ${
                side2Ready
                  ? "text-2xl text-cyan-100"
                  : "text-4xl text-cyan-100 sm:text-5xl"
              }`}
            >
              {side2Ready ? "✓ خلص" : "..."}
            </p>

            {side2Time !== null && (
              <p className="mt-1 text-xs font-bold text-white/55">
                {side2Time} ث
              </p>
            )}
          </div>
        </div>

        {/* Timer progress */}
        {timerEnabled && !revealed && (
          <div className="mx-auto mt-4 max-w-md">
            <div className="h-2.5 w-full overflow-hidden rounded-full border border-white/10 bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 transition-all duration-1000"
                style={{ width: progressWidth }}
              />
            </div>
          </div>
        )}

        {/* Letter */}
        <div className="mt-7 flex justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-[28px] border border-purple-300/30 bg-[#1b1537] text-6xl font-black text-white shadow-[0_0_28px_rgba(168,85,247,0.18)] sm:h-32 sm:w-32 sm:text-7xl">
            {letter}
          </div>
        </div>

        {/* Instructions */}
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
          <p className="font-black text-white">
            إنسان • حيوان • نبات • جماد • بلاد
          </p>

          <p className="mt-2 text-sm leading-7 text-white/60">
            {instructionText}
          </p>
        </div>

        {/* Ready buttons */}
        {!revealed && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => markReady("side1")}
              disabled={side1Ready}
              className={`rounded-2xl border px-5 py-4 font-black transition disabled:cursor-not-allowed ${
                side1Ready
                  ? "border-fuchsia-300/20 bg-fuchsia-500/10 text-fuchsia-100/40"
                  : "border-fuchsia-300/40 bg-fuchsia-500/15 text-fuchsia-100 hover:bg-fuchsia-500/25"
              }`}
            >
              {side1Ready
                ? "✓ خلص"
                : `${side1Name || "فريق 1"} خلص`}
            </button>

            <button
              type="button"
              onClick={() => markReady("side2")}
              disabled={side2Ready}
              className={`rounded-2xl border px-5 py-4 font-black transition disabled:cursor-not-allowed ${
                side2Ready
                  ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-100/40"
                  : "border-cyan-300/40 bg-cyan-400/15 text-cyan-100 hover:bg-cyan-400/25"
              }`}
            >
              {side2Ready
                ? "✓ خلص"
                : `${side2Name || "فريق 2"} خلص`}
            </button>
          </div>
        )}

        {/* Finish */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => onRoundEnd()}
            disabled={!revealed}
            className="btn-primary disabled:opacity-40"
          >
            إنهاء الجولة
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
