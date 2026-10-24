'use client';

import { useEffect, useMemo, useState } from "react";
import QrCode from "@/components/QrCode";
import GameLayout from "@/components/match/GameLayout";
import { JudgeModal } from "@/components/match/Overlays";
import { WHO_GAME } from "@/data/scramble";
import { createDeck } from "@/lib/deck";
import type { WinnerType } from "@/types/game";

const TOTAL_ROUNDS = 2;

type TeamSide = "side1" | "side2";

const peopleDeck = createDeck(WHO_GAME);

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

  const [loaded, setLoaded] =
    useState(false);

  const [rounds, setRounds] =
    useState<typeof WHO_GAME>([]);

  const [started, setStarted] =
    useState(false);

  const [revealed, setRevealed] =
    useState(false);

  const [showJudge, setShowJudge] =
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
    setLoaded(true);

    setRounds(
      peopleDeck.draw(TOTAL_ROUNDS)
    );

    setIndex(0);

    setStarted(false);
    setRevealed(false);
    setShowJudge(false);

    setTimeLeft(timerSeconds);

    setSide1Score(0);
    setSide2Score(0);
  }, [
    roundKey,
    timerSeconds,
  ]);

  const current =
    rounds[index];

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
      !current ||
      showJudge
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
    showJudge,
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
    setShowJudge(false);

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

    setShowJudge(false);

    goNext(
      next1,
      next2
    );
  }

  function markCorrect() {
    givePoint(activeSide);
  }

  function markWrong() {
    givePoint("none");
  }

  if (!current) {
    if (!loaded) return null;

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

  const isLastCharacter =
    index + 1 >= rounds.length;

  return (
    <>
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
        turn={activeTeamName}
        turnSide={activeSide}
        currentRound={currentRound}
      >
        <div className="flex flex-col gap-4">

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
                  واحد من {activeTeamName} يمسح الكود
                </div>
              )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 sm:p-6">
            {!revealed ? (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-2xl bg-white p-2.5">
                  {personUrl ? (
                    <QrCode
                      value={personUrl}
                      label="كود الشخصية"
                      className="h-[220px] w-[220px] sm:h-[240px] sm:w-[240px]"
                    />
                  ) : (
                    <div className="h-[220px] w-[220px] sm:h-[240px] sm:w-[240px]" />
                  )}
                </div>

                <div>
                  <p className="text-lg font-black text-white">
                    امسح وشوف الشخصية
                  </p>

                  <p className="mt-1 text-sm font-bold text-white/50">
                    اوصفها بدون ما تقول الاسم
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <img
                  src={current.image}
                  alt={current.answer}
                  className="mx-auto max-h-[300px] max-w-full rounded-3xl object-contain sm:max-h-[420px]"
                />

                <p className="mt-4 text-2xl font-black text-white">
                  {current.answer}
                </p>
              </div>
            )}
          </div>

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
              <button
                type="button"
                onClick={() =>
                  setShowJudge(true)
                }
                className="btn-primary min-w-[170px]"
              >
                {isLastCharacter
                  ? "إنهاء الجولة"
                  : "الشخصية اللي بعدها"}
              </button>
            )}
          </div>
        </div>
      </GameLayout>

      <JudgeModal
        show={showJudge}
        teamName={activeTeamName}
        onCorrect={markCorrect}
        onWrong={markWrong}
      />
    </>
  );
}
