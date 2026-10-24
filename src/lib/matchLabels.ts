import type { GameType } from "@/lib/matchQueue";

export const GAME_NAMES: Record<GameType, string> = {
  word: "💬 خمن الكلمة",
  quiz: "❓ أسئلة وأجوبة",
  scramble: "🕵🏻‍♂️ منهو ذا؟",
  wheel: "🎡 لف وخمن",
  categories: "🌍 إنسان حيوان نبات جماد بلاد",
  draw: "✏️ خمن المثل",
  logo: "🏷️ خمن الشعار",
  country: "🚩 خمن العلم",
};

export function getGameName(game: GameType) {
  return GAME_NAMES[game];
}

export function getRoundsLabel(count: number) {
  if (count === 1) return "جولة وحدة";
  if (count === 2) return "جولتين";
  if (count >= 3 && count <= 10) return `${count} جولات`;

  return `${count} جولة`;
}
