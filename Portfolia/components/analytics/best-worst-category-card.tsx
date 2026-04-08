"use client";

import { ArrowDownRight, ArrowUpRight, Layers3 } from "lucide-react";
import type { AllocationPoint } from "@/lib/portfolio/calculations";
import { findBestAndWorstCategory } from "@/lib/portfolio/category-extremes";
import { formatCurrency, formatPercentage } from "@/lib/portfolio/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type BestWorstCategoryCardProps = {
  allocation: AllocationPoint[];
};

const categoryLabel: Record<AllocationPoint["category"], string> = {
  stock: "Stocks",
  crypto: "Crypto",
  etf: "ETFs",
  cash: "Cash",
  other: "Other",
};

function CategoryPerformanceTile({
  label,
  title,
  positive,
  returnPercentage,
  gainLoss,
}: {
  label: string;
  title: string;
  positive: boolean;
  returnPercentage: number;
  gainLoss: number;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200/80 bg-white/85 px-4 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            {title}
          </div>
          <div className="mt-2 text-xl font-semibold text-slate-950">{label}</div>
        </div>
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl",
            positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600",
          )}
        >
          {positive ? <ArrowUpRight className="h-4.5 w-4.5" /> : <ArrowDownRight className="h-4.5 w-4.5" />}
        </span>
      </div>

      <div
        className={cn(
          "mt-3 text-lg font-semibold",
          returnPercentage >= 0 ? "text-emerald-600" : "text-rose-600",
        )}
      >
        {formatPercentage(returnPercentage)}
      </div>
      <div className={cn("mt-1 text-sm", gainLoss >= 0 ? "text-emerald-600" : "text-rose-600")}>
        {gainLoss >= 0 ? "+" : "-"}
        {formatCurrency(Math.abs(gainLoss))}
      </div>
    </div>
  );
}

export function BestWorstCategoryCard({ allocation }: BestWorstCategoryCardProps) {
  const { bestCategory, worstCategory } = findBestAndWorstCategory(allocation);

  return (
    <Card className="surface rounded-[1.75rem]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          Best vs worst category
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Category-level return leaders and laggards for this filtered analytics view.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {bestCategory ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <CategoryPerformanceTile
              title="Best category"
              label={categoryLabel[bestCategory.category]}
              positive
              returnPercentage={bestCategory.returnPercentage}
              gainLoss={bestCategory.gainLoss}
            />
            {worstCategory ? (
              <CategoryPerformanceTile
                title="Worst category"
                label={categoryLabel[worstCategory.category]}
                positive={false}
                returnPercentage={worstCategory.returnPercentage}
                gainLoss={worstCategory.gainLoss}
              />
            ) : (
              <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/70 px-4 py-4 text-sm text-slate-600">
                Add holdings across more categories to reveal a worst-performing segment.
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/70 px-5 py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
              <Layers3 className="h-5 w-5" />
            </div>
            <div className="mt-3 text-base font-semibold text-slate-900">
              Category comparison unavailable
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Add categorized holdings to compare top and bottom category performance.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
