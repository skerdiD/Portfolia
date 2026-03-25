"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowUpRight,
  BadgeDollarSign,
  ChartNoAxesCombined,
  PieChart,
  Wallet2,
} from "lucide-react";
import type {
  AllocationPoint,
  HoldingRecord,
  PerformanceHistoryPoint,
  PortfolioSummaryData,
} from "@/lib/portfolio/calculations";
import { formatCurrency, formatPercentage } from "@/lib/portfolio/formatters";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyDashboardState } from "@/components/dashboard/empty-dashboard-state";
import { TopHoldingsCard } from "@/components/dashboard/top-holdings-card";
import { PortfolioInsightsCard } from "@/components/dashboard/portfolio-insights-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardPageClientProps = {
  holdings: HoldingRecord[];
  summary: PortfolioSummaryData;
  allocation: AllocationPoint[];
  performanceHistory: PerformanceHistoryPoint[];
};

type TimeRange = "all" | "90d" | "30d" | "7d";
type CategoryFilter = "all" | HoldingRecord["category"];

const ChartLoading = () => (
  <div className="h-[360px] w-full animate-pulse rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70" />
);

const PerformanceAreaChart = dynamic(
  () =>
    import("@/components/dashboard/performance-area-chart").then(
      (module) => module.PerformanceAreaChart,
    ),
  {
    loading: ChartLoading,
    ssr: false,
  },
);

const AllocationDonutChart = dynamic(
  () =>
    import("@/components/dashboard/allocation-donut-chart").then(
      (module) => module.AllocationDonutChart,
    ),
  {
    loading: ChartLoading,
    ssr: false,
  },
);

function calculateSummary(holdings: HoldingRecord[]): PortfolioSummaryData {
  const investedAmount = holdings.reduce((sum, item) => sum + item.investedAmount, 0);
  const currentValue = holdings.reduce((sum, item) => sum + item.currentValue, 0);
  const gainLoss = currentValue - investedAmount;

  return {
    holdingsCount: holdings.length,
    investedAmount,
    currentValue,
    gainLoss,
    returnPercentage: investedAmount > 0 ? (gainLoss / investedAmount) * 100 : 0,
  };
}

function calculateAllocation(holdings: HoldingRecord[]): AllocationPoint[] {
  const grouped = new Map<
    HoldingRecord["category"],
    {
      investedAmount: number;
      currentValue: number;
      gainLoss: number;
    }
  >();

  for (const holding of holdings) {
    const current = grouped.get(holding.category) ?? {
      investedAmount: 0,
      currentValue: 0,
      gainLoss: 0,
    };

    current.investedAmount += holding.investedAmount;
    current.currentValue += holding.currentValue;
    current.gainLoss += holding.gainLoss;

    grouped.set(holding.category, current);
  }

  const totalCurrentValue = Array.from(grouped.values()).reduce(
    (sum, item) => sum + item.currentValue,
    0,
  );

  return Array.from(grouped.entries())
    .map(([category, values]) => ({
      category,
      investedAmount: values.investedAmount,
      currentValue: values.currentValue,
      gainLoss: values.gainLoss,
      percentage:
        totalCurrentValue > 0 ? (values.currentValue / totalCurrentValue) * 100 : 0,
    }))
    .sort((a, b) => b.currentValue - a.currentValue);
}

function filterHistoryByRange(
  history: PerformanceHistoryPoint[],
  range: TimeRange,
): PerformanceHistoryPoint[] {
  if (range === "all") {
    return history;
  }

  const days = range === "90d" ? 90 : range === "30d" ? 30 : 7;

  if (history.length === 0) {
    return history;
  }

  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const latestDate = new Date(`${sorted[sorted.length - 1].date}T00:00:00.000Z`);
  const threshold = new Date(latestDate);
  threshold.setUTCDate(threshold.getUTCDate() - days);

  return sorted.filter((point) => {
    const currentDate = new Date(`${point.date}T00:00:00.000Z`);
    return currentDate >= threshold;
  });
}

