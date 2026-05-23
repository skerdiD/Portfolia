"use client";

import { useDeferredValue, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChartColumnBig,
  Filter,
  LineChart,
  Search,
  SlidersHorizontal,
  TrendingUp,
  X,
} from "lucide-react";
import type {
  AllocationPoint,
  HoldingRecord,
  PerformanceHistoryPoint,
  PortfolioSummaryData,
} from "@/lib/portfolio/calculations";
import type { DisplayCurrency } from "@/lib/db/schema";
import {
  calculateAllocationByCategory,
  calculateAssetPerformanceInsights,
  calculatePortfolioSummary,
} from "@/lib/portfolio/calculations";
import { filterHoldingsByQueryAndCategory } from "@/lib/portfolio/holdings-helpers";
import {
  BASE_CURRENCY,
  formatCurrency,
  formatPercentage,
} from "@/lib/portfolio/formatters";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyDashboardState } from "@/components/dashboard/empty-dashboard-state";
import { EmptyState } from "@/components/shared/empty-state";
import { BestWorstCategoryCard } from "@/components/analytics/best-worst-category-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AnalyticsPageClientProps = {
  holdings: HoldingRecord[];
  summary: PortfolioSummaryData;
  allocation: AllocationPoint[];
  performanceHistory: PerformanceHistoryPoint[];
  displayCurrency?: DisplayCurrency;
};

type TimeRange = "all" | "90d" | "30d" | "7d";
type CategoryFilter = "all" | HoldingRecord["category"];

const ChartLoading = () => (
  <div className="h-[380px] w-full animate-pulse rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70" />
);

const AdvancedPerformanceChart = dynamic(
  () =>
    import("@/components/analytics/advanced-performance-chart").then(
      (module) => module.AdvancedPerformanceChart,
    ),
  {
    loading: ChartLoading,
    ssr: false,
  },
);

const CategoryAnalysisCards = dynamic(
  () =>
    import("@/components/analytics/category-analysis-cards").then(
      (module) => module.CategoryAnalysisCards,
    ),
  {
    loading: ChartLoading,
    ssr: false,
  },
);

const PerformerSpotlight = dynamic(
  () =>
    import("@/components/analytics/performer-spotlight").then(
      (module) => module.PerformerSpotlight,
    ),
  {
    loading: ChartLoading,
    ssr: false,
  },
);

const AssetPerformanceTable = dynamic(
  () =>
    import("@/components/analytics/asset-performance-table").then(
      (module) => module.AssetPerformanceTable,
    ),
  {
    loading: ChartLoading,
    ssr: false,
  },
);

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
  displayCurrency = BASE_CURRENCY,
}: AnalyticsPageClientProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [assetQuery, setAssetQuery] = useState("");
  const deferredAssetQuery = useDeferredValue(assetQuery);
  const hasActiveAssetQuery = deferredAssetQuery.trim().length > 0;
  const hasFilters = category !== "all" || assetQuery.trim().length > 0;

  const filteredHoldings = useMemo(() => {
    return filterHoldingsByQueryAndCategory({
      holdings,
      query: deferredAssetQuery,
      category,
    });
  }, [category, deferredAssetQuery, holdings]);
  const hasFilteredResults = filteredHoldings.length > 0;

  const filteredSummary = useMemo(() => {
    if (category === "all" && !hasActiveAssetQuery) {
      return summary;
    }

    return calculatePortfolioSummary(filteredHoldings);
  }, [category, filteredHoldings, hasActiveAssetQuery, summary]);

  const filteredAllocation = useMemo(() => {
    if (category === "all" && !hasActiveAssetQuery) {
      return allocation;
    }

    return calculateAllocationByCategory(filteredHoldings);
  }, [allocation, category, filteredHoldings, hasActiveAssetQuery]);

  const filteredPerformance = useMemo(() => {
    const ranged = filterHistoryByRange(performanceHistory, timeRange);

    if (category === "all" && !hasActiveAssetQuery) {
      return ranged;
    }

    return ranged.map((point) => ({
      ...point,
      totalValue: filteredSummary.currentValue,
      investedAmount: filteredSummary.investedAmount,
      gainLoss: filteredSummary.gainLoss,
      returnPercentage: filteredSummary.returnPercentage,
    }));
  }, [category, filteredSummary, hasActiveAssetQuery, performanceHistory, timeRange]);

  const { bestPerformer, worstPerformer } = useMemo(
    () => calculateAssetPerformanceInsights(filteredHoldings),
    [filteredHoldings],
  );

  if (holdings.length === 0) {
    return <EmptyDashboardState />;
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        eyebrow="Deep portfolio analysis"
        title="Analytics"
        description="Explore performance trends, asset-level return behavior, and category concentration through a sharper, more detailed analytics experience."
        density="compact"
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
          value={formatCurrency(filteredSummary.currentValue, displayCurrency)}
          icon={ChartColumnBig}
          tone="success"
          detail={`Filtered view: ${categoryLabel(category)}`}
        />
        <StatCard
          title="Invested Capital"
          value={formatCurrency(filteredSummary.investedAmount, displayCurrency)}
          icon={SlidersHorizontal}
          tone="primary"
          detail="Cost basis across selected positions"
        />
        <StatCard
          title="Gain / Loss"
          value={`${filteredSummary.gainLoss >= 0 ? "+" : "-"}${formatCurrency(
            Math.abs(filteredSummary.gainLoss),
            displayCurrency,
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

      {!hasFilteredResults ? (
        <EmptyState
          title="No analytics data matches this filter"
          description="No assets in your portfolio match the selected category or search query. Reset filters to bring back your full analytics view."
          icon={<LineChart className="h-6 w-6" />}
          action={
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setCategory("all");
                setAssetQuery("");
              }}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="grid content-start gap-6">
            <AdvancedPerformanceChart
              data={filteredPerformance}
              displayCurrency={displayCurrency}
            />
            <BestWorstCategoryCard
              allocation={filteredAllocation}
              displayCurrency={displayCurrency}
            />
          </div>
          <CategoryAnalysisCards
            allocation={filteredAllocation}
            displayCurrency={displayCurrency}
          />
        </div>
      )}

      {hasFilteredResults ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <PerformerSpotlight
            bestPerformer={bestPerformer}
            worstPerformer={worstPerformer}
            displayCurrency={displayCurrency}
          />
          <AssetPerformanceTable
            holdings={filteredHoldings}
            displayCurrency={displayCurrency}
          />
        </div>
      ) : null}
    </div>
  );
}
