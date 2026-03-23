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

function getPnlClassName(value: number) {
  if (value > 0) {
    return "text-emerald-600";
  }

  if (value < 0) {
    return "text-rose-600";
  }

  return "text-slate-700";
}

export function HoldingsTable({
  holdings,
  onHoldingUpdated,
  onHoldingDeleted,
}: HoldingsTableProps) {
  return (
    <Card className="surface overflow-hidden rounded-[1.75rem] border-white/80 p-0 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)]">
      <Table className="min-w-[1080px]">
        <TableHeader>
          <TableRow className="border-b border-slate-200/80 bg-slate-50/70">
            <TableHead className="px-5 py-3">Asset</TableHead>
            <TableHead className="px-5 py-3">Category</TableHead>
            <TableHead className="px-5 py-3 text-right">Quantity</TableHead>
            <TableHead className="px-5 py-3 text-right">Avg. Buy</TableHead>
            <TableHead className="px-5 py-3 text-right">Current</TableHead>
            <TableHead className="px-5 py-3 text-right">Invested</TableHead>
            <TableHead className="px-5 py-3 text-right">Value</TableHead>
            <TableHead className="px-5 py-3 text-right">Return</TableHead>
            <TableHead className="px-5 py-3 text-right">Purchase Date</TableHead>
            <TableHead className="px-5 py-3 text-right">Actions</TableHead>
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
                  <div className="mt-2 max-w-[280px] truncate text-xs text-slate-500">
                    {holding.notes}
                  </div>
                ) : null}
              </TableCell>
              <TableCell className="px-5 py-4 align-top text-slate-700">
                {categoryLabelMap[holding.category]}
              </TableCell>
              <TableCell className="px-5 py-4 text-right align-top text-slate-700">
                {formatNumber(holding.quantity, 8)}
              </TableCell>
              <TableCell className="px-5 py-4 text-right align-top text-slate-700">
                {formatCurrency(holding.averageBuyPrice)}
              </TableCell>
              <TableCell className="px-5 py-4 text-right align-top text-slate-700">
                {formatCurrency(holding.currentPrice)}
              </TableCell>
              <TableCell className="px-5 py-4 text-right align-top font-medium text-slate-800">
                {formatCurrency(holding.investedAmount)}
              </TableCell>
              <TableCell className="px-5 py-4 text-right align-top font-medium text-slate-900">
                {formatCurrency(holding.currentValue)}
              </TableCell>
              <TableCell className="px-5 py-4 text-right align-top">
                <div className={cn("font-semibold", getPnlClassName(holding.gainLoss))}>
                  {formatPercentage(holding.returnPercentage)}
                </div>
                <div className={cn("text-xs", getPnlClassName(holding.gainLoss))}>
                  {holding.gainLoss >= 0 ? "+" : ""}
                  {formatCurrency(holding.gainLoss)}
                </div>
              </TableCell>
              <TableCell className="px-5 py-4 text-right align-top text-slate-600">
                {formatDate(holding.purchaseDate)}
              </TableCell>
              <TableCell className="px-5 py-4 text-right align-top">
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
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "gap-2",
                        )}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
