'use client';

import { useEffect, useState } from "react";
import GameLayout from "@/components/match/GameLayout";
import { WORDS } from "@/data/words";
import type { WinnerType } from "@/types/game";

type CellState = "correct" | "present" | "absent";

const MAX_TRIES = 5;

export default function WordGame({
  onRoundEnd,
  roundKey,
  side1Name = "فريق 1",
  side2Name = "فريق 2",
  side1Score = 0,
  side2Score = 0,
  currentRound = 1,
}: {
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  side1Name?: string;
  side2Name?: string;
  side1Score?: number;
  side2Score?: number;
  currentRound?: number;
}) {
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [activeSide, setActiveSide] = useState<"side1" | "side2">("side1");

  useEffect(() => {
    setAnswer(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses([]);
    setCurrent("");
    setStatus("playing");
    setActiveSide("side1");
  }, [roundKey]);

  function getCurrentTurnName() {
    return activeSide === "side1" ? side1Name : side2Name;
  }

  function submitGuess() {
    if (status !== "playing") return;

    if (current.length !== answer.length) return;

    const nextGuesses = [...guesses, current];
    setGuesses(nextGuesses);
    setCurrent("");

    if (current === answer) {
      setStatus("won");
      setTimeout(() => onRoundEnd(activeSide), 500);
      return;
    }

    if (nextGuesses.length >= MAX_TRIES) {
      setStatus("lost");
      setTimeout(() => onRoundEnd("none"), 500);
      return;
    }

    setActiveSide(activeSide === "side1" ? "side2" : "side1");
  }

  return (
    <GameLayout
      title="خمن الكلمة"
      side1={side1Name}
      side2={side2Name}
      side1Score={side1Score}
      side2Score={side2Score}
      turn={`دور ${getCurrentTurnName()}`}
      currentRound={currentRound}
    >
      <div className="text-center space-y-4">
        <div className="text-lg">{guesses.join(" - ")}</div>

        <input
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="rounded-xl p-2 text-black"
        />

        <div className="flex justify-center gap-3">
          <button onClick={submitGuess} className="btn-primary">
            إدخال
          </button>

          <button onClick={() => onRoundEnd()} className="btn-secondary">
            إنهاء الجولة
          </button>
        </div>
      </div>
    </GameLayout>
  );
}
