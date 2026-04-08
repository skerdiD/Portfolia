"use client";

import { useMemo } from "react";
import { Target } from "lucide-react";
import type { HoldingRecord } from "@/lib/portfolio/calculations";
import { calculateWinRateStats } from "@/lib/portfolio/win-rate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type WinRateCardProps = {
  holdings: HoldingRecord[];
};

function formatWinRate(value: number) {
  return `${value.toFixed(1)}%`;
}

function insightFromWinRate(value: number) {
  if (value >= 70) {
    return "Strong hit rate across current positions.";
  }

  if (value >= 50) {
    return "Balanced book with more winners than losers.";
  }

  return "Win rate is below 50%, review weaker positions.";
}

export function WinRateCard({ holdings }: WinRateCardProps) {
  const stats = useMemo(() => calculateWinRateStats(holdings), [holdings]);
  const hasData = stats.total > 0;

  return (
    <Card className="surface rounded-[1.75rem]">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-xl font-semibold text-slate-950">
            Win rate
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Share of holdings currently in profit.
          </p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Target className="h-4.5 w-4.5" />
        </span>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/70 px-4 py-4">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Current win rate
          </div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
            {formatWinRate(stats.winRatePercentage)}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            {stats.profitable}/{stats.total} assets profitable
          </div>
        </div>

        <div className="h-2 rounded-full bg-slate-200/80">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              stats.winRatePercentage >= 50
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : "bg-gradient-to-r from-amber-500 to-orange-500",
            )}
            style={{ width: `${Math.min(100, Math.max(0, stats.winRatePercentage))}%` }}
          />
        </div>

        {hasData ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-3">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                Profitable
              </div>
              <div className="mt-1 text-lg font-semibold text-emerald-700">
                {stats.profitable}
              </div>
            </div>

            <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 px-4 py-3">
              <div className="text-xs font-medium uppercase tracking-wide text-rose-700">
                Losing
              </div>
              <div className="mt-1 text-lg font-semibold text-rose-700">{stats.losing}</div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-100/70 px-4 py-3">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-600">
                Break-even
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-700">
                {stats.breakEven}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/70 px-4 py-4 text-sm text-slate-600">
            Add holdings to unlock win-rate insights.
          </div>
        )}

        {hasData ? <p className="text-sm text-slate-600">{insightFromWinRate(stats.winRatePercentage)}</p> : null}
      </CardContent>
    </Card>
  );
}
