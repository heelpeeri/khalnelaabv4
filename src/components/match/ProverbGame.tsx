'use client';

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { PROVERB_PUZZLES as puzzles } from "@/data/proverbs";
import type { WinnerType } from "@/types/game";

export default function ProverbGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
}: {
  side1Name: string;
  side2Name: string;
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
}) {
  const ROUND_TIME = 20;

  const [index, setIndex] = useState(
    () => Math.floor(Math.random() * puzzles.length)
  );

  const current = useMemo(() => puzzles[index], [index]);

  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [revealed, setRevealed] = useState(false);

  const [side1Ready, setSide1Ready] = useState(false);
  const [side2Ready, setSide2Ready] = useState(false);
  const [side1Time, setSide1Time] = useState<number | null>(null);
  const [side2Time, setSide2Time] = useState<number | null>(null);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * puzzles.length));
    setTimeLeft(ROUND_TIME);
    setRevealed(false);
    setSide1Ready(false);
    setSide2Ready(false);
    setSide1Time(null);
    setSide2Time(null);
  }, [roundKey]);

  useEffect(() => {
    if (revealed) return;

    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, revealed]);

  const timerTextClass =
    timeLeft <= 5
      ? "animate-pulse font-black text-red-300"
      : timeLeft <= 10
      ? "font-black text-yellow-200"
      : "font-black text-cyan-200";

  return (
    <GlassCard className="relative min-h-[680px] overflow-hidden border border-pink-400/25 bg-[#10001f]/75 p-5 text-center shadow-[0_0_28px_rgba(255,0,153,0.15)] backdrop-blur-md md:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/75">
          EMOJI
        </p>

        <h2 className="mt-2 text-3xl font-black text-[#98ffb6]">
          خمن المثل
        </h2>

        {/* 🔥 SCORE + TIMER */}
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-pink-300/20 bg-pink-500/10 p-4">
            <p className="text-sm text-white/65">{side1Name}</p>
            <p className="mt-2 text-4xl font-black text-pink-200">
              {side1Ready ? "1" : "0"}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
            <p className="text-sm text-white/65">الوقت</p>
            <p className={`mt-2 text-4xl ${timerTextClass}`}>
              {timeLeft}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-white/10 p-4">
            <p className="text-sm text-white/65">{side2Name}</p>
            <p className="mt-2 text-4xl font-black text-cyan-200">
              {side2Ready ? "1" : "0"}
            </p>
          </div>
        </div>

        {/* 🔥 EMOJI */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 px-6 py-8">
          <div className="text-6xl md:text-7xl">
            {current.emoji}
          </div>
        </div>

        {!revealed && (
          <div className="mt-4 text-white/70">
            ركز... الوقت يمشي ⏳
          </div>
        )}

        {/* 🔥 BUTTONS (بدون كروت كبيرة) */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <button
              onClick={() => {
                setSide1Ready(true);
                setSide1Time(ROUND_TIME - timeLeft);
              }}
              disabled={side1Ready || revealed}
              className="rounded-xl border border-pink-300/20 bg-pink-500/10 px-4 py-3 font-bold text-white hover:bg-pink-500/20 disabled:opacity-50"
            >
              {side1Name} — خلصنا
            </button>

            <button
              onClick={() => {
                setSide2Ready(true);
                setSide2Time(ROUND_TIME - timeLeft);
              }}
              disabled={side2Ready || revealed}
              className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 font-bold text-white hover:bg-cyan-400/20 disabled:opacity-50"
            >
              {side2Name} — خلصنا
            </button>
          </div>
        </div>

        {/* 🔥 ACTIONS */}
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => setRevealed(true)} className="btn-secondary">
            إظهار المثل
          </button>

          <button onClick={() => onRoundEnd()} className="btn-primary">
            إنهاء الجولة
          </button>
        </div>

        {revealed && (
          <div className="mt-6 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-5">
            <p className="text-sm text-white/70">الإجابة</p>
            <p className="mt-2 text-2xl font-black text-white">
              {current.answer}
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
