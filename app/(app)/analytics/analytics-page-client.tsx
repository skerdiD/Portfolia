"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChartColumnBig,
  Filter,
  Search,
  SlidersHorizontal,
  TrendingUp,
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
import { AdvancedPerformanceChart } from "@/components/analytics/advanced-performance-chart";
import { CategoryAnalysisCards } from "@/components/analytics/category-analysis-cards";
import { PerformerSpotlight } from "@/components/analytics/performer-spotlight";
import { AssetPerformanceTable } from "@/components/analytics/asset-performance-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AnalyticsPageClientProps = {
  holdings: HoldingRecord[];
  summary: PortfolioSummaryData;
  allocation: AllocationPoint[];
  performanceHistory: PerformanceHistoryPoint[];
};

type TimeRange = "all" | "90d" | "30d" | "7d";
type CategoryFilter = "all" | HoldingRecord["category"];

function filterHistoryByRange(
  history: PerformanceHistoryPoint[],
  range: TimeRange,
): PerformanceHistoryPoint[] {
  if (range === "all" || history.length === 0) {
    return history;
  }

  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const latestDate = new Date(`${sorted[sorted.length - 1].date}T00:00:00.000Z`);
  const days = range === "90d" ? 90 : range === "30d" ? 30 : 7;
  const threshold = new Date(latestDate);
  threshold.setUTCDate(threshold.getUTCDate() - days);

  return sorted.filter((item) => {
    const itemDate = new Date(`${item.date}T00:00:00.000Z`);
    return itemDate >= threshold;
  });
}

