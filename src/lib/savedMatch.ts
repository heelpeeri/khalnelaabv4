import type { QuizCategoryKey } from "@/data/quiz/meta";
import {
  isGameType,
  isQuizCategory,
  type GameType,
  type Round,
} from "@/lib/matchQueue";
import { clearRoundState } from "@/lib/roundState";
import type { ModeType, RoundStat } from "@/types/match";

export const SAVED_MATCH_KEY = "khal-nelab-match";

export type SavedMatch = {
  search: string;
  mode: ModeType;
  side1: string;
  side2: string;
  selectedGames: GameType[];
  gameRounds: Record<string, number>;
  quizCategories: QuizCategoryKey[];
  timerEnabled: boolean;
  timerSeconds: number;
  queue: Round[];
  index: number;
  side1Score: number;
  side2Score: number;
  roundStats: RoundStat[];
};

export function saveMatch(match: SavedMatch) {
  try {
    sessionStorage.setItem(SAVED_MATCH_KEY, JSON.stringify(match));
  } catch {}
}

export function clearSavedMatch() {
  clearRoundState();

  try {
    sessionStorage.removeItem(SAVED_MATCH_KEY);
  } catch {}
}

export function readSavedMatch(search: string): SavedMatch | null {
  try {
    const raw = sessionStorage.getItem(SAVED_MATCH_KEY);

    if (!raw) return null;

    const match = JSON.parse(raw) as SavedMatch;

    const valid =
      match.search === search &&
      Array.isArray(match.queue) &&
      match.queue.length > 0 &&
      match.queue.every(
        (round) =>
          isGameType(round.game) &&
          (round.category === null || isQuizCategory(round.category)),
      ) &&
      Number.isInteger(match.index) &&
      match.index >= 0 &&
      match.index < match.queue.length &&
      Array.isArray(match.roundStats);

    return valid ? match : null;
  } catch {
    return null;
  }
}
