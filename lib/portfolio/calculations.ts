import type {
  AssetCategory,
  Holding,
  PortfolioSnapshot,
} from "@/lib/db/schema";

export const CURRENCY_PRECISION = 2;
export const PRICE_PRECISION = 8;
export const QUANTITY_PRECISION = 8;
export const PERCENT_PRECISION = 2;

type NumericLike = string | number | null | undefined;

export type HoldingDerivedValues = {
  investedAmount: number;
  currentValue: number;
  gainLoss: number;
  returnPercentage: number;
};

export type HoldingRecord = {
  id: string;
  userId: string;
  assetName: string;
  symbol: string;
  category: AssetCategory;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  purchaseDate: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
} & HoldingDerivedValues;

export type PortfolioSummaryData = {
  holdingsCount: number;
  investedAmount: number;
  currentValue: number;
  gainLoss: number;
  returnPercentage: number;
};

export type AllocationPoint = {
  category: AssetCategory;
  investedAmount: number;
  currentValue: number;
  gainLoss: number;
  percentage: number;
};

export type PerformanceHistoryPoint = {
  date: string;
  investedAmount: number;
  totalValue: number;
  gainLoss: number;
  returnPercentage: number;
};

export function toNumber(value: NumericLike) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function round(value: number, precision = CURRENCY_PRECISION) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function toStoredDecimalString(value: number, precision = PRICE_PRECISION) {
  return round(value, precision).toFixed(precision);
}

export function normalizeSymbol(symbol: string) {
  return symbol.trim().toUpperCase();
}

