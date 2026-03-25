"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  Search,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import type { AssetCategory } from "@/lib/db/schema";
import type { WatchlistItemRecord } from "@/lib/watchlist/types";
import { formatCurrency } from "@/lib/portfolio/formatters";
import { WatchlistFormDialog } from "@/components/watchlist/watchlist-form-dialog";
import { WatchlistTable } from "@/components/watchlist/watchlist-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type WatchlistPageClientProps = {
  initialItems: WatchlistItemRecord[];
};

const categoryOptions: Array<{ label: string; value: "all" | AssetCategory }> = [
  { label: "All assets", value: "all" },
  { label: "Stocks", value: "stock" },
  { label: "Crypto", value: "crypto" },
  { label: "ETFs", value: "etf" },
  { label: "Cash", value: "cash" },
  { label: "Other", value: "other" },
];

function countWithTargetPrice(items: WatchlistItemRecord[]) {
  return items.filter((item) => item.targetPrice !== null).length;
}

function averageTargetPrice(items: WatchlistItemRecord[]) {
  const withTarget = items.filter((item) => item.targetPrice !== null);
  if (withTarget.length === 0) {
    return null;
  }

  const total = withTarget.reduce((sum, item) => sum + (item.targetPrice ?? 0), 0);
  return total / withTarget.length;
}

export function WatchlistPageClient({ initialItems }: WatchlistPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | AssetCategory>("all");
  const addWatchlistTriggerRef = useRef<HTMLButtonElement | null>(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : item.assetName.toLowerCase().includes(normalizedQuery) ||
            item.symbol.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, items, query]);

  const hasFilters = query.trim().length > 0 || category !== "all";
  const hasAnyItems = items.length > 0;
  const hasFilteredResults = filteredItems.length > 0;

  useEffect(() => {
    const quickAction = searchParams.get("quickAction");

    if (quickAction !== "add") {
      return;
    }

    addWatchlistTriggerRef.current?.click();
    router.replace("/watchlist", { scroll: false });
  }, [router, searchParams]);

  const targetPriceCount = countWithTargetPrice(filteredItems);
  const targetPriceAverage = averageTargetPrice(filteredItems);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Pipeline before ownership"
        title="Watchlist"
        description="Track assets you want to monitor before turning them into holdings. Keep your pipeline focused with target prices and notes."
        actions={
          <WatchlistFormDialog
            mode="create"
            onSuccess={(watchlistItem) => {
              setItems((current) => {
                const next = [watchlistItem, ...current];
                next.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
                return next;
              });
            }}
            trigger={
              <button ref={addWatchlistTriggerRef} className={buttonVariants({ size: "lg" })}>
                Add watchlist item
              </button>
            }
          />
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Watched Assets"
          value={String(filteredItems.length)}
          icon={Eye}
          tone="primary"
          detail={hasFilters ? "Filtered watchlist view" : "Total assets being tracked"}
        />
        <StatCard
          title="Targets Defined"
          value={String(targetPriceCount)}
          icon={Target}
          tone="success"
          detail="Items with a target price set"
        />
        <StatCard
          title="Avg Target Price"
          value={targetPriceAverage !== null ? formatCurrency(targetPriceAverage) : "N/A"}
          icon={TrendingUp}
          tone="primary"
          detail="Average across target-priced items"
        />
        <StatCard
          title="Category Scope"
          value={category === "all" ? "All" : category.toUpperCase()}
          icon={Eye}
          tone="primary"
          detail="Current watchlist category focus"
        />
      </div>

      <Card className="surface rounded-[1.75rem]">
        <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-2">
            <label htmlFor="watchlist-search" className="text-sm font-medium text-slate-700">
              Search watchlist
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="watchlist-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-11"
                placeholder="Search by asset name or ticker..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700">
              <span>Categories</span>
              <span className="text-xs text-slate-500">
                {filteredItems.length} matching {filteredItems.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => {
                const isActive = category === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCategory(option.value)}
                    aria-pressed={isActive}
                    className={cn(
                      "inline-flex h-11 items-center rounded-2xl border px-4 text-sm font-medium transition",
                      isActive
                        ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}

              {hasFilters ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {!hasAnyItems ? (
        <EmptyState
          title="Your watchlist is empty"
          description="Add assets you want to monitor before purchasing. Track symbols, categories, optional target prices, and notes in one place."
          icon={<Eye className="h-6 w-6" />}
          action={
            <WatchlistFormDialog
              mode="create"
              onSuccess={(watchlistItem) => {
                setItems([watchlistItem]);
              }}
              trigger={<button className={buttonVariants({ size: "lg" })}>Add first watchlist item</button>}
            />
          }
        />
      ) : !hasFilteredResults ? (
        <EmptyState
          title="No watchlist items match your filters"
          description="Try a different symbol, asset name, or category filter to find what you are tracking."
          icon={<Search className="h-6 w-6" />}
          action={
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              Reset filters
            </Button>
          }
        />
      ) : (
        <WatchlistTable
          items={filteredItems}
          onItemUpdated={(updatedItem) => {
            setItems((current) =>
              current
                .map((item) => (item.id === updatedItem.id ? updatedItem : item))
                .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
            );
          }}
          onItemDeleted={(watchlistItemId) => {
            setItems((current) => current.filter((item) => item.id !== watchlistItemId));
          }}
        />
      )}
    </div>
  );
}
