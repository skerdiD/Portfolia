import "server-only";

import { auth } from "@clerk/nextjs/server";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  holdings,
  portfolioSnapshots,
  type AssetCategory,
  type Holding,
  type PortfolioSnapshot,
} from "@/lib/db/schema";
import {
  holdingInputSchema,
  holdingUpdateSchema,
  portfolioSnapshotInputSchema,
  type HoldingInput,
  type HoldingUpdateInput,
  type PortfolioSnapshotInput,
} from "@/lib/validations/holding";

const HOLDING_VALUE_PRECISION = 2;
const HOLDING_RETURN_PRECISION = 2;
const HOLDING_QUANTITY_PRECISION = 8;
const HOLDING_PRICE_PRECISION = 8;

function round(value: number, precision = 2) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function toNumber(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function toStoredDecimal(value: number, precision = HOLDING_PRICE_PRECISION) {
  return round(value, precision).toFixed(precision);
}

function normalizeSymbol(value: string) {
  return value.trim().toUpperCase();
}

function normalizeNotes(value: string | null | undefined) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value.trim();
}

async function requireUserId() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

export type HoldingWithDerivedValues = {
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
  investedAmount: number;
  currentValue: number;
  gainLoss: number;
  returnPercentage: number;
};

export type PortfolioSummary = {
  holdingsCount: number;
  investedAmount: number;
  currentValue: number;
  gainLoss: number;
  returnPercentage: number;
};

export type AllocationSlice = {
  category: AssetCategory;
  currentValue: number;
  percentage: number;
};

export type SnapshotPoint = {
  id: string;
  userId: string;
  date: string;
  totalValue: number;
  investedAmount: number;
  createdAt: Date;
};

function toHoldingWithDerivedValues(row: Holding): HoldingWithDerivedValues {
  const quantity = toNumber(row.quantity);
  const averageBuyPrice = toNumber(row.averageBuyPrice);
  const currentPrice = toNumber(row.currentPrice);

  const investedAmount = round(
    quantity * averageBuyPrice,
    HOLDING_VALUE_PRECISION,
  );
  const currentValue = round(
    quantity * currentPrice,
    HOLDING_VALUE_PRECISION,
  );
  const gainLoss = round(currentValue - investedAmount, HOLDING_VALUE_PRECISION);
  const returnPercentage =
    investedAmount === 0
      ? 0
      : round((gainLoss / investedAmount) * 100, HOLDING_RETURN_PRECISION);

  return {
    id: row.id,
    userId: row.userId,
    assetName: row.assetName,
    symbol: row.symbol,
    category: row.category,
    quantity: round(quantity, HOLDING_QUANTITY_PRECISION),
    averageBuyPrice: round(averageBuyPrice, HOLDING_PRICE_PRECISION),
    currentPrice: round(currentPrice, HOLDING_PRICE_PRECISION),
    purchaseDate: row.purchaseDate,
    notes: row.notes ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    investedAmount,
    currentValue,
    gainLoss,
    returnPercentage,
  };
}

function toSnapshotPoint(row: PortfolioSnapshot): SnapshotPoint {
  return {
    id: row.id,
    userId: row.userId,
    date: row.date,
    totalValue: round(toNumber(row.totalValue), HOLDING_VALUE_PRECISION),
    investedAmount: round(toNumber(row.investedAmount), HOLDING_VALUE_PRECISION),
    createdAt: row.createdAt,
  };
}

export async function getHoldingsByUser(userId: string) {
  const rows = await db
    .select()
    .from(holdings)
    .where(eq(holdings.userId, userId))
    .orderBy(desc(holdings.purchaseDate), desc(holdings.createdAt));

  return rows.map(toHoldingWithDerivedValues);
}

export async function getCurrentUserHoldings() {
  const userId = await requireUserId();
  return getHoldingsByUser(userId);
}

export async function getHoldingById(userId: string, holdingId: string) {
  const [row] = await db
    .select()
    .from(holdings)
    .where(and(eq(holdings.userId, userId), eq(holdings.id, holdingId)))
    .limit(1);

  if (!row) {
    return null;
  }

  return toHoldingWithDerivedValues(row);
}

export async function getCurrentUserHoldingById(holdingId: string) {
  const userId = await requireUserId();
  return getHoldingById(userId, holdingId);
}

