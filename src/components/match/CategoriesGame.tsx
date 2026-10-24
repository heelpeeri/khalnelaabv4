"use client";

import { useEffect, useState } from "react";
import { GameTitle } from "@/components/match/GameLayout";
import { CATEGORY_LETTERS as letters } from "@/data/categories";
import { createDeck } from "@/lib/deck";
import { readRoundState, writeRoundState } from "@/lib/roundState";
import type { WinnerType } from "@/types/game";

const letterDeck = createDeck(letters);

type CategoriesRoundState = {
  letter: string;
  revealed: boolean;
  side1Ready: boolean;
  side2Ready: boolean;
  side1Time: number | null;
  side2Time: number | null;
  roundStartedAt: number;
};

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
  const [letter, setLetter] = useState("");

  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [revealed, setRevealed] = useState(false);

  const [side1Ready, setSide1Ready] = useState(false);
  const [side2Ready, setSide2Ready] = useState(false);

  const [side1Time, setSide1Time] = useState<number | null>(null);
  const [side2Time, setSide2Time] = useState<number | null>(null);

  const [roundStartedAt, setRoundStartedAt] = useState(() => Date.now());

  useEffect(() => {
    setTimeLeft(timerSeconds);

    const saved = readRoundState<CategoriesRoundState>("categories", roundKey);

    if (saved && saved.letter) {
      setLetter(saved.letter);
      setRevealed(saved.revealed);
      setSide1Ready(saved.side1Ready);
      setSide2Ready(saved.side2Ready);
      setSide1Time(saved.side1Time);
      setSide2Time(saved.side2Time);
      setRoundStartedAt(saved.roundStartedAt);
      return;
    }

    const [next] = letterDeck.draw(1);

    setLetter(next ?? "");
    setRevealed(false);

    setSide1Ready(false);
    setSide2Ready(false);

    setSide1Time(null);
    setSide2Time(null);

    setRoundStartedAt(Date.now());
  }, [roundKey, timerSeconds]);

  useEffect(() => {
    if (!letter) {
      return;
    }

    writeRoundState<CategoriesRoundState>("categories", roundKey, {
      letter,
      revealed,
      side1Ready,
      side2Ready,
      side1Time,
      side2Time,
      roundStartedAt,
    });
  }, [
    roundKey,
    letter,
    revealed,
    side1Ready,
    side2Ready,
    side1Time,
    side2Time,
    roundStartedAt,
  ]);

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

    const elapsedTime = Math.max(
      1,
      Math.floor((Date.now() - roundStartedAt) / 1000),
    );

    if (side === "side1") {
      if (side1Ready) return;

      setSide1Ready(true);
      setSide1Time(elapsedTime);
    } else {
      if (side2Ready) return;

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
      ? `${Math.max(0, Math.min(100, (timeLeft / timerSeconds) * 100))}%`
      : "100%";

  const side1Label = side1Name || "فريق 1";
  const side2Label = side2Name || "فريق 2";

  return (
    <div className="mx-auto w-full max-w-5xl rounded-[24px] border border-white/10 bg-[#121028]/80 p-3 text-center shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:rounded-[28px] lg:p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] text-lg font-black text-white">
          {currentRound}
        </div>

        <div className="min-w-0 flex-1 text-center">
          <GameTitle title="إنسان حيوان نبات جماد بلاد" />
        </div>

        <div className="w-9 shrink-0" />
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        <div
          className={`flex min-h-[64px] min-w-0 flex-col items-center justify-center rounded-[16px] border px-2 py-1.5 transition-colors duration-500 sm:min-h-[76px] ${
            side1Ready
              ? "border-fuchsia-300/25 bg-fuchsia-500/[0.06]"
              : "border-fuchsia-300/70 bg-gradient-to-br from-fuchsia-500/30 to-purple-500/15"
          }`}
        >
          <p className="max-w-full truncate text-xs font-bold text-fuchsia-100">
            {side1Label}
          </p>

          <p className="mt-1 text-lg font-black text-fuchsia-100 sm:text-2xl">
            {side1Ready ? `✓ ${side1Time ?? ""}ث` : "⏳"}
          </p>
        </div>

        <div className="flex min-h-[64px] min-w-0 flex-col items-center justify-center rounded-[16px] border border-violet-300/45 bg-gradient-to-r from-fuchsia-500/20 via-violet-500/20 to-cyan-400/20 px-2 py-1.5 sm:min-h-[76px]">
          <p className="text-[11px] font-bold text-white/60 sm:text-xs">
            {timerEnabled && !revealed ? "الوقت" : "الدور"}
          </p>

          {timerEnabled && !revealed ? (
            <p className={`mt-1 text-2xl font-black ${timerTextClass}`}>
              {timeLeft}
            </p>
          ) : (
            <p className="mt-1 truncate text-base font-black text-white sm:text-2xl">
              الفريقين
            </p>
          )}
        </div>

        <div
          className={`flex min-h-[64px] min-w-0 flex-col items-center justify-center rounded-[16px] border px-2 py-1.5 transition-colors duration-500 sm:min-h-[76px] ${
            side2Ready
              ? "border-cyan-300/25 bg-cyan-400/[0.06]"
              : "border-cyan-300/70 bg-gradient-to-br from-cyan-400/30 to-blue-500/15"
          }`}
        >
          <p className="max-w-full truncate text-xs font-bold text-cyan-100">
            {side2Label}
          </p>

          <p className="mt-1 text-lg font-black text-cyan-100 sm:text-2xl">
            {side2Ready ? `✓ ${side2Time ?? ""}ث` : "⏳"}
          </p>
        </div>
      </div>

      <div className="mt-2 rounded-[20px] border border-white/10 bg-[#0d1236]/70 p-3 lg:p-5">
        {timerEnabled && !revealed && (
          <div className="mx-auto mb-4 max-w-md">
            <div className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 transition-[width] duration-1000"
                style={{ width: progressWidth }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-purple-300/30 bg-[#1b1537] text-6xl font-black text-white sm:h-32 sm:w-32 sm:text-7xl">
            {letter}
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-2xl rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="font-black text-white">
            إنسان • حيوان • نبات • جماد • بلاد
          </p>

          <p className="mt-1.5 text-sm leading-6 text-white/60">
            كلها تبدأ بنفس الحرف. اللي يخلص يضغط زره، وإذا الإجابات صح ياخذها
            الأسرع.
          </p>
        </div>

        {!revealed && (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => markReady("side1")}
              disabled={side1Ready}
              className="btn-team-1"
            >
              <span className="block truncate">
                {side1Ready ? "✓ خلصوا" : `${side1Label} خلصوا`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => markReady("side2")}
              disabled={side2Ready}
              className="btn-team-2"
            >
              <span className="block truncate">
                {side2Ready ? "✓ خلصوا" : `${side2Label} خلصوا`}
              </span>
            </button>
          </div>
        )}

        {revealed && (
          <p className="mt-4 text-sm font-bold text-white/60">
            راجعوا الإجابات وبعدها أنهوا الجولة
          </p>
        )}

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => onRoundEnd()}
            disabled={!revealed}
            className="btn-primary min-w-[170px]"
          >
            إنهاء الجولة
          </button>
        </div>
      </div>
    </div>
  );
}
