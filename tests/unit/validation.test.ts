import {
  createHoldingSchema,
  deleteHoldingActionSchema,
  updateHoldingActionSchema,
} from "@/lib/validations/holding";

describe("server action validation", () => {
  it("accepts a valid create payload", () => {
    const parsed = createHoldingSchema.safeParse({
      assetName: "Apple Inc.",
      symbol: "AAPL",
      category: "stock",
      quantity: 10,
      averageBuyPrice: 150,
      currentPrice: 170,
      purchaseDate: "2026-01-10",
      notes: " long term ",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.notes).toBe("long term");
    }
  });

  it("rejects invalid update payloads", () => {
    const parsed = updateHoldingActionSchema.safeParse({
      holdingId: "not-a-uuid",
    });

    expect(parsed.success).toBe(false);
  });

  it("validates delete action holding id", () => {
    const valid = deleteHoldingActionSchema.safeParse({
      holdingId: "11111111-1111-4111-8111-111111111111",
    });
    const invalid = deleteHoldingActionSchema.safeParse({
      holdingId: "bad-id",
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });
});