function buildSummary(holdings: HoldingRecord[]): PortfolioSummaryData {
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

function buildAllocation(holdings: HoldingRecord[]): AllocationPoint[] {
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
    .map(([category, value]) => ({
      category,
      investedAmount: value.investedAmount,
      currentValue: value.currentValue,
      gainLoss: value.gainLoss,
      percentage: totalCurrentValue > 0 ? (value.currentValue / totalCurrentValue) * 100 : 0,
    }))
    .sort((a, b) => b.currentValue - a.currentValue);
}

function categoryLabel(category: CategoryFilter) {
  if (category === "all") return "All assets";
  if (category === "etf") return "ETFs";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function AnalyticsPageClient({
  holdings,
  summary,
  allocation,
  performanceHistory,
}: AnalyticsPageClientProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [assetQuery, setAssetQuery] = useState("");
  const hasFilters = category !== "all" || assetQuery.trim().length > 0;

  const filteredHoldings = useMemo(() => {
    const query = assetQuery.trim().toLowerCase();

    return holdings.filter((holding) => {
      const matchesCategory = category === "all" || holding.category === category;
      const matchesAsset =
        query.length === 0
          ? true
          : holding.assetName.toLowerCase().includes(query) ||
            holding.symbol.toLowerCase().includes(query);

      return matchesCategory && matchesAsset;
    });
  }, [assetQuery, category, holdings]);

  const filteredSummary = useMemo(() => {
    if (category === "all" && assetQuery.trim().length === 0) {
      return summary;
    }

    return buildSummary(filteredHoldings);
  }, [assetQuery, category, filteredHoldings, summary]);

  const filteredAllocation = useMemo(() => {
    if (category === "all" && assetQuery.trim().length === 0) {
      return allocation;
    }

    return buildAllocation(filteredHoldings);
  }, [allocation, assetQuery, category, filteredHoldings]);

  const filteredPerformance = useMemo(() => {
    const ranged = filterHistoryByRange(performanceHistory, timeRange);

    if (category === "all" && assetQuery.trim().length === 0) {
      return ranged;
    }

    return ranged.map((point) => ({
      ...point,
      totalValue: filteredSummary.currentValue,
      investedAmount: filteredSummary.investedAmount,
      gainLoss: filteredSummary.gainLoss,
      returnPercentage: filteredSummary.returnPercentage,
    }));
  }, [assetQuery, category, filteredSummary, performanceHistory, timeRange]);

  const bestPerformer = useMemo(
    () =>
      [...filteredHoldings].sort((a, b) => b.returnPercentage - a.returnPercentage)[0] ??
      null,
    [filteredHoldings],
  );

  const worstPerformer = useMemo(
    () =>
      [...filteredHoldings].sort((a, b) => a.returnPercentage - b.returnPercentage)[0] ??
      null,
    [filteredHoldings],
  );

  if (holdings.length === 0) {
    return <EmptyDashboardState />;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Deep portfolio analysis"
        title="Analytics"
        description="Explore performance trends, asset-level return behavior, and category concentration through a sharper, more detailed analytics experience."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "90d", "30d", "7d"] as TimeRange[]).map((value) => (
              <Button
                key={value}
                type="button"
                variant={timeRange === value ? "secondary" : "outline"}
                size="sm"
                className={cn(timeRange === value ? "ring-2 ring-blue-100" : "")}
                onClick={() => setTimeRange(value)}
              >
                {value === "all" ? "All time" : value.toUpperCase()}
              </Button>
            ))}
          </div>
        }
      />

      <Card className="surface rounded-[1.75rem]">
        <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-2">
            <label
              htmlFor="analytics-search"
              className="flex items-center gap-2 text-sm font-medium text-slate-700"
            >
              <Search className="h-4 w-4 text-slate-400" />
              Asset search
            </label>
            <Input
              id="analytics-search"
              value={assetQuery}
              onChange={(event) => setAssetQuery(event.target.value)}
              placeholder="Filter by asset name or ticker..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Filter className="h-4 w-4 text-slate-400" />
              Category filter
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "stock", "crypto", "etf", "cash", "other"] as CategoryFilter[]).map(
                (value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCategory(value)}
                    aria-pressed={category === value}
                    className={cn(
                      "inline-flex h-11 items-center rounded-2xl border px-4 text-sm font-medium transition",
                      category === value
                        ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                    )}
                  >
                    {value === "all"
                      ? "All"
                      : value === "etf"
                        ? "ETF"
                        : value.charAt(0).toUpperCase() + value.slice(1)}
                  </button>
                ),
              )}

              {hasFilters ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCategory("all");
                    setAssetQuery("");
                  }}
                >
                  Reset
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Portfolio Value"
          value={formatCurrency(filteredSummary.currentValue)}
          icon={ChartColumnBig}
          tone="success"
          detail={`Filtered view: ${categoryLabel(category)}`}
        />
        <StatCard
          title="Invested Capital"
          value={formatCurrency(filteredSummary.investedAmount)}
          icon={SlidersHorizontal}
          tone="primary"
          detail="Cost basis across selected positions"
        />
        <StatCard
          title="Gain / Loss"
          value={`${filteredSummary.gainLoss >= 0 ? "+" : "-"}${formatCurrency(
            Math.abs(filteredSummary.gainLoss),
          )}`}
          icon={filteredSummary.gainLoss >= 0 ? ArrowUpRight : ArrowDownRight}
          tone={filteredSummary.gainLoss >= 0 ? "success" : "danger"}
          detail="Unrealized position impact"
        />
        <StatCard
          title="Return Percentage"
          value={formatPercentage(filteredSummary.returnPercentage)}
          icon={TrendingUp}
          tone={filteredSummary.returnPercentage >= 0 ? "success" : "danger"}
          detail={`${filteredSummary.holdingsCount} assets in scope`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <AdvancedPerformanceChart data={filteredPerformance} />
        <CategoryAnalysisCards allocation={filteredAllocation} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PerformerSpotlight
          bestPerformer={bestPerformer}
          worstPerformer={worstPerformer}
        />
        <AssetPerformanceTable holdings={filteredHoldings} />
      </div>
    </div>
  );
}
