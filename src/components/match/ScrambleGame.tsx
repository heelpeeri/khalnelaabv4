'use client';

import { useEffect, useMemo, useState } from "react";
<img
  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(personUrl)}`}
  alt="QR Code"
  className="h-[260px] w-[260px] rounded-2xl"
/>
import { GlassCard } from "@/components/GlassCard";
import RoundBadge from "@/components/match/RoundBadge";
import { WHO_GAME } from "@/data/whoGame";
import type { WinnerType } from "@/types/game";

const TOTAL_ROUNDS = 6;

export default function ScrambleGame({
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
  const [index, setIndex] = useState(0);
  const [rounds, setRounds] = useState<typeof WHO_GAME>([]);
  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);

  const [side1Score, setSide1Score] = useState(0);
  const [side2Score, setSide2Score] = useState(0);

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  function shuffleArray<T>(items: T[]) {
    const array = [...items];

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  useEffect(() => {
    const selected = shuffleArray(WHO_GAME).slice(0, TOTAL_ROUNDS);

    setRounds(selected);
    setIndex(0);
    setStarted(false);
    setRevealed(false);
    setTimeLeft(timerSeconds);
    setSide1Score(0);
    setSide2Score(0);
  }, [roundKey, timerSeconds]);

  const current = rounds[index];

  const activeSide: "side1" | "side2" = useMemo(
    () => (index % 2 === 0 ? "side1" : "side2"),
    [index]
  );

  const activeTeamName =
    activeSide === "side1" ? side1Name || "فريق 1" : side2Name || "فريق 2";

  const personUrl = current && origin ? `${origin}/person/${current.id}` : "";

  useEffect(() => {
    if (!timerEnabled || !started || revealed || !current) return;

    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timerEnabled, started, revealed, timeLeft, current]);

  function startGuessing() {
    setStarted(true);
    setTimeLeft(timerSeconds);
  }

  function finishGame(final1: number, final2: number) {
    if (final1 > final2) return onRoundEnd("side1");
    if (final2 > final1) return onRoundEnd("side2");
    return onRoundEnd("none");
  }

  function goNext(next1: number, next2: number) {
    if (index + 1 >= rounds.length) {
      finishGame(next1, next2);
      return;
    }

    setIndex((i) => i + 1);
    setStarted(false);
    setRevealed(false);
    setTimeLeft(timerSeconds);
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
        <p>ما فيه شخصيات كافية</p>
        <button onClick={() => onRoundEnd("none")} className="btn-primary mt-4">
          إنهاء الجولة
        </button>
      </div>
    );
  }

  const timerClass =
    timeLeft <= 5
      ? "text-red-300 animate-pulse"
      : timeLeft <= 10
      ? "text-yellow-300"
      : "text-cyan-300";

  return (
    <GlassCard className="relative min-h-[700px] overflow-hidden border border-pink-400/25 bg-[#10001f]/75 p-5 text-center text-white shadow-[0_0_28px_rgba(255,0,153,0.15)] backdrop-blur-md md:p-7">
      <RoundBadge currentRound={currentRound} />

      <div className="relative z-10 mx-auto max-w-4xl">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/75">
          WHO IS THIS?
        </p>

        <h2 className="mt-2 text-3xl font-black text-[#98ffb6]">
          منهو ذا؟
        </h2>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-pink-300/20 bg-pink-500/10 p-4">
            <p className="text-sm text-white/65">{side1Name || "فريق 1"}</p>
            <p className="mt-2 text-4xl font-black text-pink-200">
              {side1Score}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
            <p className="text-sm text-white/65">الدور</p>
            <p className="mt-1 text-lg font-black">{activeTeamName}</p>

            {started ? (
              timerEnabled ? (
                <p className={`mt-2 text-4xl font-black ${timerClass}`}>
                  {timeLeft}
                </p>
              ) : (
                <p className="mt-2 text-sm font-bold text-white/50">
                  بدون مؤقت
                </p>
              )
            ) : (
              <p className="mt-2 text-sm font-bold text-white/50">
                امسح الكود ثم اضغط بدأ الوصف
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-white/10 p-4">
            <p className="text-sm text-white/65">{side2Name || "فريق 2"}</p>
            <p className="mt-2 text-4xl font-black text-cyan-200">
              {side2Score}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm font-bold text-white/70">
          الشخصية {index + 1} / {rounds.length}
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white p-6">
          {!revealed ? (
            <div className="flex flex-col items-center gap-4">
              {personUrl && (
                <QRCodeSVG
                  value={personUrl}
                  size={260}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
              )}

              <p className="text-lg font-black text-black">
                امسح الكود وشوف الشخصية
              </p>

              <p className="text-sm font-bold text-black/55">
                لا تقول الاسم، اوصف فقط
              </p>
            </div>
          ) : (
            <div>
              <img
                src={current.image}
                alt={current.answer}
                className="mx-auto max-h-[360px] rounded-3xl object-contain"
              />

              <p className="mt-4 text-3xl font-black text-black">
                {current.answer}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {!started && !revealed && (
            <button onClick={startGuessing} className="btn-primary">
              بدأ الوصف
            </button>
          )}

          {started && !revealed && (
            <button onClick={() => setRevealed(true)} className="btn-primary">
              إظهار الإجابة
            </button>
          )}

          {revealed && (
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
