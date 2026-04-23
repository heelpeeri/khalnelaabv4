import { useState } from "react";
import type { TeamTurn, WinnerType } from "@/types/game";

export function useGameState() {
  const [turn, setTurn] = useState<TeamTurn>("side1");
  const [side1Score, setSide1Score] = useState(0);
  const [side2Score, setSide2Score] = useState(0);

  function nextTurn() {
    setTurn((prev) => (prev === "side1" ? "side2" : "side1"));
  }

  function awardWinner(winner: WinnerType) {
    if (winner === "side1") setSide1Score((s) => s + 1);
    if (winner === "side2") setSide2Score((s) => s + 1);
  }

  return { turn, side1Score, side2Score, setSide1Score, setSide2Score, nextTurn, awardWinner };
}
