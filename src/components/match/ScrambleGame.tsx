'use client';

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { SCRAMBLE_QUESTIONS as QUESTIONS } from "@/data/scramble";
import type { WinnerType } from "@/types/game";

export default function ScrambleGame({
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
  function shuffleWord(word: string) {
    let shuffled = word;

    while (shuffled === word) {
      const chars = word.split("");
      for (let i = chars.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      shuffled = chars.join("");
    }

    return shuffled.split("").join(" ");
  }

  const ROUND_TIME = 12;

  const [index, setIndex] = useState(
    () => Math.floor(Math.random() * QUESTIONS.length)
  );
  const current = useMemo(() => QUESTIONS[index], [index]);

  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [revealed, setRevealed] = useState(false);
  const [shuffled, setShuffled] = useState(() =>
    shuffleWord(QUESTIONS[index].answer)
  );
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  useEffect(() => {
    const next = Math.floor(Math.random() * QUESTIONS.length);
    setIndex(next);
    setShuffled(shuffleWord(QUESTIONS[next].answer));
    setTimeLeft(ROUND_TIME);
    setRevealed(false);
    setShowWinnerModal(false);
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

  function finishRound() {
    setRevealed(true);
    setShowWinnerModal(true);
  }

  function chooseWinner(side: WinnerType) {
    setShowWinnerModal(false);
    onRoundEnd(side);
  }

  const timerBoxClass =
    timeLeft <= 3
      ? "border-red-400/40 bg-red-500/15 text-red-300 animate-pulse"
      : timeLeft <= 6
      ? "border-yellow-300/30 bg-yellow-400/10 text-yellow-200"
      : "border-cyan-300/20 bg-cyan-400/10 text-cyan-200";

  const progressWidth = `${(timeLeft / ROUND_TIME) * 100}%`;

  return (
    <>
      <GlassCard className="relative min-h-[720px] overflow-hidden border border-pink-400/25 bg-[#10001f]/75 p-5 text-center shadow-[0_0_28px_rgba(255,0,153,0.15)] backdrop-blur-md md:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.06),_transparent_35%)]" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="text-sm font-black tracking-[0.22em] text-cyan-300/75">
            SCRAMBLE
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#98ffb6] drop-shadow-[0_0_14px_rgba(152,255,182,0.35)]">
            🧩 حروف بالخلاط
          </h2>

          <p className="mt-2 text-white/80">رتب الكلمة قبل غيرك</p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-pink-300/20 bg-pink-500/10 p-4">
              <p className="text-sm text-white/65">{side1Name}</p>
              <p className="mt-2 text-4xl font-black text-pink-200">0</p>
            </div>

            <div className={`rounded-2xl border p-4 shadow-[0_0_18px_rgba(34,211,238,0.08)] ${timerBoxClass}`}>
              <p className="text-sm text-white/65">الوقت المتبقي</p>
              <p className="mt-2 text-4xl font-black">{timeLeft}</p>

              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full border border-white/10 bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-300 transition-all duration-1000"
                  style={{ width: progressWidth }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
              <p className="text-sm text-white/65">{side2Name}</p>
              <p className="mt-2 text-4xl font-black text-cyan-200">0</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-lg font-black text-white">
            {revealed ? "انكشف الحل — اختر الفائز" : "رتب الحروف بأسرع وقت"}
          </div>

          <div className="mt-7 rounded-3xl border border-white/15 bg-white/10 p-5 shadow-[0_0_18px_rgba(255,255,255,0.04)] md:p-6">
            <p className="text-lg font-black text-white">
              التصنيف: <span className="text-cyan-300">{current.category}</span>
            </p>

            <div className="mt-6 rounded-2xl border border-pink-300/20 bg-pink-500/10 px-4 py-6">
              <div className="text-4xl font-black tracking-[0.35em] text-pink-300 drop-shadow-[0_0_20px_rgba(255,0,150,0.9)] md:text-6xl">
                {shuffled}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-white/80">
            إذا أحد عرفها، اضغط <span className="font-black text-white">إنهاء الجولة</span>
          </div>

          {revealed && (
            <div className="winner-animated mt-6 rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm text-white/70">الإجابة الصحيحة</p>
              <p className="mt-2 text-4xl font-black text-white">{current.answer}</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setRevealed(true)}
              disabled={revealed}
              className="btn-secondary disabled:opacity-50"
            >
              إظهار الإجابة
            </button>

            <button
              type="button"
              onClick={finishRound}
              className="btn-primary min-w-[180px]"
            >
              إنهاء الجولة
            </button>
          </div>
        </div>
      </GlassCard>

      {showWinnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] border border-white/20 bg-[#7a001f] p-6 text-center shadow-2xl">
            <h3 className="mt-2 text-3xl font-black">🏆 من فاز؟</h3>
            <p className="mt-2 text-white/75">اختر الفائز في هذه الجولة</p>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => chooseWinner("side1")}
                className="btn-primary w-full"
              >
                {side1Name}
              </button>

              <button
                onClick={() => chooseWinner("side2")}
                className="btn-primary w-full"
              >
                {side2Name}
              </button>

              <button
                onClick={() => chooseWinner("none")}
                className="btn-secondary w-full"
              >
                لا أحد
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
