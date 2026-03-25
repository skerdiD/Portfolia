import {
  buildDerivedPerformanceHistory,
  buildPerformanceHistoryFromSnapshots,
} from "@/lib/portfolio/calculations";
import { holdingFixtures } from "@/tests/unit/fixtures";

describe("analytics data shaping", () => {
  it("builds snapshot history in date order", () => {
    const history = buildPerformanceHistoryFromSnapshots([
      {
        id: "s2",
        userId: "user-1",
        date: "2026-01-02",
        totalValue: "1020.00",
        investedAmount: "1000.00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "s1",
        userId: "user-1",
        date: "2026-01-01",
        totalValue: "1000.00",
        investedAmount: "900.00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    expect(history.map((point) => point.date)).toEqual(["2026-01-01", "2026-01-02"]);
  });

  it("builds derived history from holdings", () => {
    const history = buildDerivedPerformanceHistory(holdingFixtures);

    expect(history.length).toBeGreaterThan(0);
    expect(history[history.length - 1].investedAmount).toBe(6800);
    expect(history[history.length - 1].totalValue).toBe(6560);
  });
});
