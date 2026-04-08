import type { HoldingRecord } from "@/lib/portfolio/calculations";
import { calculatePortfolioSummary } from "@/lib/portfolio/calculations";
import type { PortfolioSnapshotInput } from "@/lib/validations/holding";

export function getSnapshotDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function buildSnapshotInputFromHoldings(
  holdings: HoldingRecord[],
  snapshotDate = getSnapshotDate(),
): PortfolioSnapshotInput {
  const summary = calculatePortfolioSummary(holdings);

  return {
    date: snapshotDate,
    totalValue: summary.currentValue,
    investedAmount: summary.investedAmount,
  };
}
