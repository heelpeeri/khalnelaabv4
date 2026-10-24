import { describe, expect, it } from "vitest";
import {
  buildRoundQueue,
  getRoundCount,
  getTimerSeconds,
  isGameType,
  isQuizCategory,
} from "@/lib/matchQueue";

describe("buildRoundQueue", () => {
  it("makes one quiz round per selected category", () => {
    const queue = buildRoundQueue(["quiz"], {}, ["saudi", "football"]);

    expect(queue).toHaveLength(2);
    expect(queue.map((round) => round.category).sort()).toEqual([
      "football",
      "saudi",
    ]);
  });

  it("skips the quiz when no category is selected", () => {
    expect(buildRoundQueue(["quiz"], {}, [])).toEqual([]);
  });

  it("repeats other games by their round count", () => {
    const queue = buildRoundQueue(["word", "wheel"], { word: 4, wheel: 1 }, []);

    expect(queue.filter((round) => round.game === "word")).toHaveLength(4);
    expect(queue.filter((round) => round.game === "wheel")).toHaveLength(1);
  });
});

describe("getRoundCount", () => {
  it("falls back to the default for missing or invalid values", () => {
    expect(getRoundCount("word", {})).toBe(2);
    expect(getRoundCount("word", { word: 0 })).toBe(2);
    expect(getRoundCount("word", { word: -3 })).toBe(2);
    expect(getRoundCount("word", { word: Number.NaN })).toBe(2);
  });

  it("caps very large values", () => {
    expect(getRoundCount("word", { word: 99 })).toBe(10);
  });
});

describe("URL validation", () => {
  it("accepts only known games and quiz categories", () => {
    expect(isGameType("country")).toBe(true);
    expect(isGameType("chess")).toBe(false);
    expect(isGameType(null)).toBe(false);
    expect(isQuizCategory("saudi")).toBe(true);
    expect(isQuizCategory("tash")).toBe(false);
    expect(isQuizCategory("toString")).toBe(false);
  });
});

describe("getTimerSeconds", () => {
  it("doubles the time for games that need longer thinking", () => {
    expect(getTimerSeconds("categories", 30)).toBe(60);
    expect(getTimerSeconds("country", 45)).toBe(90);
  });

  it("keeps the set time for other games", () => {
    expect(getTimerSeconds("quiz", 30)).toBe(30);
    expect(getTimerSeconds("word", 20)).toBe(20);
  });
});
