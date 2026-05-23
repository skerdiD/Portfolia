import {
  calculateWatchlistTargetInsight,
  toWatchlistPrice,
  toWatchlistPriceStorage,
} from "@/lib/watchlist/types";

describe("watchlist target insights", () => {
  it("calculates below-target progress and gap", () => {
    const insight = calculateWatchlistTargetInsight({
      currentPrice: 90,
      targetPrice: 100,
    });

    expect(insight).toMatchObject({
      status: "below",
      label: "Below target",
      priceGap: -10,
      gapPercentage: -10,
      progressPercentage: 90,
      isNearTarget: false,
    });
  });

  it("marks assets within five percent as near target", () => {
    const insight = calculateWatchlistTargetInsight({
      currentPrice: 96,
      targetPrice: 100,
    });

    expect(insight.status).toBe("near");
    expect(insight.label).toBe("Near target");
    expect(insight.isNearTarget).toBe(true);
    expect(insight.progressPercentage).toBe(96);
  });

  it("caps progress at one hundred percent when price is above target", () => {
    const insight = calculateWatchlistTargetInsight({
      currentPrice: 125,
      targetPrice: 100,
    });

    expect(insight.status).toBe("above");
    expect(insight.priceGap).toBe(25);
    expect(insight.gapPercentage).toBe(25);
    expect(insight.progressPercentage).toBe(100);
  });

  it("returns an unavailable insight when price data is missing", () => {
    expect(
      calculateWatchlistTargetInsight({
        currentPrice: null,
        targetPrice: 100,
      }),
    ).toMatchObject({
      status: "unavailable",
      label: "Needs price data",
      priceGap: null,
      progressPercentage: null,
      isNearTarget: false,
    });
  });

  it("normalizes optional watchlist prices for records and storage", () => {
    expect(toWatchlistPrice("123.456789876")).toBe(123.45678988);
    expect(toWatchlistPrice("")).toBeNull();
    expect(toWatchlistPrice(" ")).toBeNull();
    expect(toWatchlistPriceStorage("12.5")).toBe("12.50000000");
  });
});