export async function createHoldingForUser(userId: string, input: HoldingInput) {
  const parsed = holdingInputSchema.parse(input);

  const [row] = await db
    .insert(holdings)
    .values({
      userId,
      assetName: parsed.assetName,
      symbol: normalizeSymbol(parsed.symbol),
      category: parsed.category,
      quantity: toStoredDecimal(parsed.quantity, HOLDING_QUANTITY_PRECISION),
      averageBuyPrice: toStoredDecimal(
        parsed.averageBuyPrice,
        HOLDING_PRICE_PRECISION,
      ),
      currentPrice: toStoredDecimal(parsed.currentPrice, HOLDING_PRICE_PRECISION),
      purchaseDate: parsed.purchaseDate,
      notes: normalizeNotes(parsed.notes),
    })
    .returning();

  return toHoldingWithDerivedValues(row);
}

export async function createCurrentUserHolding(input: HoldingInput) {
  const userId = await requireUserId();
  return createHoldingForUser(userId, input);
}

export async function updateHoldingForUser(
  userId: string,
  holdingId: string,
  input: HoldingUpdateInput,
) {
  const parsed = holdingUpdateSchema.parse(input);

  const updateValues: Partial<typeof holdings.$inferInsert> & {
    updatedAt: Date;
  } = {
    updatedAt: new Date(),
  };

  if (parsed.assetName !== undefined) {
    updateValues.assetName = parsed.assetName;
  }

  if (parsed.symbol !== undefined) {
    updateValues.symbol = normalizeSymbol(parsed.symbol);
  }

  if (parsed.category !== undefined) {
    updateValues.category = parsed.category;
  }

  if (parsed.quantity !== undefined) {
    updateValues.quantity = toStoredDecimal(
      parsed.quantity,
      HOLDING_QUANTITY_PRECISION,
    );
  }

  if (parsed.averageBuyPrice !== undefined) {
    updateValues.averageBuyPrice = toStoredDecimal(
      parsed.averageBuyPrice,
      HOLDING_PRICE_PRECISION,
    );
  }

  if (parsed.currentPrice !== undefined) {
    updateValues.currentPrice = toStoredDecimal(
      parsed.currentPrice,
      HOLDING_PRICE_PRECISION,
    );
  }

  if (parsed.purchaseDate !== undefined) {
    updateValues.purchaseDate = parsed.purchaseDate;
  }

  if (parsed.notes !== undefined) {
    updateValues.notes = normalizeNotes(parsed.notes);
  }

  const [row] = await db
    .update(holdings)
    .set(updateValues)
    .where(and(eq(holdings.userId, userId), eq(holdings.id, holdingId)))
    .returning();

  if (!row) {
    return null;
  }

  return toHoldingWithDerivedValues(row);
}

export async function updateCurrentUserHolding(
  holdingId: string,
  input: HoldingUpdateInput,
) {
  const userId = await requireUserId();
  return updateHoldingForUser(userId, holdingId, input);
}

export async function deleteHoldingForUser(userId: string, holdingId: string) {
  const [row] = await db
    .delete(holdings)
    .where(and(eq(holdings.userId, userId), eq(holdings.id, holdingId)))
    .returning({ id: holdings.id });

  return Boolean(row);
}

export async function deleteCurrentUserHolding(holdingId: string) {
  const userId = await requireUserId();
  return deleteHoldingForUser(userId, holdingId);
}

export async function getPortfolioSummaryByUser(
  userId: string,
): Promise<PortfolioSummary> {
  const [row] = await db
    .select({
      holdingsCount: sql<number>`count(*)::int`,
      investedAmount:
        sql<string>`coalesce(sum(${holdings.quantity} * ${holdings.averageBuyPrice}), 0)`,
      currentValue:
        sql<string>`coalesce(sum(${holdings.quantity} * ${holdings.currentPrice}), 0)`,
    })
    .from(holdings)
    .where(eq(holdings.userId, userId));

  const holdingsCount = row?.holdingsCount ?? 0;
  const investedAmount = round(
    toNumber(row?.investedAmount),
    HOLDING_VALUE_PRECISION,
  );
  const currentValue = round(
    toNumber(row?.currentValue),
    HOLDING_VALUE_PRECISION,
  );
  const gainLoss = round(currentValue - investedAmount, HOLDING_VALUE_PRECISION);
  const returnPercentage =
    investedAmount === 0
      ? 0
      : round((gainLoss / investedAmount) * 100, HOLDING_RETURN_PRECISION);

  return {
    holdingsCount,
    investedAmount,
    currentValue,
    gainLoss,
    returnPercentage,
  };
}

