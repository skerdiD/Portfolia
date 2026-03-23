"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeDollarSign,
  Search,
  Wallet2,
  X,
} from "lucide-react";
import type { AssetCategory } from "@/lib/db/schema";
import type {
  HoldingRecord,
  PortfolioSummaryData,
} from "@/lib/portfolio/calculations";
import { formatCurrency, formatPercentage } from "@/lib/portfolio/formatters";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { HoldingFormDialog } from "@/components/holdings/holding-form-dialog";
import { HoldingsTable } from "@/components/holdings/holdings-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type HoldingsPageClientProps = {
  initialData: {
    holdings: HoldingRecord[];
    summary: PortfolioSummaryData;
  };
};

const categoryOptions: Array<{ label: string; value: "all" | AssetCategory }> = [
  { label: "All assets", value: "all" },
  { label: "Stocks", value: "stock" },
  { label: "Crypto", value: "crypto" },
  { label: "ETFs", value: "etf" },
  { label: "Cash", value: "cash" },
  { label: "Other", value: "other" },
];

function getSummaryFromHoldings(holdings: HoldingRecord[]): PortfolioSummaryData {
  const investedAmount = holdings.reduce((sum, item) => sum + item.investedAmount, 0);
  const currentValue = holdings.reduce((sum, item) => sum + item.currentValue, 0);
  const gainLoss = currentValue - investedAmount;
  const returnPercentage = investedAmount > 0 ? (gainLoss / investedAmount) * 100 : 0;

  return {
    holdingsCount: holdings.length,
    investedAmount,
    currentValue,
    gainLoss,
    returnPercentage,
  };
}

export function HoldingsPageClient({ initialData }: HoldingsPageClientProps) {
  const [holdings, setHoldings] = useState(initialData.holdings);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | AssetCategory>("all");

  const filteredHoldings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return holdings.filter((holding) => {
      const matchesCategory =
        category === "all" ? true : holding.category === category;

      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : holding.assetName.toLowerCase().includes(normalizedQuery) ||
            holding.symbol.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [holdings, query, category]);

  const filteredSummary = useMemo(
    () => getSummaryFromHoldings(filteredHoldings),
    [filteredHoldings],
  );

  const hasFilters = query.trim().length > 0 || category !== "all";
  const hasAnyHoldings = holdings.length > 0;
  const hasFilteredResults = filteredHoldings.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Portfolio management"
        title="Holdings"
        description="Manage your investment positions with a polished financial workspace built for fast review, accurate numbers, and clean portfolio operations."
        actions={
          <div className="flex items-center gap-2">
            <HoldingFormDialog
              mode="create"
              onSuccess={(holding) => {
                setHoldings((current) => {
                  const next = [holding, ...current];
                  next.sort((a, b) => {
                    if (a.purchaseDate === b.purchaseDate) {
                      return b.createdAt.getTime() - a.createdAt.getTime();
                    }

                    return b.purchaseDate.localeCompare(a.purchaseDate);
                  });
                  return next;
                });
              }}
              trigger={
                <button className={buttonVariants({ size: "lg" })}>
                  Add holding
                </button>
              }
            />
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Holdings Count"
          value={String(filteredSummary.holdingsCount)}
          icon={Wallet2}
          tone="primary"
          detail={hasFilters ? "Filtered holdings view" : "All portfolio positions"}
        />
        <StatCard
          title="Invested Capital"
          value={formatCurrency(filteredSummary.investedAmount)}
          icon={BadgeDollarSign}
          tone="primary"
          detail="Total capital deployed"
        />
        <StatCard
          title="Current Value"
          value={formatCurrency(filteredSummary.currentValue)}
          icon={ArrowUpRight}
          tone="success"
          detail="Live portfolio valuation"
        />
        <StatCard
          title="Portfolio Return"
          value={formatPercentage(filteredSummary.returnPercentage)}
          icon={ArrowUpRight}
          tone={filteredSummary.gainLoss >= 0 ? "success" : "danger"}
          detail={
            filteredSummary.gainLoss >= 0
              ? `${formatCurrency(filteredSummary.gainLoss)} unrealized gain`
              : `${formatCurrency(Math.abs(filteredSummary.gainLoss))} unrealized loss`
          }
        />
      </div>

      <Card className="surface rounded-[1.75rem]">
        <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-2">
            <label
              htmlFor="holdings-search"
              className="text-sm font-medium text-slate-700"
            >
              Search assets
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="holdings-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-11"
                placeholder="Search by asset name or ticker..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700">
              <span>Categories</span>
              <span className="text-xs text-slate-500">
                {filteredHoldings.length} matching {filteredHoldings.length === 1 ? "asset" : "assets"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => {
                const isActive = category === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCategory(option.value)}
                    aria-pressed={isActive}
                    className={cn(
                      "inline-flex h-11 items-center rounded-2xl border px-4 text-sm font-medium transition",
                      isActive
                        ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}

              {hasFilters ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {!hasAnyHoldings ? (
        <EmptyState
          title="Your portfolio has no holdings yet"
          description="Add your first stock, crypto, ETF, cash position, or custom asset to start building a real portfolio dashboard with derived analytics and performance metrics."
          action={
            <HoldingFormDialog
              mode="create"
              onSuccess={(holding) => {
                setHoldings([holding]);
              }}
              trigger={
                <button className={buttonVariants({ size: "lg" })}>
                  Add first holding
                </button>
              }
            />
          }
        />
      ) : !hasFilteredResults ? (
        <EmptyState
          title="No holdings match your filters"
          description="Try a different asset name, ticker, or category filter to find the position you want."
          action={
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              Reset filters
            </Button>
          }
        />
      ) : (
        <HoldingsTable
          holdings={filteredHoldings}
          onHoldingUpdated={(updatedHolding) => {
            setHoldings((current) =>
              current.map((holding) =>
                holding.id === updatedHolding.id ? updatedHolding : holding,
              ),
            );
          }}
          onHoldingDeleted={(holdingId) => {
            setHoldings((current) =>
              current.filter((holding) => holding.id !== holdingId),
            );
          }}
        />
      )}
    </div>
  );
}
