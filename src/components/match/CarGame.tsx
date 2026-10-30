"use client";

import { useEffect, useMemo, useState } from "react";

import GameLayout from "@/components/match/GameLayout";
import { InlineJudge } from "@/components/match/Overlays";
import { CARS, type CarItem } from "@/data/cars";
import { createDeck } from "@/lib/deck";
import { readRoundState, writeRoundState } from "@/lib/roundState";
import type { WinnerType } from "@/types/game";

const CARS_PER_ROUND = 2;

const ZOOM_LEVELS = [4, 2.2, 1];

const STAGE_POINTS = [3, 2, 1];

type TeamSide = "side1" | "side2";

const carDeck = createDeck(CARS);

type CarRoundState = {
  rounds: CarItem[];
  index: number;
  stage: number;
  revealed: boolean;
  side1Score: number;
  side2Score: number;
};

function pointsLabel(points: number) {
  if (points === 1) return "نقطة";
  if (points === 2) return "نقطتين";

  return `${points} نقاط`;
}

function getStageSeconds(timerSeconds: number) {
  return Math.max(5, Math.round(timerSeconds / ZOOM_LEVELS.length));
}

export default function CarGame({
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
  const stageSeconds = getStageSeconds(timerSeconds);

  const [index, setIndex] = useState(0);

  const [rounds, setRounds] = useState<CarItem[]>([]);

  const [stage, setStage] = useState(0);

  const [revealed, setRevealed] = useState(false);

  const [timeLeft, setTimeLeft] = useState(stageSeconds);

  const [side1Score, setSide1Score] = useState(0);

  const [side2Score, setSide2Score] = useState(0);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);

    setTimeLeft(stageSeconds);

    const saved = readRoundState<CarRoundState>("car", roundKey);

    if (saved && saved.rounds.length > 0) {
      setRounds(saved.rounds);
      setIndex(saved.index);
      setStage(saved.stage);
      setRevealed(saved.revealed);
      setSide1Score(saved.side1Score);
      setSide2Score(saved.side2Score);
      return;
    }

    setRounds(carDeck.draw(CARS_PER_ROUND));
    setIndex(0);
    setStage(0);
    setRevealed(false);
    setSide1Score(0);
    setSide2Score(0);
  }, [roundKey, stageSeconds]);

  useEffect(() => {
    if (!loaded || rounds.length === 0) {
      return;
    }

    writeRoundState<CarRoundState>("car", roundKey, {
      rounds,
      index,
      stage,
      revealed,
      side1Score,
      side2Score,
    });
  }, [
    loaded,
    roundKey,
    rounds,
    index,
    stage,
    revealed,
    side1Score,
    side2Score,
  ]);

  const current = rounds[index];

  const activeSide: TeamSide = useMemo(
    () => (index % 2 === 0 ? "side1" : "side2"),
    [index],
  );

  const activeTeamName =
    activeSide === "side1" ? side1Name || "فريق 1" : side2Name || "فريق 2";

  const isLastStage = stage >= ZOOM_LEVELS.length - 1;

  const stagePoints = STAGE_POINTS[stage];

  useEffect(() => {
    if (!timerEnabled || revealed || !current) {
      return;
    }

    if (timeLeft <= 0) {
      if (isLastStage) {
        setRevealed(true);
      } else {
        setStage((previous) => previous + 1);
        setTimeLeft(stageSeconds);
      }

      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timerEnabled, revealed, timeLeft, current, isLastStage, stageSeconds]);

  function zoomOut() {
    if (isLastStage) {
      return;
    }

    setStage((previous) => previous + 1);
    setTimeLeft(stageSeconds);
  }

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
    setStage(0);
    setRevealed(false);
    setTimeLeft(stageSeconds);
  }

  function award(points: number) {
    const next1 = side1Score + (activeSide === "side1" ? points : 0);

    const next2 = side2Score + (activeSide === "side2" ? points : 0);

    setSide1Score(next1);
    setSide2Score(next2);

    goNext(next1, next2);
  }

  if (!current) {
    if (!loaded) return null;

    return (
      <div className="text-center text-white">
        <p>ما فيه سيارات كافية</p>

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

  const timerClass =
    timeLeft <= 3
      ? "animate-pulse text-red-300"
      : timeLeft <= 6
        ? "text-yellow-300"
        : "text-cyan-300";

  const zoom = revealed ? 1 : ZOOM_LEVELS[stage];

  return (
    <GameLayout
      title="عينك عالموتر"
      side1={side1Name || "فريق 1"}
      side2={side2Name || "فريق 2"}
      side1Score={side1Score}
      side2Score={side2Score}
      turn={activeTeamName}
      turnSide={activeSide}
      currentRound={currentRound}
      game="car"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/70">
            الموتر <span className="text-white">{index + 1}</span>
            {" / "}
            {rounds.length}
          </div>

          {!revealed && (
            <div className="rounded-full border border-yellow-300/25 bg-yellow-300/10 px-4 py-2 text-sm font-black text-yellow-100">
              لو عرفتوه الحين: {pointsLabel(stagePoints)}
            </div>
          )}

          {!revealed && timerEnabled && (
            <div
              className={`rounded-full border border-white/10 bg-white/5 px-4 py-2 text-lg font-black ${timerClass}`}
            >
              ⏱️ {timeLeft}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-3 sm:p-5">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-[22px] bg-black">
            <img
              src={current.image}
              alt={revealed ? `${current.brand} ${current.model}` : ""}
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition-transform duration-500 ease-[var(--ease-out)]"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: `${current.focusX}% ${current.focusY}%`,
              }}
            />
          </div>

          {!revealed && (
            <div
              className="mt-3 flex justify-center gap-1.5"
              aria-hidden="true"
            >
              {ZOOM_LEVELS.map((_, level) => (
                <span
                  key={level}
                  className={`h-1.5 w-8 rounded-full ${
                    level <= stage ? "bg-cyan-300" : "bg-white/15"
                  }`}
                />
              ))}
            </div>
          )}

          {revealed && (
            <div className="mt-4 animate-fade-in-up">
              <p className="text-2xl font-black text-white sm:text-3xl">
                {current.brand} {current.model}
              </p>

              <p className="mt-1 text-sm font-bold text-white/55">
                لو كان جوابهم صح ياخذون {pointsLabel(stagePoints)}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {!revealed && !isLastStage && (
            <button type="button" onClick={zoomOut} className="btn-secondary">
              🔍 بعّد الصورة
            </button>
          )}

          {!revealed && (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="btn-primary min-w-[160px]"
            >
              شوفوا الجواب
            </button>
          )}

          {revealed && (
            <InlineJudge
              resetKey={index}
              teamName={activeTeamName}
              onCorrect={() => award(stagePoints)}
              onWrong={() => award(0)}
            />
          )}
        </div>
      </div>
    </GameLayout>
  );
}
