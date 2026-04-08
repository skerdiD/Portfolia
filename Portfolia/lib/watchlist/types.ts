import type { AssetCategory, WatchlistItem } from "@/lib/db/schema";
import {
  PRICE_PRECISION,
  normalizeOptionalText,
  normalizeSymbol,
  round,
  toNumber,
  toStoredDecimalString,
} from "@/lib/portfolio/calculations";

type NumericLike = string | number | null | undefined;

export type WatchlistItemRecord = {
  id: string;
  userId: string;
  assetName: string;
  symbol: string;
  category: AssetCategory;
  targetPrice: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type WatchlistInput = {
  assetName: string;
  symbol: string;
  category: AssetCategory;
  targetPrice?: NumericLike;
  notes?: string | null;
};

export function toWatchlistTargetPrice(value: NumericLike) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = round(toNumber(value), PRICE_PRECISION);
  return Number.isFinite(parsed) ? parsed : null;
}

export function toWatchlistTargetPriceStorage(value: NumericLike) {
  const targetPrice = toWatchlistTargetPrice(value);
  return targetPrice === null ? null : toStoredDecimalString(targetPrice);
}

export function mapWatchlistRowToRecord(row: WatchlistItem): WatchlistItemRecord {
  return {
    id: row.id,
    userId: row.userId,
    assetName: row.assetName,
    symbol: row.symbol,
    category: row.category,
    targetPrice:
      row.targetPrice === null || row.targetPrice === undefined
        ? null
        : round(toNumber(row.targetPrice), PRICE_PRECISION),
    notes: row.notes ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function normalizeWatchlistInput(input: WatchlistInput) {
  return {
    assetName: input.assetName,
    symbol: normalizeSymbol(input.symbol),
    category: input.category,
    targetPrice: toWatchlistTargetPriceStorage(input.targetPrice),
    notes: normalizeOptionalText(input.notes),
  };
}