export async function getCurrentUserPortfolioSummary() {
  const userId = await requireUserId();
  return getPortfolioSummaryByUser(userId);
}

export async function getAllocationByUser(
  userId: string,
): Promise<AllocationSlice[]> {
  const rows = await db
    .select({
      category: holdings.category,
      currentValue:
        sql<string>`coalesce(sum(${holdings.quantity} * ${holdings.currentPrice}), 0)`,
    })
    .from(holdings)
    .where(eq(holdings.userId, userId))
    .groupBy(holdings.category)
    .orderBy(
      sql`coalesce(sum(${holdings.quantity} * ${holdings.currentPrice}), 0) desc`,
    );

  const total = rows.reduce(
    (sum, row) => sum + toNumber(row.currentValue),
    0,
  );

  return rows.map((row) => {
    const currentValue = round(
      toNumber(row.currentValue),
      HOLDING_VALUE_PRECISION,
    );

    return {
      category: row.category,
      currentValue,
      percentage:
        total === 0
          ? 0
          : round((currentValue / total) * 100, HOLDING_RETURN_PRECISION),
    };
  });
}

export async function getCurrentUserAllocation() {
  const userId = await requireUserId();
  return getAllocationByUser(userId);
}

export async function getPortfolioSnapshotsByUser(
  userId: string,
  options?: {
    limit?: number;
    fromDate?: string;
    toDate?: string;
  },
) {
  const limit = options?.limit ?? 90;

  const rows = await db
    .select()
    .from(portfolioSnapshots)
    .where(eq(portfolioSnapshots.userId, userId))
    .orderBy(asc(portfolioSnapshots.date))
    .limit(limit);

  const filtered = rows.filter((row) => {
    if (options?.fromDate && row.date < options.fromDate) {
      return false;
    }

    if (options?.toDate && row.date > options.toDate) {
      return false;
    }

    return true;
  });

  return filtered.map(toSnapshotPoint);
}

export async function getCurrentUserPortfolioSnapshots(options?: {
  limit?: number;
  fromDate?: string;
  toDate?: string;
}) {
  const userId = await requireUserId();
  return getPortfolioSnapshotsByUser(userId, options);
}

export async function upsertPortfolioSnapshotForUser(
  userId: string,
  input: PortfolioSnapshotInput,
) {
  const parsed = portfolioSnapshotInputSchema.parse(input);

  const [row] = await db
    .insert(portfolioSnapshots)
    .values({
      userId,
      date: parsed.date,
      totalValue: round(parsed.totalValue, HOLDING_VALUE_PRECISION).toFixed(
        HOLDING_VALUE_PRECISION,
      ),
      investedAmount: round(
        parsed.investedAmount,
        HOLDING_VALUE_PRECISION,
      ).toFixed(HOLDING_VALUE_PRECISION),
    })
    .onConflictDoUpdate({
      target: [portfolioSnapshots.userId, portfolioSnapshots.date],
      set: {
        totalValue: round(parsed.totalValue, HOLDING_VALUE_PRECISION).toFixed(
          HOLDING_VALUE_PRECISION,
        ),
        investedAmount: round(
          parsed.investedAmount,
          HOLDING_VALUE_PRECISION,
        ).toFixed(HOLDING_VALUE_PRECISION),
      },
    })
    .returning();

  return toSnapshotPoint(row);
}

export async function upsertCurrentUserPortfolioSnapshot(
  input: PortfolioSnapshotInput,
) {
  const userId = await requireUserId();
  return upsertPortfolioSnapshotForUser(userId, input);
}

export async function getCurrentUserDashboardData(options?: {
  snapshotLimit?: number;
  snapshotFromDate?: string;
  snapshotToDate?: string;
}) {
  const userId = await requireUserId();

  const [summary, userHoldings, allocation, snapshots] = await Promise.all([
    getPortfolioSummaryByUser(userId),
    getHoldingsByUser(userId),
    getAllocationByUser(userId),
    getPortfolioSnapshotsByUser(userId, {
      limit: options?.snapshotLimit,
      fromDate: options?.snapshotFromDate,
      toDate: options?.snapshotToDate,
    }),
  ]);

  return {
    summary,
    holdings: userHoldings,
    allocation,
    snapshots,
  };
}