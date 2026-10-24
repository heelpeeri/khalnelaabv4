import { describe, expect, it } from "vitest";
import { createDeck } from "@/lib/deck";

const items = Array.from({ length: 10 }, (_, i) => i);

describe("createDeck", () => {
  it("does not repeat items until the deck runs out", () => {
    const deck = createDeck(items);
    const drawn = [...deck.draw(4), ...deck.draw(4), ...deck.draw(2)];

    expect(new Set(drawn).size).toBe(10);
  });

  it("never returns duplicates within one draw across a refill", () => {
    const deck = createDeck(items);

    for (let i = 0; i < 200; i += 1) {
      const hand = deck.draw(3);
      expect(new Set(hand).size).toBe(3);
    }
  });

  it("handles empty decks and invalid counts", () => {
    expect(createDeck([]).draw(3)).toEqual([]);
    expect(createDeck(items).draw(0)).toEqual([]);
    expect(createDeck(items).draw(-2)).toEqual([]);
    expect(createDeck(items).draw(Number.NaN)).toEqual([]);
    expect(createDeck(items).draw(50)).toHaveLength(10);
  });
});
