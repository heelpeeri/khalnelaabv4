import { describe, expect, it } from "vitest";
import {
  evaluateGuess,
  isPlayableWord,
  normalizeArabic,
} from "@/lib/wordRules";

describe("normalizeArabic", () => {
  it("treats taa marbuta as haa and unifies alef and yaa forms", () => {
    expect(normalizeArabic("سيارة")).toBe("سياره");
    expect(normalizeArabic("أإآ")).toBe("ااا");
    expect(normalizeArabic("مستشفى")).toBe("مستشفي");
  });

  it("ignores spaces", () => {
    expect(normalizeArabic(" بيت الشواية ")).toBe("بيتالشوايه");
  });
});

describe("evaluateGuess", () => {
  it("marks every letter correct for the right word", () => {
    expect(evaluateGuess("سياره", "سيارة")).toEqual([
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("marks letters in the wrong place as present", () => {
    expect(evaluateGuess("رسيها", "سياره")).toEqual([
      "present",
      "present",
      "present",
      "present",
      "present",
    ]);
  });

  it("does not count a repeated letter more times than it appears", () => {
    expect(evaluateGuess("ممممم", "مكتبة")).toEqual([
      "correct",
      "absent",
      "absent",
      "absent",
      "absent",
    ]);
  });
});

describe("isPlayableWord", () => {
  it("accepts five-letter words typable on the keyboard", () => {
    expect(isPlayableWord("سيارة")).toBe(true);
  });

  it("rejects words with letters missing from the keyboard", () => {
    expect(isPlayableWord("قائمة")).toBe(false);
  });

  it("rejects words that are not five letters", () => {
    expect(isPlayableWord("بيت")).toBe(false);
  });
});
