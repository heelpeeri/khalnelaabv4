import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { COUNTRIES } from "@/data/countries";
import { CATEGORY_LETTERS } from "@/data/categories";
import { LOGOS } from "@/data/logos";
import { PROVERB_PUZZLES } from "@/data/proverbs";
import { quizCategoryList, quizQuestions } from "@/data/quiz";
import { WHO_GAME } from "@/data/scramble";
import { WHEEL_LETTER_ROWS, WHEEL_PUZZLES, WHEEL_SEGMENTS } from "@/data/wheel";
import { WORDS } from "@/data/words";
import { isPlayableWord, normalizeArabic } from "@/lib/wordRules";

function publicFileExists(path: string) {
  return existsSync(join(process.cwd(), "public", path));
}

function duplicates(values: string[]) {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

describe("quiz questions", () => {
  it("has a question list for every category", () => {
    for (const { key } of quizCategoryList) {
      expect(quizQuestions[key].length).toBeGreaterThanOrEqual(6);
    }
  });

  it("keeps every answer inside its options", () => {
    for (const { key } of quizCategoryList) {
      for (const question of quizQuestions[key]) {
        if (question.options) {
          expect(question.options, question.question).toContain(
            question.answer,
          );
          expect(duplicates(question.options), question.question).toEqual([]);
        }
      }
    }
  });

  it("has no repeated questions in a category", () => {
    for (const { key } of quizCategoryList) {
      const texts = quizQuestions[key].map(
        (question) => `${question.question}|${question.image ?? ""}`,
      );

      expect(duplicates(texts)).toEqual([]);
    }
  });

  it("points every question image to an existing file", () => {
    for (const { key } of quizCategoryList) {
      for (const question of quizQuestions[key]) {
        if (question.image) {
          expect(publicFileExists(question.image), question.image).toBe(true);
        }
      }
    }
  });
});

describe("word game", () => {
  it("has enough playable words", () => {
    const playable = WORDS.filter((word) => isPlayableWord(word.answer));

    expect(playable.length).toBeGreaterThanOrEqual(20);
  });

  it("has no repeated words", () => {
    expect(duplicates(WORDS.map((word) => word.answer))).toEqual([]);
  });
});

describe("wheel of fortune", () => {
  it("can type every answer with the wheel keyboard", () => {
    const keys = WHEEL_LETTER_ROWS.join("");

    for (const puzzle of WHEEL_PUZZLES) {
      for (const letter of Array.from(normalizeArabic(puzzle.answer))) {
        expect(keys, puzzle.answer).toContain(letter);
      }
    }
  });

  it("has valid segment values", () => {
    for (const segment of WHEEL_SEGMENTS) {
      expect(
        typeof segment.value === "number"
          ? segment.value > 0
          : ["bankrupt", "lose"].includes(segment.value),
      ).toBe(true);
    }
  });
});

describe("image-based games", () => {
  it("has unique ids and existing files for logos", () => {
    expect(duplicates(LOGOS.map((logo) => logo.id))).toEqual([]);

    for (const logo of LOGOS) {
      expect(publicFileExists(logo.image), logo.image).toBe(true);
      expect(logo.pixelSize).toBeGreaterThan(0);
    }
  });

  it("has unique ids and existing flags for countries", () => {
    expect(duplicates(COUNTRIES.map((country) => country.id))).toEqual([]);

    for (const country of COUNTRIES) {
      expect(publicFileExists(country.flag), country.flag).toBe(true);
    }
  });

  it("has unique ids and existing photos for people", () => {
    expect(duplicates(WHO_GAME.map((person) => person.id))).toEqual([]);

    for (const person of WHO_GAME) {
      expect(publicFileExists(person.image), person.image).toBe(true);
    }
  });

  it("has existing images for proverbs", () => {
    expect(duplicates(PROVERB_PUZZLES.map((item) => item.image))).toEqual([]);

    for (const proverb of PROVERB_PUZZLES) {
      expect(publicFileExists(proverb.image), proverb.image).toBe(true);
    }
  });
});

describe("categories game", () => {
  it("uses single unique letters", () => {
    expect(duplicates(CATEGORY_LETTERS)).toEqual([]);

    for (const letter of CATEGORY_LETTERS) {
      expect(Array.from(letter)).toHaveLength(1);
    }
  });
});
