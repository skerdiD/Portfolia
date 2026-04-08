import type { AssetCategory } from "@/lib/db/schema";
import type { HoldingRecord } from "@/lib/portfolio/calculations";

export type HoldingFilterCategory = "all" | AssetCategory;

export function filterHoldingsByQueryAndCategory({
  holdings,
  query,
  category,
}: {
  holdings: HoldingRecord[];
  query: string;
  category: HoldingFilterCategory;
}) {
  const normalizedQuery = query.trim().toLowerCase();

  return holdings.filter((holding) => {
    const matchesCategory = category === "all" || holding.category === category;
    const matchesQuery =
      normalizedQuery.length === 0
        ? true
        : holding.assetName.toLowerCase().includes(normalizedQuery) ||
          holding.symbol.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}

export function sortHoldingsByCurrentValueDesc(holdings: HoldingRecord[]) {
  return [...holdings].sort((a, b) => b.currentValue - a.currentValue);
}

export function paginateItems<T>(items: T[], page: number, pageSize: number) {
  const safePage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  const safePageSize = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 10;
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const normalizedPage = Math.min(safePage, totalPages);
  const startIndex = (normalizedPage - 1) * safePageSize;

  return {
    items: items.slice(startIndex, startIndex + safePageSize),
    page: normalizedPage,
    pageSize: safePageSize,
    totalItems,
    totalPages,
  };
}
