import {
  convertBaseCurrencyToDisplay,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercentage,
} from "@/lib/portfolio/formatters";
import { cn } from "@/lib/utils";

describe("formatters and utils", () => {
  it("formats currency and percentage", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
    expect(formatCurrency(1234.5, "EUR")).toBe("\u20ac1,135.74");
    expect(formatCurrency(1234.5, "GBP")).toBe("\u00a3975.26");
    expect(formatPercentage(2.345)).toBe("+2.35%");
    expect(formatPercentage(-2.345)).toBe("-2.35%");
  });

  it("converts canonical USD display values into selected currencies", () => {
    expect(convertBaseCurrencyToDisplay(11000, "USD")).toBe(11000);
    expect(convertBaseCurrencyToDisplay(11000, "EUR")).toBe(10120);
    expect(convertBaseCurrencyToDisplay(11000, "GBP")).toBe(8690);
  });

  it("handles invalid currency inputs safely without affecting percentages", () => {
    expect(convertBaseCurrencyToDisplay(null, "EUR")).toBe(0);
    expect(convertBaseCurrencyToDisplay(undefined, "GBP")).toBe(0);
    expect(convertBaseCurrencyToDisplay(Number.NaN, "EUR")).toBe(0);
    expect(convertBaseCurrencyToDisplay(Number.POSITIVE_INFINITY, "GBP")).toBe(0);
    expect(formatCurrency(Number.NaN, "EUR")).toBe("\u20ac0.00");
    expect(formatPercentage(12.345)).toBe("+12.35%");
  });

  it("formats numbers and dates", () => {
    expect(formatNumber(1234.56789, 2)).toBe("1,234.57");
    expect(formatDate("2026-01-10")).toBe("Jan 10, 2026");
  });

  it("merges classes with cn", () => {
    expect(cn("px-2 py-1", "px-4")).toContain("px-4");
  });
});
