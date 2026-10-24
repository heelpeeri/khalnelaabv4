export type QuizCategoryKey = "seerah" | "saudi" | "football" | "geography";

export const quizCategoryMeta: Record<
  QuizCategoryKey,
  { title: string; emoji: string }
> = {
  seerah: { title: "السيرة", emoji: "🕌" },
  saudi: { title: "السعودية", emoji: "🇸🇦" },
  football: { title: "كرة القدم", emoji: "⚽" },
  geography: { title: "جغرافيا", emoji: "🌍" },
};

export const quizCategoryList = Object.entries(quizCategoryMeta).map(
  ([key, value]) => ({
    key: key as QuizCategoryKey,
    ...value,
  }),
);
