"use client";

import { useEffect, useMemo, useState } from "react";
import GameLayout from "@/components/match/GameLayout";
import { InlineTeamPick } from "@/components/match/Overlays";
import { PROVERB_PUZZLES as puzzles } from "@/data/proverbs";
import { createDeck } from "@/lib/deck";
import { readRoundState, writeRoundState } from "@/lib/roundState";
import type { WinnerType } from "@/types/game";

const TOTAL_ROUNDS = 4;
const SECOND_TIME = 10;

type TeamSide = "side1" | "side2";

const proverbDeck = createDeck(puzzles);

type ProverbRoundState = {
  rounds: typeof puzzles;
  index: number;
  revealed: boolean;
  secondTurn: boolean;
  side1Score: number;
  side2Score: number;
};

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
  const [rounds, setRounds] = useState<typeof puzzles>([]);

  const [index, setIndex] = useState(0);

  const [loaded, setLoaded] = useState(false);

  const [timeLeft, setTimeLeft] = useState(timerSeconds);

  const [revealed, setRevealed] = useState(false);

  const [secondTurn, setSecondTurn] = useState(false);

  const [side1Score, setSide1Score] = useState(0);

  const [side2Score, setSide2Score] = useState(0);

  useEffect(() => {
    setLoaded(true);

    setTimeLeft(timerSeconds);

    const saved = readRoundState<ProverbRoundState>("draw", roundKey);

    if (saved && saved.rounds.length > 0) {
      setRounds(saved.rounds);
      setIndex(saved.index);
      setRevealed(saved.revealed);
      setSecondTurn(saved.secondTurn);
      setSide1Score(saved.side1Score);
      setSide2Score(saved.side2Score);
      return;
    }

    setRounds(proverbDeck.draw(TOTAL_ROUNDS));

    setIndex(0);

    setRevealed(false);
    setSecondTurn(false);

    setSide1Score(0);
    setSide2Score(0);
  }, [roundKey, timerSeconds]);

  useEffect(() => {
    if (!loaded || rounds.length === 0) {
      return;
    }

    writeRoundState<ProverbRoundState>("draw", roundKey, {
      rounds,
      index,
      revealed,
      secondTurn,
      side1Score,
      side2Score,
    });
  }, [
    loaded,
    roundKey,
    rounds,
    index,
    revealed,
    secondTurn,
    side1Score,
    side2Score,
  ]);

  const current = rounds[index];

  const mainTurn: TeamSide = useMemo(
    () => (index % 2 === 0 ? "side1" : "side2"),
    [index],
  );

  const activeTurn: TeamSide = secondTurn
    ? mainTurn === "side1"
      ? "side2"
      : "side1"
    : mainTurn;

  const activeTeamName =
    activeTurn === "side1" ? side1Name || "فريق 1" : side2Name || "فريق 2";

  useEffect(() => {
    if (!timerEnabled || revealed || !current) {
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
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, revealed, secondTurn, current, timerEnabled]);

  function finishGame(final1: number, final2: number) {
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

  function goNext(next1: number, next2: number) {
    if (index + 1 >= rounds.length) {
      finishGame(next1, next2);

      return;
    }

    setIndex((currentIndex) => currentIndex + 1);

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
    if (!loaded) return null;

    return (
      <div className="text-center text-white">
        <p>ما فيه أمثال كافية</p>

        <button
          type="button"
          onClick={() => onRoundEnd("none")}
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

  const isLastProverb = index + 1 >= rounds.length;

  return (
    <>
      <GameLayout
        title="خمن المثل"
        side1={side1Name || "فريق 1"}
        side2={side2Name || "فريق 2"}
        side1Score={side1Score}
        side2Score={side2Score}
        turn={activeTeamName}
        turnSide={activeTurn}
        currentRound={currentRound}
        game="draw"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/70">
              المثل <span className="text-white">{index + 1}</span>
              {" / "}
              {rounds.length}
            </div>

            {secondTurn && !revealed && (
              <div className="rounded-full border border-yellow-300/25 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-100">
                فرصة ثانية
              </div>
            )}

            {timerEnabled && !revealed && (
              <div
                className={`rounded-full border border-white/10 bg-white/5 px-4 py-2 text-lg font-black ${timerTextClass}`}
              >
                ⏱️ {timeLeft}
              </div>
            )}
          </div>

          <img
            key={current.image}
            src={current.image}
            alt="لغز المثل"
            className="mx-auto max-h-[300px] w-full max-w-[520px] rounded-3xl object-contain sm:max-h-[360px]"
          />

          {revealed && (
            <div className="rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-5">
              <p className="text-sm font-bold text-white/60">الإجابة</p>

              <p className="mt-2 text-2xl font-black text-white">
                {current.answer}
              </p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            {!revealed ? (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="btn-primary"
              >
                إظهار الإجابة
              </button>
            ) : (
              <InlineTeamPick
                resetKey={index}
                title={
                  isLastProverb
                    ? "مين جاوب صح؟ وبعدها تخلص الجولة"
                    : "مين جاوب صح؟"
                }
                side1Name={side1Name}
                side2Name={side2Name}
                onPick={givePoint}
              />
            )}
          </div>
        </div>
      </GameLayout>
    </>
  );
}
