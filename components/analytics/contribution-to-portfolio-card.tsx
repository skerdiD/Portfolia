"use client";

import { useMemo } from "react";
import { ChartNoAxesCombined } from "lucide-react";
import type { HoldingRecord } from "@/lib/portfolio/calculations";
import { buildPortfolioContributionPoints } from "@/lib/portfolio/contribution";
import { formatCurrency, formatPercentage } from "@/lib/portfolio/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ContributionToPortfolioCardProps = {
  holdings: HoldingRecord[];
};

export function ContributionToPortfolioCard({
  holdings,
}: ContributionToPortfolioCardProps) {
  const contributionRows = useMemo(
    () => buildPortfolioContributionPoints(holdings, { limit: 5 }),
    [holdings],
  );

  const totalGainLoss = useMemo(
    () => holdings.reduce((sum, holding) => sum + holding.gainLoss, 0),
    [holdings],
  );

  return (
    <Card className="surface rounded-[1.75rem]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          Contribution to portfolio
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Which assets are driving portfolio performance right now based on unrealized P&amp;L impact.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/70 px-4 py-3">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Net portfolio P&amp;L
          </div>
          <div
            className={cn(
              "mt-1 text-2xl font-semibold",
              totalGainLoss >= 0 ? "text-emerald-600" : "text-rose-600",
            )}
          >
            {totalGainLoss >= 0 ? "+" : "-"}
            {formatCurrency(Math.abs(totalGainLoss))}
          </div>
        </div>

        {contributionRows.length > 0 ? (
          <div className="space-y-3">
            {contributionRows.map((row) => (
              <div
                key={row.holdingId}
                className="rounded-[1.2rem] border border-slate-200/80 bg-white/85 px-4 py-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-950">{row.assetName}</div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                      {row.symbol}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-right text-base font-semibold",
                      row.gainLoss >= 0 ? "text-emerald-600" : "text-rose-600",
                    )}
                  >
                    {row.gainLoss >= 0 ? "+" : "-"}
                    {formatCurrency(Math.abs(row.gainLoss))}
                  </div>
                </div>

                <div className="mt-3 h-2 rounded-full bg-slate-200/80">
                  <div
                    className={cn(
                      "h-2 rounded-full",
                      row.gainLoss >= 0
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : "bg-gradient-to-r from-rose-500 to-pink-500",
                    )}
                    style={{ width: `${Math.min(100, row.impactSharePercentage)}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Contribution {formatPercentage(row.contributionPercentage)}
                  </span>
                  <span>{row.impactSharePercentage.toFixed(1)}% impact share</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/70 px-5 py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
              <ChartNoAxesCombined className="h-5 w-5" />
            </div>
            <div className="mt-3 text-base font-semibold text-slate-900">
              No contribution data yet
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Add holdings to see which assets are driving your portfolio outcome.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
