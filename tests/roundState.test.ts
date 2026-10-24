import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearRoundState,
  readRoundState,
  writeRoundState,
} from "@/lib/roundState";

beforeEach(() => {
  const store = new Map<string, string>();

  vi.stubGlobal("sessionStorage", {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
  });
});

describe("round state", () => {
  it("restores only the same game and round", () => {
    writeRoundState("quiz", 2, { index: 3 });

    expect(readRoundState("quiz", 2)).toEqual({ index: 3 });
    expect(readRoundState("quiz", 3)).toBeNull();
    expect(readRoundState("logo", 2)).toBeNull();
  });

  it("is gone after clearing", () => {
    writeRoundState("word", 0, { guesses: ["سياره"] });
    clearRoundState();

    expect(readRoundState("word", 0)).toBeNull();
  });
});
