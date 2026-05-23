"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { AssetCategory } from "@/lib/db/schema";
import { formatCurrency, formatDate } from "@/lib/portfolio/formatters";
import {
  calculateWatchlistTargetInsight,
  type WatchlistItemRecord,
  type WatchlistTargetInsight,
  type WatchlistTargetStatus,
} from "@/lib/watchlist/types";
import { DeleteWatchlistItemDialog } from "@/components/watchlist/delete-watchlist-item-dialog";
import { WatchlistFormDialog } from "@/components/watchlist/watchlist-form-dialog";
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

type WatchlistTableProps = {
  items: WatchlistItemRecord[];
  onItemUpdated?: (item: WatchlistItemRecord) => void;
  onItemDeleted?: (watchlistItemId: string) => void;
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

const targetStatusBadgeStyle: Record<WatchlistTargetStatus, string> = {
  unavailable: "border-slate-200 bg-slate-100 text-slate-600",
  below: "border-blue-200 bg-blue-50 text-blue-700",
  near: "border-emerald-200 bg-emerald-50 text-emerald-700",
  above: "border-amber-200 bg-amber-50 text-amber-700",
};

function formatSignedCurrency(value: number) {
  return `${value >= 0 ? "+" : "-"}${formatCurrency(Math.abs(value))}`;
}

function formatUnsignedPercentage(value: number) {
  return `${value.toFixed(2)}%`;
}

function TargetProgress({
  insight,
}: {
  insight: WatchlistTargetInsight;
}) {
  if (insight.progressPercentage === null) {
    return (
      <div className="mt-3 text-xs leading-5 text-slate-500">
        Add current and target prices to unlock progress tracking.
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn(
            "h-full rounded-full",
            insight.status === "above" ? "bg-amber-400" : "bg-blue-500",
            insight.status === "near" && "bg-emerald-500",
          )}
          style={{ width: `${insight.progressPercentage}%` }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>{formatUnsignedPercentage(insight.progressPercentage)} of target</span>
        {insight.priceGap !== null ? (
          <span>{formatSignedCurrency(insight.priceGap)} vs target</span>
        ) : null}
      </div>
    </div>
  );
}

function TargetStatusBadge({
  insight,
}: {
  insight: WatchlistTargetInsight;
}) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Badge
        variant="outline"
        className={cn("border", targetStatusBadgeStyle[insight.status])}
      >
        {insight.label}
      </Badge>
      {insight.isNearTarget ? (
        <Badge variant="outline" className="border border-emerald-200 bg-emerald-50 text-emerald-700">
          Within 5%
        </Badge>
      ) : null}
    </div>
  );
}

function WatchlistTargetSummary({
  item,
  align = "right",
}: {
  item: WatchlistItemRecord;
  align?: "left" | "right";
}) {
  const insight = calculateWatchlistTargetInsight({
    currentPrice: item.currentPrice,
    targetPrice: item.targetPrice,
  });

  return (
    <div className={cn(align === "right" ? "text-right" : "text-left")}>
      <div className="grid gap-1 text-sm">
        <div className="font-semibold text-slate-950">
          {item.currentPrice === null ? "Current N/A" : formatCurrency(item.currentPrice)}
        </div>
        <div className="text-xs text-slate-500">
          Target {item.targetPrice === null ? "not set" : formatCurrency(item.targetPrice)}
        </div>
      </div>
      <TargetProgress insight={insight} />
    </div>
  );
}

function WatchlistActions({
  item,
  onItemUpdated,
  onItemDeleted,
}: {
  item: WatchlistItemRecord;
  onItemUpdated?: (item: WatchlistItemRecord) => void;
  onItemDeleted?: (watchlistItemId: string) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <WatchlistFormDialog
        mode="edit"
        watchlistItem={item}
        onSuccess={(updatedItem) => {
          onItemUpdated?.(updatedItem);
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

      <DeleteWatchlistItemDialog
        watchlistItem={item}
        onDeleted={(watchlistItemId) => {
          onItemDeleted?.(watchlistItemId);
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
            Remove
          </button>
        }
      />
    </div>
  );
}

export function WatchlistTable({
  items,
  onItemUpdated,
  onItemDeleted,
}: WatchlistTableProps) {
  return (
    <Card className="surface overflow-hidden rounded-[1.75rem] border-white/80 p-0 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)]">
      <div className="hidden xl:block">
        <Table className="min-w-[1120px]">
          <TableHeader>
            <TableRow className="border-b border-slate-200/80 bg-slate-50/70">
              <TableHead className="px-5 py-3">Asset</TableHead>
              <TableHead className="px-5 py-3">Category</TableHead>
              <TableHead className="px-5 py-3 text-right">Price Plan</TableHead>
              <TableHead className="px-5 py-3 text-right">Status</TableHead>
              <TableHead className="px-5 py-3 text-right">Updated</TableHead>
              <TableHead className="px-5 py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const insight = calculateWatchlistTargetInsight({
                currentPrice: item.currentPrice,
                targetPrice: item.targetPrice,
              });

              return (
                <TableRow
                  key={item.id}
                  className="border-b border-slate-200/70 bg-white/80 hover:bg-slate-50/70"
                >
                  <TableCell className="px-5 py-4 align-top">
                    <div className="font-semibold text-slate-900">{item.assetName}</div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                      {item.symbol}
                    </div>
                    <div className="mt-3 max-w-[340px] rounded-2xl bg-slate-50/80 px-3 py-2 text-xs leading-5 text-slate-600">
                      {item.notes ? item.notes : "No watch reason added yet."}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 align-top">
                    <Badge
                      variant="outline"
                      className={cn("border", categoryBadgeStyle[item.category])}
                    >
                      {categoryLabelMap[item.category]}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[270px] px-5 py-4 align-top">
                    <WatchlistTargetSummary item={item} />
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right align-top">
                    <TargetStatusBadge insight={insight} />
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right align-top text-slate-600">
                    {formatDate(item.updatedAt)}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-right align-top">
                    <WatchlistActions
                      item={item}
                      onItemUpdated={onItemUpdated}
                      onItemDeleted={onItemDeleted}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 p-4 xl:hidden">
        {items.map((item) => {
          const insight = calculateWatchlistTargetInsight({
            currentPrice: item.currentPrice,
            targetPrice: item.targetPrice,
          });

          return (
            <div
              key={item.id}
              className="rounded-[1.35rem] border border-slate-200/80 bg-white/90 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-slate-950">{item.assetName}</div>
                  <div className="mt-1 text-sm text-slate-500">{item.symbol}</div>
                </div>
                <Badge
                  variant="outline"
                  className={cn("border", categoryBadgeStyle[item.category])}
                >
                  {categoryLabelMap[item.category]}
                </Badge>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50/80 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Price Plan
                  </div>
                  <TargetStatusBadge insight={insight} />
                </div>
                <div className="mt-3">
                  <WatchlistTargetSummary item={item} align="left" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Watch Reason
                  </div>
                  <div className="mt-1 text-sm leading-5 text-slate-600">
                    {item.notes ? item.notes : "No watch reason added yet."}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Updated
                  </div>
                  <div className="mt-1 font-semibold text-slate-950">
                    {formatDate(item.updatedAt)}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <WatchlistActions
                  item={item}
                  onItemUpdated={onItemUpdated}
                  onItemDeleted={onItemDeleted}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
