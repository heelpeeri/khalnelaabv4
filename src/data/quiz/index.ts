import { seerahQuestions } from "./seerah";
import { saudiQuestions } from "./saudi";
import { footballQuestions } from "./football";
import { geographyQuestions } from "./geography";
import { tashQuestions } from "./tash";

export type QuizCategoryKey =
  | "seerah"
  | "saudi"
  | "football"
  | "geography"
  | "tash";

export type QuizQuestion = {
  question: string;
  answer: string;
  image?: string;
  options?: string[];
};

export const quizCategoryMeta: Record<
  QuizCategoryKey,
  { title: string; emoji: string }
> = {
  seerah: { title: "السيرة", emoji: "🕌" },
  saudi: { title: "السعودية", emoji: "🇸🇦" },
  football: { title: "كرة القدم", emoji: "⚽" },
  geography: { title: "جغرافيا", emoji: "🌍" },
  tash: { title: "طاش ما طاش", emoji: "📺" },
};

export const quizCategoryList = Object.entries(quizCategoryMeta).map(
  ([key, value]) => ({
    key: key as QuizCategoryKey,
    ...value,
  })
);

export const quizQuestions: Record<QuizCategoryKey, QuizQuestion[]> = {
  seerah: seerahQuestions,
  saudi: saudiQuestions,
  football: footballQuestions,
  geography: geographyQuestions,
  tash: tashQuestions,
};
