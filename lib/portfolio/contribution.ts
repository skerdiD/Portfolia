import type { HoldingRecord } from "@/lib/portfolio/calculations";

function round(value: number, precision = 2) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export type PortfolioContributionPoint = {
  holdingId: string;
  assetName: string;
  symbol: string;
  gainLoss: number;
  contributionPercentage: number;
  impactSharePercentage: number;
};

export function buildPortfolioContributionPoints(
  holdings: HoldingRecord[],
  options?: {
    limit?: number;
  },
): PortfolioContributionPoint[] {
  if (holdings.length === 0) {
    return [];
  }

  const limit = options?.limit ?? 5;
  const totalGainLoss = holdings.reduce((sum, holding) => sum + holding.gainLoss, 0);
  const totalAbsoluteGainLoss = holdings.reduce(
    (sum, holding) => sum + Math.abs(holding.gainLoss),
    0,
  );

  // Use net P&L as denominator when meaningful; fallback avoids unstable percentages near zero.
  const denominator =
    Math.abs(totalGainLoss) >= 0.01 ? totalGainLoss : totalAbsoluteGainLoss;

  return [...holdings]
    .sort((a, b) => Math.abs(b.gainLoss) - Math.abs(a.gainLoss))
    .slice(0, limit)
    .map((holding) => ({
      holdingId: holding.id,
      assetName: holding.assetName,
      symbol: holding.symbol,
      gainLoss: holding.gainLoss,
      contributionPercentage:
        denominator !== 0 ? round((holding.gainLoss / denominator) * 100) : 0,
      impactSharePercentage:
        totalAbsoluteGainLoss > 0
          ? round((Math.abs(holding.gainLoss) / totalAbsoluteGainLoss) * 100)
          : 0,
    }));
}