export function normalizeOptionalText(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function calculateHoldingDerivedValues(input: {
  quantity: NumericLike;
  averageBuyPrice: NumericLike;
  currentPrice: NumericLike;
}): HoldingDerivedValues {
  const quantity = round(toNumber(input.quantity), QUANTITY_PRECISION);
  const averageBuyPrice = round(toNumber(input.averageBuyPrice), PRICE_PRECISION);
  const currentPrice = round(toNumber(input.currentPrice), PRICE_PRECISION);

  const investedAmount = round(quantity * averageBuyPrice, CURRENCY_PRECISION);
  const currentValue = round(quantity * currentPrice, CURRENCY_PRECISION);
  const gainLoss = round(currentValue - investedAmount, CURRENCY_PRECISION);

  const returnPercentage =
    investedAmount > 0
      ? round((gainLoss / investedAmount) * 100, PERCENT_PRECISION)
      : 0;

  return {
    investedAmount,
    currentValue,
    gainLoss,
    returnPercentage,
  };
}

export function mapHoldingRowToRecord(row: Holding): HoldingRecord {
  const quantity = round(toNumber(row.quantity), QUANTITY_PRECISION);
  const averageBuyPrice = round(toNumber(row.averageBuyPrice), PRICE_PRECISION);
  const currentPrice = round(toNumber(row.currentPrice), PRICE_PRECISION);

  return {
    id: row.id,
    userId: row.userId,
    assetName: row.assetName,
    symbol: row.symbol,
    category: row.category,
    quantity,
    averageBuyPrice,
    currentPrice,
    purchaseDate: row.purchaseDate,
    notes: row.notes ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    ...calculateHoldingDerivedValues({
      quantity,
      averageBuyPrice,
      currentPrice,
    }),
  };
}

export function calculatePortfolioSummary(
  holdings: HoldingRecord[],
): PortfolioSummaryData {
  const investedAmount = round(
    holdings.reduce((sum, item) => sum + item.investedAmount, 0),
    CURRENCY_PRECISION,
  );
  const currentValue = round(
    holdings.reduce((sum, item) => sum + item.currentValue, 0),
    CURRENCY_PRECISION,
  );
  const gainLoss = round(currentValue - investedAmount, CURRENCY_PRECISION);
  const returnPercentage =
    investedAmount > 0
      ? round((gainLoss / investedAmount) * 100, PERCENT_PRECISION)
      : 0;

  return {
    holdingsCount: holdings.length,
    investedAmount,
    currentValue,
    gainLoss,
    returnPercentage,
  };
}

export function calculateAllocationByCategory(
  holdings: HoldingRecord[],
): AllocationPoint[] {
  const grouped = new Map<
    AssetCategory,
    {
      investedAmount: number;
      currentValue: number;
      gainLoss: number;
    }
  >();

  for (const holding of holdings) {
    const current = grouped.get(holding.category) ?? {
      investedAmount: 0,
      currentValue: 0,
      gainLoss: 0,
    };

    current.investedAmount += holding.investedAmount;
    current.currentValue += holding.currentValue;
    current.gainLoss += holding.gainLoss;

    grouped.set(holding.category, current);
  }

  const totalCurrentValue = round(
    Array.from(grouped.values()).reduce(
      (sum, entry) => sum + entry.currentValue,
      0,
    ),
    CURRENCY_PRECISION,
  );

  return Array.from(grouped.entries())
    .map(([category, values]) => ({
      category,
      investedAmount: round(values.investedAmount, CURRENCY_PRECISION),
      currentValue: round(values.currentValue, CURRENCY_PRECISION),
      gainLoss: round(values.gainLoss, CURRENCY_PRECISION),
      percentage:
        totalCurrentValue > 0
          ? round((values.currentValue / totalCurrentValue) * 100, PERCENT_PRECISION)
          : 0,
    }))
    .sort((a, b) => b.currentValue - a.currentValue);
}

export function buildPerformanceHistoryFromSnapshots(
  snapshots: PortfolioSnapshot[],
): PerformanceHistoryPoint[] {
  return [...snapshots]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((snapshot) => {
      const investedAmount = round(
        toNumber(snapshot.investedAmount),
        CURRENCY_PRECISION,
      );
      const totalValue = round(toNumber(snapshot.totalValue), CURRENCY_PRECISION);
      const gainLoss = round(totalValue - investedAmount, CURRENCY_PRECISION);

      return {
        date: snapshot.date,
        investedAmount,
        totalValue,
        gainLoss,
        returnPercentage:
          investedAmount > 0
            ? round((gainLoss / investedAmount) * 100, PERCENT_PRECISION)
            : 0,
      };
    });
}

export function buildDerivedPerformanceHistory(
  holdings: HoldingRecord[],
): PerformanceHistoryPoint[] {
  const sortedHoldings = [...holdings].sort((a, b) =>
    a.purchaseDate.localeCompare(b.purchaseDate),
  );

  const grouped = new Map<
    string,
    {
      investedAmount: number;
      totalValue: number;
    }
  >();

  let runningInvestedAmount = 0;
  let runningTotalValue = 0;

  for (const holding of sortedHoldings) {
    runningInvestedAmount += holding.investedAmount;
    runningTotalValue += holding.currentValue;

    grouped.set(holding.purchaseDate, {
      investedAmount: runningInvestedAmount,
      totalValue: runningTotalValue,
    });
  }

  return Array.from(grouped.entries()).map(([date, values]) => {
    const investedAmount = round(values.investedAmount, CURRENCY_PRECISION);
    const totalValue = round(values.totalValue, CURRENCY_PRECISION);
    const gainLoss = round(totalValue - investedAmount, CURRENCY_PRECISION);

    return {
      date,
      investedAmount,
      totalValue,
      gainLoss,
      returnPercentage:
        investedAmount > 0
          ? round((gainLoss / investedAmount) * 100, PERCENT_PRECISION)
          : 0,
    };
  });
}

export function buildPerformanceHistory({
  snapshots,
  holdings,
}: {
  snapshots: PortfolioSnapshot[];
  holdings: HoldingRecord[];
}) {
  if (snapshots.length > 0) {
    return buildPerformanceHistoryFromSnapshots(snapshots);
  }

  return buildDerivedPerformanceHistory(holdings);
}