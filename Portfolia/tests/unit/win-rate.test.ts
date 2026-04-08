import { describe, expect, it } from "vitest";
import { holdingFixtures } from "./fixtures";
import { calculateWinRateStats } from "@/lib/portfolio/win-rate";

describe("calculateWinRateStats", () => {
  it("calculates profitable, losing, and break-even counts", () => {
    const stats = calculateWinRateStats([
      ...holdingFixtures,
      {
        ...holdingFixtures[0],
        id: "break-even-id",
        symbol: "BEP",
        gainLoss: 0,
      },
    ]);

    expect(stats.total).toBe(4);
    expect(stats.profitable).toBe(2);
    expect(stats.losing).toBe(1);
    expect(stats.breakEven).toBe(1);
    expect(stats.winRatePercentage).toBe(50);
  });

  it("returns zeroed stats for empty holdings", () => {
    expect(calculateWinRateStats([])).toEqual({
      total: 0,
      profitable: 0,
      losing: 0,
      breakEven: 0,
      winRatePercentage: 0,
    });
  });
});
