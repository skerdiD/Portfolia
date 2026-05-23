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
      currentPrice: "950",
      notes: " wait for dip ",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.notes).toBe("wait for dip");
      expect(parsed.data.targetPrice).toBe(1000);
      expect(parsed.data.currentPrice).toBe(950);
    }
  });

  it("validates update action payload", () => {
    const parsed = updateWatchlistItemActionSchema.safeParse({
      watchlistItemId: "11111111-1111-4111-8111-111111111111",
      symbol: "BTC",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects oversized or over-precision target prices", () => {
    const parsed = createWatchlistItemSchema.safeParse({
      assetName: "Bitcoin",
      symbol: "BTC",
      category: "crypto",
      targetPrice: "1000000000000.123456789",
      notes: "",
    });

    expect(parsed.success).toBe(false);
  });

  it("treats blank optional prices as unset instead of zero", () => {
    const parsed = createWatchlistItemSchema.safeParse({
      assetName: "Ethereum",
      symbol: "ETH",
      category: "crypto",
      targetPrice: " ",
      currentPrice: "",
      notes: "",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.targetPrice).toBeNull();
      expect(parsed.data.currentPrice).toBeNull();
    }
  });
});
