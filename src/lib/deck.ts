export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export type Deck<T> = {
  draw: (count: number) => T[];
};

export function createDeck<T>(items: readonly T[]): Deck<T> {
  let pile: T[] = [];

  return {
    draw(count) {
      const target = Math.max(
        0,
        Math.min(Math.floor(count) || 0, items.length),
      );

      const result: T[] = [];

      while (result.length < target) {
        if (pile.length === 0) {
          pile = shuffle(items).filter((item) => !result.includes(item));

          if (pile.length === 0) {
            break;
          }
        }

        const next = pile.shift();

        if (next !== undefined) {
          result.push(next);
        }
      }

      return result;
    },
  };
}
