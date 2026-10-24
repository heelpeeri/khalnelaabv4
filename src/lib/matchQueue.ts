import { quizCategoryMeta, type QuizCategoryKey } from "@/data/quiz/meta";
import { shuffle } from "@/lib/deck";

export type GameType =
  | "word"
  | "quiz"
  | "scramble"
  | "wheel"
  | "categories"
  | "draw"
  | "logo"
  | "country";

export type Round = {
  game: GameType;
  category: QuizCategoryKey | null;
};

export const VALID_GAMES: GameType[] = [
  "word",
  "quiz",
  "scramble",
  "wheel",
  "categories",
  "draw",
  "logo",
  "country",
];

export const DEFAULT_ROUNDS: Record<GameType, number> = {
  word: 2,
  quiz: 1,
  scramble: 2,
  wheel: 1,
  categories: 1,
  draw: 2,
  logo: 2,
  country: 2,
};

export function isGameType(value: string | null): value is GameType {
  return value !== null && VALID_GAMES.includes(value as GameType);
}

export function isQuizCategory(value: string | null): value is QuizCategoryKey {
  return (
    value !== null &&
    Object.prototype.hasOwnProperty.call(quizCategoryMeta, value)
  );
}

export function getDefaultRounds(game: GameType) {
  return DEFAULT_ROUNDS[game];
}

export function getRoundCount(
  game: GameType,
  gameRounds: Record<string, number>,
) {
  const value = Math.floor(Number(gameRounds[game]));

  return Number.isFinite(value) && value > 0
    ? Math.min(value, 10)
    : getDefaultRounds(game);
}

export function buildRoundQueue(
  selectedGames: GameType[],
  gameRounds: Record<string, number>,
  quizCategories: QuizCategoryKey[],
): Round[] {
  const queue: Round[] = [];

  const shuffledCategories = shuffle(quizCategories);

  selectedGames.forEach((game) => {
    if (game === "quiz") {
      shuffledCategories.forEach((category) => {
        queue.push({ game, category });
      });

      return;
    }

    const count = getRoundCount(game, gameRounds);

    for (let i = 0; i < count; i += 1) {
      queue.push({
        game,
        category: null,
      });
    }
  });

  return queue;
}