export function DashboardPageClient({
  holdings,
  summary,
  allocation,
  performanceHistory,
}: DashboardPageClientProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filteredHoldings = useMemo(() => {
    if (category === "all") {
      return holdings;
    }

    return holdings.filter((holding) => holding.category === category);
  }, [holdings, category]);

  const filteredSummary = useMemo(() => {
    if (category === "all") {
      return summary;
    }

    return calculateSummary(filteredHoldings);
  }, [category, filteredHoldings, summary]);

  const filteredAllocation = useMemo(() => {
    if (category === "all") {
      return allocation;
    }

    return calculateAllocation(filteredHoldings);
  }, [allocation, category, filteredHoldings]);

  const filteredPerformanceHistory = useMemo(() => {
    const source =
      category === "all"
        ? performanceHistory
        : performanceHistory.map((point) => ({
            ...point,
            totalValue: filteredSummary.currentValue,
            investedAmount: filteredSummary.investedAmount,
            gainLoss: filteredSummary.gainLoss,
            returnPercentage: filteredSummary.returnPercentage,
          }));

    return filterHistoryByRange(source, timeRange);
  }, [category, filteredSummary, performanceHistory, timeRange]);

  const topHoldings = useMemo(
    () =>
      [...filteredHoldings]
        .sort((a, b) => b.currentValue - a.currentValue)
        .slice(0, 5),
    [filteredHoldings],
  );

  const hasHoldings = holdings.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        eyebrow="Portfolio overview"
        title="Investment dashboard"
        description="Monitor portfolio value, allocation, and performance through a polished analytics workspace designed like a real fintech product."
        density="compact"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "90d", "30d", "7d"] as TimeRange[]).map((value) => (
              <Button
                key={value}
                type="button"
                variant={timeRange === value ? "secondary" : "outline"}
                size="sm"
                onClick={() => setTimeRange(value)}
              >
                {value === "all" ? "All time" : value.toUpperCase()}
              </Button>
            ))}
          </div>
        }
      />

      {hasHoldings ? (
        <>
          <div className="flex flex-wrap gap-2">
            {(["all", "stock", "crypto", "etf", "cash", "other"] as CategoryFilter[]).map(
              (value) => (
                <Button
                  key={value}
                  type="button"
                  variant={category === value ? "secondary" : "outline"}
                  size="sm"
                  className={cn(category === value ? "ring-2 ring-blue-100" : "")}
                  onClick={() => setCategory(value)}
                >
                  {value === "all"
                    ? "All assets"
                    : value === "etf"
                      ? "ETF"
                      : value.charAt(0).toUpperCase() + value.slice(1)}
                </Button>
              ),
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Portfolio Value"
              value={formatCurrency(filteredSummary.currentValue)}
              icon={BadgeDollarSign}
              tone="success"
              detail="Current total market value"
            />
            <StatCard
              title="Invested Capital"
              value={formatCurrency(filteredSummary.investedAmount)}
              icon={Wallet2}
              tone="primary"
              detail="Capital deployed across holdings"
            />
            <StatCard
              title="Unrealized P&L"
              value={`${filteredSummary.gainLoss >= 0 ? "+" : "-"}${formatCurrency(
                Math.abs(filteredSummary.gainLoss),
              )}`}
              icon={ArrowUpRight}
              tone={filteredSummary.gainLoss >= 0 ? "success" : "danger"}
              detail="Difference between value and cost basis"
            />
            <StatCard
              title="Return Percentage"
              value={formatPercentage(filteredSummary.returnPercentage)}
              icon={ChartNoAxesCombined}
              tone={filteredSummary.returnPercentage >= 0 ? "success" : "danger"}
              detail="Net return on invested capital"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
            <Card className="surface rounded-[1.75rem]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                <div>
                  <CardTitle className="text-2xl font-semibold text-slate-950">
                    Portfolio value over time
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Performance trend built from portfolio snapshots or derived holding history.
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full bg-white/80 px-3 py-1">
                  {timeRange === "all" ? "All time" : timeRange.toUpperCase()}
                </Badge>
              </CardHeader>
              <CardContent className="pt-6">
                <PerformanceAreaChart data={filteredPerformanceHistory} />
              </CardContent>
            </Card>

            <Card className="surface rounded-[1.75rem]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                <div>
                  <CardTitle className="text-2xl font-semibold text-slate-950">
                    Asset allocation
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Current portfolio distribution by category.
                  </p>
                </div>
                <PieChart className="h-5 w-5 text-slate-400" />
              </CardHeader>
              <CardContent className="pt-6">
                <AllocationDonutChart data={filteredAllocation} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <TopHoldingsCard holdings={topHoldings} />
            <PortfolioInsightsCard
              summary={filteredSummary}
              holdings={filteredHoldings}
              allocation={filteredAllocation}
            />
          </div>

          <RecentActivityCard holdings={filteredHoldings} />
        </>
      ) : (
        <EmptyDashboardState />
      )}
    </div>
  );
}
