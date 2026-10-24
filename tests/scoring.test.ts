import { describe, expect, it } from "vitest";
import { getPointsWinner } from "@/lib/scoring";

describe("getPointsWinner", () => {
  it("gives the round to the team with more points", () => {
    expect(getPointsWinner(300, 100)).toBe("side1");
    expect(getPointsWinner(0, 500)).toBe("side2");
  });

  it("is a draw when points are equal", () => {
    expect(getPointsWinner(200, 200)).toBe("none");
    expect(getPointsWinner(0, 0)).toBe("none");
  });
});
