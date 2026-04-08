"use client";

import { Layers3 } from "lucide-react";
import type { AllocationPoint } from "@/lib/portfolio/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/portfolio/formatters";
import { cn } from "@/lib/utils";

type CategoryAnalysisCardsProps = {
  allocation: AllocationPoint[];
};

const categoryLabels: Record<AllocationPoint["category"], string> = {
  stock: "Stocks",
  crypto: "Crypto",
  etf: "ETFs",
  cash: "Cash",
  other: "Other",
};

const accentStyles: Record<AllocationPoint["category"], string> = {
  stock: "bg-blue-50 text-blue-700 border-blue-200",
  crypto: "bg-violet-50 text-violet-700 border-violet-200",
  etf: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cash: "bg-amber-50 text-amber-700 border-amber-200",
  other: "bg-slate-100 text-slate-700 border-slate-200",
};

export function CategoryAnalysisCards({
  allocation,
}: CategoryAnalysisCardsProps) {
  return (
    <Card className="surface rounded-[1.75rem]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-slate-950">
          Category analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Deeper allocation breakdown with exposure, value concentration, and current impact.
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {allocation.length > 0 ? (
          allocation.map((item) => (
            <div
              key={item.category}
              className="rounded-[1.35rem] border border-slate-200/80 bg-white/85 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className={cn(
                      "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                      accentStyles[item.category],
                    )}
                  >
                    {categoryLabels[item.category]}
                  </div>
                  <div className="mt-3 text-lg font-semibold text-slate-950">
                    {formatCurrency(item.currentValue)}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    Current category value
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-slate-500">Allocation</div>
                  <div className="mt-1 text-lg font-semibold text-slate-950">
                    {formatPercentage(item.percentage)}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                  <div className="text-sm text-slate-500">Invested Amount</div>
                  <div className="mt-1 font-semibold text-slate-950">
                    {formatCurrency(item.investedAmount)}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                  <div className="text-sm text-slate-500">Gain / Loss</div>
                  <div
                    className={cn(
                      "mt-1 font-semibold",
                      item.gainLoss >= 0 ? "text-emerald-600" : "text-rose-600",
                    )}
                  >
                    {item.gainLoss >= 0 ? "+" : "-"}
                    {formatCurrency(Math.abs(item.gainLoss))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/70 px-5 py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
              <Layers3 className="h-5 w-5" />
            </div>
            <div className="mt-3 text-base font-semibold text-slate-900">
              Category breakdown unavailable
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Add assets across categories to reveal allocation concentration and impact.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
