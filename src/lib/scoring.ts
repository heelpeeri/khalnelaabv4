import type { WinnerType } from "@/types/game";

export function getPointsWinner(
  side1Points: number,
  side2Points: number
): WinnerType {
  if (side1Points > side2Points) return "side1";
  if (side2Points > side1Points) return "side2";

  return "none";
}
