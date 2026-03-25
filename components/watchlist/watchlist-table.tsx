"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { AssetCategory } from "@/lib/db/schema";
import { formatCurrency, formatDate } from "@/lib/portfolio/formatters";
import type { WatchlistItemRecord } from "@/lib/watchlist/types";
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
        <Table className="min-w-[980px]">
          <TableHeader>
            <TableRow className="border-b border-slate-200/80 bg-slate-50/70">
              <TableHead className="px-5 py-3">Asset</TableHead>
              <TableHead className="px-5 py-3">Category</TableHead>
              <TableHead className="px-5 py-3 text-right">Target Price</TableHead>
              <TableHead className="px-5 py-3 text-right">Updated</TableHead>
              <TableHead className="px-5 py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-slate-200/70 bg-white/80 hover:bg-slate-50/70"
              >
                <TableCell className="px-5 py-4 align-top">
                  <div className="font-semibold text-slate-900">{item.assetName}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                    {item.symbol}
                  </div>
                  {item.notes ? (
                    <div className="mt-2 max-w-[320px] truncate text-xs text-slate-500">
                      {item.notes}
                    </div>
                  ) : null}
                </TableCell>
                <TableCell className="px-5 py-4 align-top">
                  <Badge
                    variant="outline"
                    className={cn("border", categoryBadgeStyle[item.category])}
                  >
                    {categoryLabelMap[item.category]}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 text-right align-top font-medium text-slate-800">
                  {item.targetPrice === null ? "Not set" : formatCurrency(item.targetPrice)}
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
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 p-4 xl:hidden">
        {items.map((item) => (
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

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Target Price
                </div>
                <div className="mt-1 font-semibold text-slate-950">
                  {item.targetPrice === null ? "Not set" : formatCurrency(item.targetPrice)}
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

            <div className="mt-3 text-xs text-slate-500">
              {item.notes ? item.notes : "No notes"}
            </div>

            <div className="mt-4">
              <WatchlistActions
                item={item}
                onItemUpdated={onItemUpdated}
                onItemDeleted={onItemDeleted}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
