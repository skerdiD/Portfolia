"use client";

import type {
  AllocationPoint,
  HoldingRecord,
  PortfolioSummaryData,
} from "@/lib/portfolio/calculations";
import { formatCurrency, formatPercentage } from "@/lib/portfolio/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PortfolioInsightsCardProps = {
  summary: PortfolioSummaryData;
  holdings: HoldingRecord[];
  allocation: AllocationPoint[];
};

function getInsightItems({
  summary,
  holdings,
  allocation,
}: PortfolioInsightsCardProps) {
  const items: string[] = [];

  const topCategory = allocation[0];
  const bestHolding = [...holdings].sort((a, b) => b.returnPercentage - a.returnPercentage)[0];
  const largestHolding = [...holdings].sort((a, b) => b.currentValue - a.currentValue)[0];

  if (topCategory) {
    const label =
      topCategory.category === "etf"
        ? "ETFs"
        : topCategory.category.charAt(0).toUpperCase() + topCategory.category.slice(1);

    items.push(
      `${label} currently represent ${formatPercentage(
        topCategory.percentage,
      )} of portfolio value, making it your largest allocation bucket.`,
    );
  }

  if (bestHolding) {
    items.push(
      `${bestHolding.assetName} is your strongest performer so far at ${formatPercentage(
        bestHolding.returnPercentage,
      )}, with ${formatCurrency(bestHolding.gainLoss)} in unrealized gain/loss impact.`,
    );
  }

  if (largestHolding) {
    items.push(
      `${largestHolding.assetName} is your biggest position at ${formatCurrency(
        largestHolding.currentValue,
      )}, which means it has the highest portfolio-level influence.`,
    );
  }

  if (summary.investedAmount > 0) {
    items.push(
      `Your overall portfolio return stands at ${formatPercentage(
        summary.returnPercentage,
      )}, based on ${formatCurrency(summary.investedAmount)} invested capital.`,
    );
  }

  return items.slice(0, 4);
}

export function PortfolioInsightsCard(props: PortfolioInsightsCardProps) {
  const insights = getInsightItems(props);

  return (
    <Card className="surface rounded-[1.75rem]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          Portfolio insights
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Derived observations based on your current positions and allocation.
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={`${index}-${insight}`}
            className="rounded-[1.35rem] border border-slate-200/80 bg-white/85 px-4 py-4 shadow-sm"
          >
            <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
              {index + 1}
            </div>
            <p className="text-sm leading-7 text-slate-700">{insight}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}