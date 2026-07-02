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
    'فكروا في: إنسان – حيوان – نبات – جماد – بلاد، كلها بنفس الحرف. إذا خلص الفريق يبلغ صاحب الجلسة. إذا إجابات الفريقين صحيحة، الفائز هو الأسرع.';

  useEffect(() => {
    const next = letters[Math.floor(Math.random() * letters.length)];

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
  }, [timeLeft, revealed, side1Ready, side2Ready, timerEnabled]);

  function markReady(side: "side1" | "side2") {
    if (revealed) return;

    const elapsedTime = timerEnabled ? timerSeconds - timeLeft : null;

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
      ? "animate-pulse font-black text-red-300"
      : timeLeft <= 10
      ? "font-black text-yellow-200"
      : "font-black text-cyan-200";

  const progressWidth = timerEnabled
    ? `${(timeLeft / timerSeconds) * 100}%`
    : "100%";

  return (
    <GlassCard className="relative min-h-[700px] overflow-hidden border border-pink-400/25 bg-[#10001f]/75 p-5 text-center shadow-[0_0_28px_rgba(255,0,153,0.15)] backdrop-blur-md md:p-7">
      <RoundBadge currentRound={currentRound} />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/75">
          CATEGORIES
        </p>

        <h2 className="mt-2 text-3xl font-black text-[#98ffb6] drop-shadow-[0_0_14px_rgba(152,255,182,0.35)]">
          إنسان حيوان نبات جماد بلاد
        </h2>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-pink-300/20 bg-pink-500/10 p-4">
            <p className="text-sm text-white/65">{side1Name}</p>
            <p className="mt-2 text-4xl font-black text-pink-200">
              {side1Ready ? "خلص" : "..." }
            </p>
            {side1Time !== null && (
              <p className="mt-1 text-xs text-white/70">{side1Time} ث</p>
            )}
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 shadow-[0_0_18px_rgba(34,211,238,0.08)]">
            <p className="text-sm text-white/65">الوقت</p>

            {timerEnabled ? (
              <>
                <p className={`mt-2 text-4xl ${timerTextClass}`}>
                  {timeLeft}
                </p>

                <div className="mt-3 h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-300 transition-all duration-1000"
                    style={{ width: progressWidth }}
                  />
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm font-bold text-white/50">
                بدون مؤقت
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-white/10 p-4">
            <p className="text-sm text-white/65">{side2Name}</p>
            <p className="mt-2 text-4xl font-black text-cyan-200">
              {side2Ready ? "خلص" : "..." }
            </p>
            {side2Time !== null && (
              <p className="mt-1 text-xs text-white/70">{side2Time} ث</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="rounded-[28px] border border-cyan-300/20 bg-[#1b1537] px-10 py-7 text-6xl font-black text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.15)] md:px-12 md:py-8 md:text-7xl">
            {letter}
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 text-center">
          <p className="text-lg font-black text-white">تعليمات الجولة</p>
          <p className="mt-3 leading-8 text-white/80">{instructionText}</p>
        </div>

        {!revealed && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => markReady("side1")}
              disabled={side1Ready}
              className="btn-secondary disabled:opacity-50"
            >
              {side1Name || "فريق 1"} خلص
            </button>

            <button
              type="button"
              onClick={() => markReady("side2")}
              disabled={side2Ready}
              className="btn-secondary disabled:opacity-50"
            >
              {side2Name || "فريق 2"} خلص
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => onRoundEnd()}
            disabled={!revealed}
            className="btn-primary disabled:opacity-50"
          >
            إنهاء الجولة
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
