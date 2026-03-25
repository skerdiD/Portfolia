"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CandlestickChart } from "lucide-react";
import type { HoldingRecord } from "@/lib/portfolio/calculations";
import { buttonVariants } from "@/components/ui/button";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/lib/portfolio/formatters";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AssetPerformanceTableProps = {
  holdings: HoldingRecord[];
};

const categoryLabel: Record<HoldingRecord["category"], string> = {
  stock: "Stock",
  crypto: "Crypto",
  etf: "ETF",
  cash: "Cash",
  other: "Other",
};

const categoryBadgeStyle: Record<HoldingRecord["category"], string> = {
  stock: "border-blue-200 bg-blue-50 text-blue-700",
  crypto: "border-violet-200 bg-violet-50 text-violet-700",
  etf: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cash: "border-amber-200 bg-amber-50 text-amber-700",
  other: "border-slate-200 bg-slate-100 text-slate-700",
};

export function AssetPerformanceTable({ holdings }: AssetPerformanceTableProps) {
  const sorted = useMemo(
    () => [...holdings].sort((a, b) => b.currentValue - a.currentValue),
    [holdings],
  );

  return (
    <Card className="surface rounded-[1.75rem]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          Per-asset performance
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Position-level metrics for valuation, return, and unrealized portfolio impact.
        </p>
      </CardHeader>

      <CardContent className="p-0">
        <div className="hidden xl:block">
          <div className="grid grid-cols-[1.7fr_0.85fr_0.9fr_1fr_1fr_1fr_1fr] gap-4 bg-slate-50/85 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            <div>Asset</div>
            <div>Category</div>
            <div className="text-right">Quantity</div>
            <div className="text-right">Invested</div>
            <div className="text-right">Value</div>
            <div className="text-right">P&amp;L</div>
            <div className="text-right">Return</div>
          </div>

          {sorted.length > 0 ? (
            sorted.map((holding, index) => (
              <div
                key={holding.id}
                className={cn(
                  "grid grid-cols-[1.7fr_0.85fr_0.9fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-5 transition hover:bg-slate-50/75",
                  index !== sorted.length - 1 && "border-b border-slate-200/70",
                )}
              >
                <div className="min-w-0">
                  <div className="font-semibold text-slate-950">{holding.assetName}</div>
                  <div className="mt-1 text-sm text-slate-500">{holding.symbol}</div>
                </div>

                <div>
                  <Badge
                    variant="outline"
                    className={cn("border", categoryBadgeStyle[holding.category])}
                  >
                    {categoryLabel[holding.category]}
                  </Badge>
                </div>

                <div className="text-right font-medium text-slate-800">
                  {formatNumber(holding.quantity, 4)}
                </div>
                <div className="text-right font-medium text-slate-800">
                  {formatCurrency(holding.investedAmount)}
                </div>
                <div className="text-right font-semibold text-slate-950">
                  {formatCurrency(holding.currentValue)}
                </div>
                <div
                  className={cn(
                    "text-right font-semibold",
                    holding.gainLoss >= 0 ? "text-emerald-600" : "text-rose-600",
                  )}
                >
                  {holding.gainLoss >= 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(holding.gainLoss))}
                </div>
                <div
                  className={cn(
                    "text-right font-semibold",
                    holding.returnPercentage >= 0 ? "text-emerald-600" : "text-rose-600",
                  )}
                >
                  {formatPercentage(holding.returnPercentage)}
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-10">
              <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/70 px-5 py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
                  <CandlestickChart className="h-5 w-5" />
                </div>
                <div className="mt-3 text-base font-semibold text-slate-900">
                  No assets in this filtered view
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Adjust your search or category filters to inspect position-level performance.
                </div>
                <Link
                  href="/holdings"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
                >
                  Manage holdings
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-4 p-4 xl:hidden">
          {sorted.length > 0 ? (
            sorted.map((holding) => (
              <div
                key={holding.id}
                className="rounded-[1.35rem] border border-slate-200/80 bg-white/85 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-950">{holding.assetName}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {holding.symbol} | {categoryLabel[holding.category]}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      holding.returnPercentage >= 0
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700",
                    )}
                  >
                    {formatPercentage(holding.returnPercentage)}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                    <div className="text-sm text-slate-500">Quantity</div>
                    <div className="mt-1 font-semibold text-slate-950">
                      {formatNumber(holding.quantity, 4)}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                    <div className="text-sm text-slate-500">Current Value</div>
                    <div className="mt-1 font-semibold text-slate-950">
                      {formatCurrency(holding.currentValue)}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                    <div className="text-sm text-slate-500">Invested</div>
                    <div className="mt-1 font-semibold text-slate-950">
                      {formatCurrency(holding.investedAmount)}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                    <div className="text-sm text-slate-500">Gain / Loss</div>
                    <div
                      className={cn(
                        "mt-1 font-semibold",
                        holding.gainLoss >= 0 ? "text-emerald-600" : "text-rose-600",
                      )}
                    >
                      {holding.gainLoss >= 0 ? "+" : "-"}
                      {formatCurrency(Math.abs(holding.gainLoss))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/70 px-5 py-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
                <CandlestickChart className="h-5 w-5" />
              </div>
              <div className="mt-3 text-base font-semibold text-slate-900">
                No assets in this filtered view
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Reset filters or adjust search terms to view asset performance cards.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
