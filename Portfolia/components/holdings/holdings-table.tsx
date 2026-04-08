"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { AssetCategory } from "@/lib/db/schema";
import type { HoldingRecord } from "@/lib/portfolio/calculations";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercentage,
} from "@/lib/portfolio/formatters";
import { DeleteHoldingDialog } from "@/components/holdings/delete-holding-dialog";
import { HoldingFormDialog } from "@/components/holdings/holding-form-dialog";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type HoldingsTableProps = {
  holdings: HoldingRecord[];
  onHoldingUpdated?: (holding: HoldingRecord) => void;
  onHoldingDeleted?: (holdingId: string) => void;
};

const categoryLabelMap: Record<AssetCategory, string> = {
  stock: "Stock",
  crypto: "Crypto",
  etf: "ETF",
  cash: "Cash",
  other: "Other",
};

const categoryBadgeStyle: Record<AssetCategory, string> = {
  stock: "border-blue-200 bg-blue-50 text-blue-700",
  crypto: "border-violet-200 bg-violet-50 text-violet-700",
  etf: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cash: "border-amber-200 bg-amber-50 text-amber-700",
  other: "border-slate-200 bg-slate-100 text-slate-700",
};

function getPnlClassName(value: number) {
  if (value > 0) {
    return "text-emerald-600";
  }

  if (value < 0) {
    return "text-rose-600";
  }

  return "text-slate-700";
}

function HoldingsActions({
  holding,
  onHoldingUpdated,
  onHoldingDeleted,
}: {
  holding: HoldingRecord;
  onHoldingUpdated?: (holding: HoldingRecord) => void;
  onHoldingDeleted?: (holdingId: string) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <HoldingFormDialog
        mode="edit"
        holding={holding}
        onSuccess={(updatedHolding) => {
          onHoldingUpdated?.(updatedHolding);
        }}
        trigger={
          <button
            type="button"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        }
      />

      <DeleteHoldingDialog
        holding={holding}
        onDeleted={(holdingId) => {
          onHoldingDeleted?.(holdingId);
        }}
        trigger={
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-2 border-rose-200 text-rose-600 hover:bg-rose-50",
            )}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        }
      />
    </div>
  );
}

export function HoldingsTable({
  holdings,
  onHoldingUpdated,
  onHoldingDeleted,
}: HoldingsTableProps) {
  return (
    <Card className="surface overflow-hidden rounded-[1.75rem] border-white/80 p-0 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)]">
      <div className="hidden xl:block">
        <Table className="min-w-[960px]">
          <TableHeader>
            <TableRow className="border-b border-slate-200/80 bg-slate-50/70">
              <TableHead className="w-[23rem] px-5 py-3">Asset</TableHead>
              <TableHead className="w-[12rem] px-4 py-3">Position</TableHead>
              <TableHead className="w-[12rem] px-4 py-3 text-right">Pricing</TableHead>
              <TableHead className="w-[13rem] px-4 py-3 text-right">Capital</TableHead>
              <TableHead className="w-[10rem] px-4 py-3 text-right">Return</TableHead>
              <TableHead className="w-[10rem] px-4 py-3 text-right">Purchased</TableHead>
              <TableHead className="w-[12rem] px-5 py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow
                key={holding.id}
                className="border-b border-slate-200/70 bg-white/80 hover:bg-slate-50/70"
              >
                <TableCell className="px-5 py-4 align-top">
                  <div className="font-semibold text-slate-900">{holding.assetName}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                    {holding.symbol}
                  </div>
                  {holding.notes ? (
                    <div className="mt-2 max-w-[320px] truncate text-xs text-slate-500">
                      {holding.notes}
                    </div>
                  ) : null}
                </TableCell>
                <TableCell className="px-4 py-4 align-top">
                  <Badge variant="outline" className={cn("border", categoryBadgeStyle[holding.category])}>
                    {categoryLabelMap[holding.category]}
                  </Badge>
                  <div className="mt-2 text-sm font-medium text-slate-800">
                    {formatNumber(holding.quantity, 8)}
                  </div>
                  <div className="text-xs text-slate-500">Units</div>
                </TableCell>
                <TableCell className="px-4 py-4 text-right align-top">
                  <div className="text-sm font-semibold text-slate-900">
                    {formatCurrency(holding.currentPrice)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Avg {formatCurrency(holding.averageBuyPrice)}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 text-right align-top">
                  <div className="text-sm font-semibold text-slate-900">
                    {formatCurrency(holding.currentValue)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Invested {formatCurrency(holding.investedAmount)}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 text-right align-top">
                  <div className={cn("font-semibold", getPnlClassName(holding.gainLoss))}>
                    {formatPercentage(holding.returnPercentage)}
                  </div>
                  <div className={cn("mt-1 text-xs", getPnlClassName(holding.gainLoss))}>
                    {holding.gainLoss >= 0 ? "+" : ""}
                    {formatCurrency(holding.gainLoss)}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 text-right align-top text-sm text-slate-600">
                  {formatDate(holding.purchaseDate)}
                </TableCell>
                <TableCell className="px-5 py-4 text-right align-top">
                  <HoldingsActions
                    holding={holding}
                    onHoldingUpdated={onHoldingUpdated}
                    onHoldingDeleted={onHoldingDeleted}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 p-4 xl:hidden">
        {holdings.map((holding) => (
          <div
            key={holding.id}
            className="rounded-[1.35rem] border border-slate-200/80 bg-white/90 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-semibold text-slate-950">{holding.assetName}</div>
                <div className="mt-1 text-sm text-slate-500">{holding.symbol}</div>
              </div>
              <Badge
                variant="outline"
                className={cn("border", categoryBadgeStyle[holding.category])}
              >
                {categoryLabelMap[holding.category]}
              </Badge>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Quantity
                </div>
                <div className="mt-1 font-semibold text-slate-950">
                  {formatNumber(holding.quantity, 8)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Current Value
                </div>
                <div className="mt-1 font-semibold text-slate-950">
                  {formatCurrency(holding.currentValue)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Invested
                </div>
                <div className="mt-1 font-semibold text-slate-950">
                  {formatCurrency(holding.investedAmount)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Return
                </div>
                <div className={cn("mt-1 font-semibold", getPnlClassName(holding.gainLoss))}>
                  {formatPercentage(holding.returnPercentage)}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Purchased {formatDate(holding.purchaseDate)}</span>
              {holding.notes ? (
                <span className="max-w-[50%] truncate">{holding.notes}</span>
              ) : (
                <span>No notes</span>
              )}
            </div>

            <div className="mt-4">
              <HoldingsActions
                holding={holding}
                onHoldingUpdated={onHoldingUpdated}
                onHoldingDeleted={onHoldingDeleted}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
