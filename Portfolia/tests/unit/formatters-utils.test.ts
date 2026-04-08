import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercentage,
} from "@/lib/portfolio/formatters";
import { cn } from "@/lib/utils";

describe("formatters and utils", () => {
  it("formats currency and percentage", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
    expect(formatPercentage(2.345)).toBe("+2.35%");
    expect(formatPercentage(-2.345)).toBe("-2.35%");
  });

  it("formats numbers and dates", () => {
    expect(formatNumber(1234.56789, 2)).toBe("1,234.57");
    expect(formatDate("2026-01-10")).toBe("Jan 10, 2026");
  });

  it("merges classes with cn", () => {
    expect(cn("px-2 py-1", "px-4")).toContain("px-4");
  });
});
