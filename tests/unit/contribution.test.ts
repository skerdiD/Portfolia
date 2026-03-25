import { describe, expect, it } from "vitest";
import { holdingFixtures } from "./fixtures";
import { buildPortfolioContributionPoints } from "@/lib/portfolio/contribution";

describe("buildPortfolioContributionPoints", () => {
  it("returns top contributors sorted by absolute P&L impact", () => {
    const rows = buildPortfolioContributionPoints(holdingFixtures, { limit: 2 });

    expect(rows).toHaveLength(2);
    expect(rows[0].symbol).toBe("BTC");
    expect(rows[0].gainLoss).toBe(-500);
    expect(rows[1].symbol).toBe("AAPL");
    expect(rows[1].gainLoss).toBe(200);
  });

  it("uses absolute-impact fallback when net portfolio P&L is near zero", () => {
    const balancedRows = buildPortfolioContributionPoints(
      [
        {
          ...holdingFixtures[0],
          id: "1",
          symbol: "AAA",
          gainLoss: 100,
        },
        {
          ...holdingFixtures[1],
          id: "2",
          symbol: "BBB",
          gainLoss: -100,
        },
      ],
      { limit: 2 },
    );

    expect(balancedRows[0].contributionPercentage).toBe(50);
    expect(balancedRows[1].contributionPercentage).toBe(-50);
  });

  it("returns empty list for no holdings", () => {
    expect(buildPortfolioContributionPoints([])).toEqual([]);
  });
});
