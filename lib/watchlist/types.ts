import type { AssetCategory, WatchlistItem } from "@/lib/db/schema";
import {
  PERCENT_PRECISION,
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
  currentPrice: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type WatchlistInput = {
  assetName: string;
  symbol: string;
  category: AssetCategory;
  targetPrice?: NumericLike;
  currentPrice?: NumericLike;
  notes?: string | null;
};

export type WatchlistTargetStatus = "unavailable" | "below" | "near" | "above";

export type WatchlistTargetInsight = {
  status: WatchlistTargetStatus;
  label: string;
  currentPrice: number | null;
  targetPrice: number | null;
  priceGap: number | null;
  gapPercentage: number | null;
  progressPercentage: number | null;
  isNearTarget: boolean;
};

export const WATCHLIST_NEAR_TARGET_THRESHOLD_PERCENT = 5;

export function toWatchlistPrice(value: NumericLike) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = round(toNumber(value), PRICE_PRECISION);
  return Number.isFinite(parsed) ? parsed : null;
}

export function toWatchlistPriceStorage(value: NumericLike) {
  const price = toWatchlistPrice(value);
  return price === null ? null : toStoredDecimalString(price);
}

export const toWatchlistTargetPrice = toWatchlistPrice;
export const toWatchlistTargetPriceStorage = toWatchlistPriceStorage;

export function calculateWatchlistTargetInsight(input: {
  currentPrice: NumericLike;
  targetPrice: NumericLike;
  nearThresholdPercentage?: number;
}): WatchlistTargetInsight {
  const currentPrice = toWatchlistPrice(input.currentPrice);
  const targetPrice = toWatchlistPrice(input.targetPrice);
  const nearThresholdPercentage =
    input.nearThresholdPercentage ?? WATCHLIST_NEAR_TARGET_THRESHOLD_PERCENT;

  if (currentPrice === null || targetPrice === null || targetPrice <= 0) {
    return {
      status: "unavailable",
      label: "Needs price data",
      currentPrice,
      targetPrice,
      priceGap: null,
      gapPercentage: null,
      progressPercentage: null,
      isNearTarget: false,
    };
  }

  const priceGap = round(currentPrice - targetPrice, PRICE_PRECISION);
  const gapPercentage = round((priceGap / targetPrice) * 100, PERCENT_PRECISION);
  const progressPercentage = round(
    Math.min(Math.max((currentPrice / targetPrice) * 100, 0), 100),
    PERCENT_PRECISION,
  );
  const isNearTarget = Math.abs(gapPercentage) <= nearThresholdPercentage;
  const status: WatchlistTargetStatus = isNearTarget
    ? "near"
    : currentPrice < targetPrice
      ? "below"
      : "above";

  return {
    status,
    label:
      status === "near"
        ? "Near target"
        : status === "below"
          ? "Below target"
          : "Above target",
    currentPrice,
    targetPrice,
    priceGap,
    gapPercentage,
    progressPercentage,
    isNearTarget,
  };
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
    currentPrice:
      row.currentPrice === null || row.currentPrice === undefined
        ? null
        : round(toNumber(row.currentPrice), PRICE_PRECISION),
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
    targetPrice: toWatchlistPriceStorage(input.targetPrice),
    currentPrice: toWatchlistPriceStorage(input.currentPrice),
    notes: normalizeOptionalText(input.notes),
  };
}
