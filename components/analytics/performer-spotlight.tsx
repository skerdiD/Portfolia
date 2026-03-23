"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { HoldingRecord } from "@/lib/portfolio/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/portfolio/formatters";

type PerformerSpotlightProps = {
  bestPerformer: HoldingRecord | null;
  worstPerformer: HoldingRecord | null;
};

function PerformerCard({
  title,
  holding,
  positive,
}: {
  title: string;
  holding: HoldingRecord | null;
  positive: boolean;
}) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200/80 bg-white/85 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{title}</div>
          {holding ? (
            <>
              <div className="mt-2 text-xl font-semibold text-slate-950">
                {holding.assetName}
              </div>
              <div className="mt-1 text-sm text-slate-500">{holding.symbol}</div>
            </>
          ) : (
            <div className="mt-2 text-base font-medium text-slate-700">
              No asset available
            </div>
          )}
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}
        >
          {positive ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
        </div>
      </div>

      {holding ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
            <div className="text-sm text-slate-500">Current Value</div>
            <div className="mt-1 font-semibold text-slate-950">
              {formatCurrency(holding.currentValue)}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
            <div className="text-sm text-slate-500">Return</div>
            <div
              className={`mt-1 font-semibold ${
                holding.returnPercentage >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {formatPercentage(holding.returnPercentage)}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50/80 px-4 py-3 sm:col-span-2">
            <div className="text-sm text-slate-500">Gain / Loss</div>
            <div
              className={`mt-1 font-semibold ${
                holding.gainLoss >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {holding.gainLoss >= 0 ? "+" : "-"}
              {formatCurrency(Math.abs(holding.gainLoss))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PerformerSpotlight({
  bestPerformer,
  worstPerformer,
}: PerformerSpotlightProps) {
  return (
    <Card className="surface rounded-[1.75rem]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-950">
          Best and worst performers
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Quick read on strongest upside and weakest return profile across filtered holdings.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <PerformerCard
          title="Best Performer"
          holding={bestPerformer}
          positive
        />
        <PerformerCard
          title="Worst Performer"
          holding={worstPerformer}
          positive={false}
        />
      </CardContent>
    </Card>
  );
}