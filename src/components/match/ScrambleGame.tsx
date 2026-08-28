'use client';

import { useEffect, useMemo, useState } from "react";
import GameLayout from "@/components/match/GameLayout";
import { WHO_GAME } from "@/data/scramble";
import type { WinnerType } from "@/types/game";

const TOTAL_ROUNDS = 6;

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

  const [rounds, setRounds] =
    useState<typeof WHO_GAME>([]);

  const [started, setStarted] =
    useState(false);

  const [revealed, setRevealed] =
    useState(false);

  const [timeLeft, setTimeLeft] =
    useState(timerSeconds);

  const [origin, setOrigin] =
    useState("");

  const [side1Score, setSide1Score] =
    useState(0);

  const [side2Score, setSide2Score] =
    useState(0);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    const selected = shuffleArray(
      WHO_GAME
    ).slice(0, TOTAL_ROUNDS);

    setRounds(selected);
    setIndex(0);

    setStarted(false);
    setRevealed(false);

    setTimeLeft(timerSeconds);

    setSide1Score(0);
    setSide2Score(0);
  }, [roundKey, timerSeconds]);

  const current = rounds[index];

  /*
    الفريق يتغير مع كل شخصية.
  */
  const activeSide: TeamSide =
    useMemo(
      () =>
        index % 2 === 0
          ? "side1"
          : "side2",
      [index]
    );

  const activeTeamName =
    activeSide === "side1"
      ? side1Name || "فريق 1"
      : side2Name || "فريق 2";

  const personUrl =
    current && origin
      ? `${origin}/person/${current.id}`
      : "";

  useEffect(() => {
    if (
      !timerEnabled ||
      !started ||
      revealed ||
      !current
    ) {
      return;
    }

    if (timeLeft <= 0) {
      setRevealed(true);
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
    timerEnabled,
    started,
    revealed,
    timeLeft,
    current,
  ]);

  function startGuessing() {
    setStarted(true);
    setTimeLeft(timerSeconds);
  }

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
      index + 1 >=
      rounds.length
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

    setStarted(false);
    setRevealed(false);

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

    goNext(
      next1,
      next2
    );
  }

  if (!current) {
    return (
      <div className="text-center text-white">
        <p>
          ما فيه شخصيات كافية
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

  const timerClass =
    timeLeft <= 5
      ? "animate-pulse text-red-300"
      : timeLeft <= 10
        ? "text-yellow-300"
        : "text-cyan-300";

  return (
    <GameLayout
      title="منهو ذا؟"
      side1={
        side1Name || "فريق 1"
      }
      side2={
        side2Name || "فريق 2"
      }
      side1Score={side1Score}
      side2Score={side2Score}

      /*
        اسم الفريق الحالي
      */
      turn={activeTeamName}

      /*
        يحدد لون الفريق بشكل مضمون
      */
      turnSide={activeSide}

      currentRound={currentRound}
    >
      <div className="flex flex-col gap-4">

        {/* معلومات الشخصية + المؤقت */}
        <div className="flex flex-wrap items-center justify-center gap-2">

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/70">
            الشخصية{" "}
            <span className="text-white">
              {index + 1}
            </span>
            {" / "}
            {rounds.length}
          </div>

          {started &&
            !revealed &&
            timerEnabled && (
              <div
                className={`rounded-full border border-white/10 bg-white/5 px-4 py-2 text-lg font-black ${timerClass}`}
              >
                ⏱️ {timeLeft}
              </div>
            )}

          {!started &&
            !revealed && (
              <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-100">
                امسح الكود ثم ابدأ الوصف
              </div>
            )}
        </div>

        {/* الشخصية */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 sm:p-6">

          {!revealed ? (
            <div className="flex flex-col items-center gap-4">

              {personUrl && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                    personUrl
                  )}`}
                  alt="QR Code"
                  className="h-[250px] w-[250px] rounded-2xl bg-white p-2 sm:h-[280px] sm:w-[280px]"
                />
              )}

              <div>
                <p className="text-lg font-black text-white">
                  امسح الكود وشوف الشخصية
                </p>

                <p className="mt-1 text-sm font-bold text-white/50">
                  لا تقول الاسم، اوصف فقط
                </p>
              </div>
            </div>
          ) : (
            <div>
              <img
                src={current.image}
                alt={current.answer}
                className="mx-auto max-h-[420px] rounded-3xl object-contain"
              />

              <p className="mt-4 text-2xl font-black text-white">
                {current.answer}
              </p>
            </div>
          )}
        </div>

        {/* الأزرار */}
        <div className="flex flex-wrap justify-center gap-3">

          {!started &&
            !revealed && (
              <button
                type="button"
                onClick={startGuessing}
                className="btn-primary"
              >
                ابدأ الوصف
              </button>
            )}

          {started &&
            !revealed && (
              <button
                type="button"
                onClick={() =>
                  setRevealed(true)
                }
                className="btn-primary"
              >
                إظهار الإجابة
              </button>
            )}

          {revealed && (
            <>
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
