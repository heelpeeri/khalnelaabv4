import { seerahQuestions } from "./seerah";
import { saudiQuestions } from "./saudi";
import { footballQuestions } from "./football";
import { geographyQuestions } from "./geography";
import type { QuizCategoryKey } from "./meta";

export {
  quizCategoryMeta,
  quizCategoryList,
  type QuizCategoryKey,
} from "./meta";

export type QuizQuestion = {
  question: string;
  answer: string;
  image?: string;
  options?: string[];
};

export const quizQuestions: Record<QuizCategoryKey, QuizQuestion[]> = {
  seerah: seerahQuestions,
  saudi: saudiQuestions,
  football: footballQuestions,
  geography: geographyQuestions,
};
