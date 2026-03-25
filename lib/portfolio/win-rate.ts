import type { HoldingRecord } from "@/lib/portfolio/calculations";

function round(value: number, precision = 2) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export type WinRateStats = {
  total: number;
  profitable: number;
  losing: number;
  breakEven: number;
  winRatePercentage: number;
};

export function calculateWinRateStats(holdings: HoldingRecord[]): WinRateStats {
  const total = holdings.length;
  const profitable = holdings.filter((holding) => holding.gainLoss > 0).length;
  const losing = holdings.filter((holding) => holding.gainLoss < 0).length;
  const breakEven = total - profitable - losing;
  const winRatePercentage = total > 0 ? round((profitable / total) * 100) : 0;

  return {
    total,
    profitable,
    losing,
    breakEven,
    winRatePercentage,
  };
}
