"use client";

import type { HoldingRecord } from "@/lib/portfolio/calculations";
import { formatCurrency, formatPercentage } from "@/lib/portfolio/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TopHoldingsCardProps = {
  holdings: HoldingRecord[];
};

export function TopHoldingsCard({ holdings }: TopHoldingsCardProps) {
  return (
    <Card className="surface motion-card rounded-[1.75rem]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          Top holdings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Largest positions by current portfolio value.
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {holdings.length > 0 ? (
          holdings.map((holding) => (
            <div
              key={holding.id}
              className="flex items-center justify-between rounded-[1.35rem] border border-slate-200/80 bg-white/85 px-4 py-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-950">{holding.assetName}</div>
                <div className="mt-1 text-sm text-muted-foreground">{holding.symbol}</div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-slate-950">
                  {formatCurrency(holding.currentValue)}
                </div>
                <div
                  className={`mt-1 text-sm font-medium ${
                    holding.gainLoss >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {formatPercentage(holding.returnPercentage)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/70 px-4 py-5 text-sm text-slate-500">
            No holdings available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
