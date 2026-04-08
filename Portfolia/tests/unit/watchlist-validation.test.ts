import {
  createWatchlistItemSchema,
  updateWatchlistItemActionSchema,
} from "@/lib/validations/watchlist";

describe("watchlist validation", () => {
  it("accepts valid watchlist create payload", () => {
    const parsed = createWatchlistItemSchema.safeParse({
      assetName: "NVIDIA",
      symbol: "nvda",
      category: "stock",
      targetPrice: "1000",
      notes: " wait for dip ",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.notes).toBe("wait for dip");
      expect(parsed.data.targetPrice).toBe(1000);
    }
  });

  it("validates update action payload", () => {
    const parsed = updateWatchlistItemActionSchema.safeParse({
      watchlistItemId: "11111111-1111-4111-8111-111111111111",
      symbol: "BTC",
    });

    expect(parsed.success).toBe(true);
  });
});
