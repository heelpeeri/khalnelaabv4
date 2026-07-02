'use client';

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { PROVERB_PUZZLES as puzzles } from "@/data/proverbs";
import type { WinnerType } from "@/types/game";

const TOTAL_ROUNDS = 6;
const SECOND_TIME = 10;

function shuffleArray<T>(items: T[]) {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export default function ProverbGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
  timerEnabled = false,
  timerSeconds = 30,
}: {
  side1Name: string;
  side2Name: string;
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  timerEnabled?: boolean;
  timerSeconds?: number;
}) {
  const [rounds, setRounds] = useState<typeof puzzles>([]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [revealed, setRevealed] = useState(false);
  const [secondTurn, setSecondTurn] = useState(false);

  const [side1Score, setSide1Score] = useState(0);
  const [side2Score, setSide2Score] = useState(0);

  useEffect(() => {
    setRounds(shuffleArray(puzzles).slice(0, TOTAL_ROUNDS));
    setIndex(0);
    setTimeLeft(timerSeconds);
    setRevealed(false);
    setSecondTurn(false);
    setSide1Score(0);
    setSide2Score(0);
  }, [roundKey, timerSeconds]);

  const current = rounds[index];

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

  useEffect(() => {
    if (!timerEnabled || revealed || !current) return;

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
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, revealed, secondTurn, current, timerEnabled]);

  function finishGame(final1: number, final2: number) {
    if (final1 > final2) return onRoundEnd("side1");
    if (final2 > final1) return onRoundEnd("side2");
    return onRoundEnd("none");
  }

  function goNext(next1: number, next2: number) {
    if (index + 1 >= TOTAL_ROUNDS) {
      finishGame(next1, next2);
      return;
    }

    setIndex((i) => i + 1);
    setTimeLeft(timerSeconds);
    setRevealed(false);
    setSecondTurn(false);
  }

  function givePoint(winner: "side1" | "side2" | "none") {
    const next1 = side1Score + (winner === "side1" ? 1 : 0);
    const next2 = side2Score + (winner === "side2" ? 1 : 0);

    setSide1Score(next1);
    setSide2Score(next2);

    goNext(next1, next2);
  }

  if (!current) {
    return (
      <div className="text-center text-white">
        <p>ما فيه أمثال كافية</p>
        <button onClick={() => onRoundEnd("none")} className="btn-primary mt-4">
          إنهاء الجولة
        </button>
      </div>
    );
  }

  const timerTextClass =
    timeLeft <= 5
      ? "animate-pulse font-black text-red-300"
      : timeLeft <= 10
      ? "font-black text-yellow-200"
      : "font-black text-cyan-200";

  return (
    <GlassCard className="relative min-h-[680px] overflow-hidden border border-pink-400/25 bg-[#10001f]/75 p-5 text-center text-white shadow-[0_0_28px_rgba(255,0,153,0.15)] backdrop-blur-md md:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/75">
          EMOJI
        </p>

        <h2 className="mt-2 text-3xl font-black text-[#98ffb6]">
          خمن المثل
        </h2>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div
            className={`rounded-2xl p-4 ${
              activeTurn === "side1"
                ? "border border-pink-300/40 bg-pink-500/20"
                : "border border-pink-300/20 bg-pink-500/10"
            }`}
          >
            <p className="text-sm text-white/65">{side1Name || "فريق 1"}</p>
            <p className="mt-2 text-4xl font-black text-pink-200">
              {side1Score}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
            <p className="text-sm text-white/65">
              {secondTurn ? "دور الفريق الثاني" : "الدور"}
            </p>

            <p className="mt-1 text-lg font-black text-white">
              {activeTeamName}
            </p>

            {timerEnabled ? (
              <p className={`mt-2 text-4xl ${timerTextClass}`}>{timeLeft}</p>
            ) : (
              <p className="mt-2 text-sm font-bold text-white/50">بدون مؤقت</p>
            )}
          </div>

          <div
            className={`rounded-2xl p-4 ${
              activeTurn === "side2"
                ? "border border-cyan-300/40 bg-cyan-400/20"
                : "border border-cyan-300/20 bg-white/10"
            }`}
          >
            <p className="text-sm text-white/65">{side2Name || "فريق 2"}</p>
            <p className="mt-2 text-4xl font-black text-cyan-200">
              {side2Score}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm font-bold text-white/70">
          المثل {index + 1} / {TOTAL_ROUNDS}
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 px-6 py-8">
          <img
  src={current.image}
  alt="لغز المثل"
  className="mx-auto max-h-[360px] w-full max-w-[520px] rounded-3xl object-contain"
/>
        </div>

        {revealed && (
          <div className="mt-6 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-5">
            <p className="text-sm text-white/70">الإجابة</p>
            <p className="mt-2 text-2xl font-black text-white">
              {current.answer}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {!revealed ? (
            <button onClick={() => setRevealed(true)} className="btn-primary">
              إظهار الإجابة
            </button>
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
    </GlassCard>
  );
}
