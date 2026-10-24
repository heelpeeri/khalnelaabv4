import { describe, expect, it } from "vitest";
import { createQrMatrix } from "@/lib/qr";

function hasFinder(matrix: boolean[][], x: number, y: number) {
  for (let dy = 0; dy < 7; dy += 1) {
    for (let dx = 0; dx < 7; dx += 1) {
      const ring = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));

      if (matrix[y + dy][x + dx] !== (ring !== 2)) {
        return false;
      }
    }
  }

  return true;
}

const samples = [
  "https://khalnelaab.vercel.app/country/saudi-arabia",
  "https://khalnelaab.vercel.app/person/messi",
  "خل نلعب",
  "x".repeat(200),
];

describe("createQrMatrix", () => {
  it("builds a square of a valid QR size", () => {
    for (const text of samples) {
      const matrix = createQrMatrix(text);
      const size = matrix.length;

      expect((size - 17) % 4).toBe(0);
      expect(matrix.every((row) => row.length === size)).toBe(true);
    }
  });

  it("draws the three finder patterns and timing lines", () => {
    for (const text of samples) {
      const matrix = createQrMatrix(text);
      const size = matrix.length;

      expect(hasFinder(matrix, 0, 0)).toBe(true);
      expect(hasFinder(matrix, size - 7, 0)).toBe(true);
      expect(hasFinder(matrix, 0, size - 7)).toBe(true);

      for (let i = 8; i < size - 8; i += 1) {
        expect(matrix[6][i]).toBe(i % 2 === 0);
        expect(matrix[i][6]).toBe(i % 2 === 0);
      }
    }
  });

  it("is deterministic and stays the same as the verified output", () => {
    for (const text of samples) {
      const rows = createQrMatrix(text).map((row) =>
        row.map((dark) => (dark ? "1" : "0")).join(""),
      );

      expect(rows).toEqual(
        createQrMatrix(text).map((row) =>
          row.map((dark) => (dark ? "1" : "0")).join(""),
        ),
      );
      expect(rows.join("\n")).toMatchSnapshot();
    }
  });
});
