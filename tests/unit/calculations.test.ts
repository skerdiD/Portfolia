import {
  buildPerformanceHistory,
  calculateAllocationByCategory,
  calculateHoldingDerivedValues,
  calculatePortfolioSummary,
} from "@/lib/portfolio/calculations";
import { holdingFixtures } from "@/tests/unit/fixtures";

describe("portfolio calculations", () => {
  it("calculates holding derived values", () => {
    const result = calculateHoldingDerivedValues({
      quantity: "2",
      averageBuyPrice: "100",
      currentPrice: "125.5",
    });

    expect(result).toEqual({
      investedAmount: 200,
      currentValue: 251,
      gainLoss: 51,
      returnPercentage: 25.5,
    });
  });

  it("calculates portfolio summary totals", () => {
    const summary = calculatePortfolioSummary(holdingFixtures);

    expect(summary).toEqual({
      holdingsCount: 3,
      investedAmount: 6800,
      currentValue: 6560,
      gainLoss: -240,
      returnPercentage: -3.53,
    });
  });

  it("calculates allocation grouped by category", () => {
    const allocation = calculateAllocationByCategory(holdingFixtures);

    expect(allocation.map((item) => item.category)).toEqual(["crypto", "stock", "etf"]);
    expect(allocation[0].currentValue).toBe(4500);
    expect(allocation[0].percentage).toBe(68.6);
  });

  it("builds performance history from snapshots when available", () => {
    const history = buildPerformanceHistory({
      holdings: holdingFixtures,
      snapshots: [
        {
          id: "s1",
          userId: "user-1",
          date: "2026-01-01",
          totalValue: "1000.00",
          investedAmount: "900.00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({
      date: "2026-01-01",
      totalValue: 1000,
      investedAmount: 900,
      gainLoss: 100,
      returnPercentage: 11.11,
    });
  });
});
