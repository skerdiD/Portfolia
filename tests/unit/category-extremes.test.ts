import { describe, expect, it } from "vitest";
import { findBestAndWorstCategory } from "@/lib/portfolio/category-extremes";
import type { AllocationPoint } from "@/lib/portfolio/calculations";

const allocationFixture: AllocationPoint[] = [
  {
    category: "crypto",
    investedAmount: 1000,
    currentValue: 1140,
    gainLoss: 140,
    percentage: 40,
  },
  {
    category: "stock",
    investedAmount: 1200,
    currentValue: 1164,
    gainLoss: -36,
    percentage: 45,
  },
  {
    category: "cash",
    investedAmount: 300,
    currentValue: 300,
    gainLoss: 0,
    percentage: 15,
  },
];

describe("findBestAndWorstCategory", () => {
  it("finds best and worst categories by return percentage", () => {
    const result = findBestAndWorstCategory(allocationFixture);

    expect(result.bestCategory?.category).toBe("crypto");
    expect(result.bestCategory?.returnPercentage).toBe(14);
    expect(result.worstCategory?.category).toBe("stock");
    expect(result.worstCategory?.returnPercentage).toBe(-3);
  });

  it("returns only best when one category is present", () => {
    const result = findBestAndWorstCategory([allocationFixture[0]]);

    expect(result.bestCategory?.category).toBe("crypto");
    expect(result.worstCategory).toBeNull();
  });

  it("returns null values for empty allocation", () => {
    const result = findBestAndWorstCategory([]);

    expect(result.bestCategory).toBeNull();
    expect(result.worstCategory).toBeNull();
  });
});
