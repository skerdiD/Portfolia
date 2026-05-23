import type { DisplayCurrency } from "@/lib/db/schema";

export const BASE_CURRENCY: DisplayCurrency = "USD";

// Fallback display rates relative to the canonical stored USD values.
// Last reviewed: 2026-05-23. Keep centralized so a live-rate provider can replace this map later.
export const FALLBACK_DISPLAY_EXCHANGE_RATES: Record<DisplayCurrency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
};

const currencyFormatterCache = new Map<DisplayCurrency, Intl.NumberFormat>();
const compactCurrencyFormatterCache = new Map<DisplayCurrency, Intl.NumberFormat>();

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const numberFormatterCache = new Map<number, Intl.NumberFormat>();

function toFiniteNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function convertBaseCurrencyToDisplay(
  value: number | null | undefined,
  currency: DisplayCurrency = BASE_CURRENCY,
) {
  return toFiniteNumber(value) * FALLBACK_DISPLAY_EXCHANGE_RATES[currency];
}

// Formats canonical USD portfolio values in the user's selected display currency.
// Pass raw stored/calculated money values here, not values already converted for display.
export function formatCurrency(
  value: number | null | undefined,
  currency: DisplayCurrency = BASE_CURRENCY,
) {
  const cached = currencyFormatterCache.get(currency);
  const displayValue = convertBaseCurrencyToDisplay(value, currency);

  if (cached) {
    return cached.format(displayValue);
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  currencyFormatterCache.set(currency, formatter);

  return formatter.format(displayValue);
}

export function formatCompactCurrency(
  value: number | null | undefined,
  currency: DisplayCurrency = BASE_CURRENCY,
) {
  const cached = compactCurrencyFormatterCache.get(currency);
  const displayValue = convertBaseCurrencyToDisplay(value, currency);

  if (cached) {
    return cached.format(displayValue).toLowerCase();
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  });

  compactCurrencyFormatterCache.set(currency, formatter);

  return formatter.format(displayValue).toLowerCase();
}

export function formatPercentage(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number, maximumFractionDigits = 4) {
  const cached = numberFormatterCache.get(maximumFractionDigits);

  if (cached) {
    return cached.format(value);
  }

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });

  numberFormatterCache.set(maximumFractionDigits, formatter);

  return formatter.format(value);
}

export function formatDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(`${value}T00:00:00`);
  return dateFormatter.format(date);
}
