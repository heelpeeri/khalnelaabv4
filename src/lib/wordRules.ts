export type CellState = "correct" | "present" | "absent";

export const WORD_LENGTH = 5;

export const keyboardRows = ["جحخهعغفقثصض", "كمنتالبيسش", "ورزدذطظ"];

export const keyboardLetters = keyboardRows.join("");

export function normalizeArabic(text: string) {
  return text
    .trim()
    .replace(/\s+/g, "")
    .replace(/ة/g, "ه")
    .replace(/أ|إ|آ/g, "ا")
    .replace(/ى/g, "ي");
}

export function isPlayableWord(answer: string) {
  const letters = Array.from(normalizeArabic(answer));

  return (
    letters.length === WORD_LENGTH &&
    letters.every((letter) => keyboardLetters.includes(letter))
  );
}

export function evaluateGuess(guess: string, answer: string): CellState[] {
  const guessLetters = Array.from(normalizeArabic(guess));

  const answerLetters = Array.from(normalizeArabic(answer));

  const result: CellState[] = Array(guessLetters.length).fill("absent");

  const remainingLetters: Record<string, number> = {};

  guessLetters.forEach((letter, index) => {
    if (letter === answerLetters[index]) {
      result[index] = "correct";
    } else {
      const answerLetter = answerLetters[index];

      if (answerLetter) {
        remainingLetters[answerLetter] =
          (remainingLetters[answerLetter] ?? 0) + 1;
      }
    }
  });

  guessLetters.forEach((letter, index) => {
    if (result[index] === "correct") {
      return;
    }

    const remainingCount = remainingLetters[letter] ?? 0;

    if (remainingCount > 0) {
      result[index] = "present";

      remainingLetters[letter] = remainingCount - 1;
    }
  });

  return result;
}
