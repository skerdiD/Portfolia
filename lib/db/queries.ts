import "server-only";

import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  holdings,
  portfolioSnapshots,
  userSettings,
  watchlistItems,
  type Holding,
  type WatchlistItem,
} from "@/lib/db/schema";
import {
  buildPerformanceHistory,
  calculateAllocationByCategory,
  calculatePortfolioSummary,
  mapHoldingRowToRecord,
  normalizeOptionalText,
  normalizeSymbol,
  toStoredDecimalString,
  type AllocationPoint,
  type HoldingRecord,
  type PerformanceHistoryPoint,
  type PortfolioSummaryData,
} from "@/lib/portfolio/calculations";
import { buildSnapshotInputFromHoldings } from "@/lib/portfolio/snapshot-sync";
import {
  mapWatchlistRowToRecord,
  normalizeWatchlistInput,
  type WatchlistItemRecord,
} from "@/lib/watchlist/types";
import {
  createHoldingSchema,
  portfolioSnapshotInputSchema,
  updateHoldingSchema,
  type CreateHoldingInput,
  type PortfolioSnapshotInput,
  type UpdateHoldingInput,
} from "@/lib/validations/holding";
import {
  createWatchlistItemSchema,
  updateWatchlistItemSchema,
  type CreateWatchlistItemInput,
  type UpdateWatchlistItemInput,
} from "@/lib/validations/watchlist";
import {
  defaultUserSettings,
  isMissingUserSettingsStorage,
  mapUserSettingsRowToRecord,
  normalizeUserSettingsInput,
  type UserSettingsInput,
  type UserSettingsRecord,
} from "@/lib/settings/preferences";

export const WATCHLIST_DUPLICATE_SYMBOL_MESSAGE =
  "This symbol already exists in your watchlist.";

async function requireAuthenticatedUserId() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

function mapHoldingRows(rows: Holding[]) {
  return rows.map(mapHoldingRowToRecord);
}

function mapWatchlistRows(rows: WatchlistItem[]) {
  return rows.map(mapWatchlistRowToRecord);
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

async function upsertPortfolioSnapshotForUserInternal(
  userId: string,
  input: PortfolioSnapshotInput,
) {
  const parsed = portfolioSnapshotInputSchema.parse(input);

  const [row] = await db
    .insert(portfolioSnapshots)
    .values({
      userId,
      date: parsed.date,
      totalValue: parsed.totalValue.toFixed(2),
      investedAmount: parsed.investedAmount.toFixed(2),
    })
    .onConflictDoUpdate({
      target: [portfolioSnapshots.userId, portfolioSnapshots.date],
      set: {
        totalValue: parsed.totalValue.toFixed(2),
        investedAmount: parsed.investedAmount.toFixed(2),
      },
    })
    .returning();

  return row;
}

async function syncPortfolioSnapshotForUserInternal(userId: string) {
  const rows = await db
    .select()
    .from(holdings)
    .where(eq(holdings.userId, userId));

  await upsertPortfolioSnapshotForUserInternal(
    userId,
    buildSnapshotInputFromHoldings(mapHoldingRows(rows)),
  );
}

export async function syncPortfolioSnapshotForUser(userId: string) {
  await syncPortfolioSnapshotForUserInternal(userId);
}

export async function syncPortfolioSnapshotForCurrentUser() {
  const userId = await requireAuthenticatedUserId();
  await syncPortfolioSnapshotForUserInternal(userId);
}

const getHoldingsByUserCached = cache(async (userId: string): Promise<HoldingRecord[]> => {
  const rows = await db
    .select()
    .from(holdings)
    .where(eq(holdings.userId, userId))
    .orderBy(desc(holdings.purchaseDate), desc(holdings.createdAt));

  return mapHoldingRows(rows);
});

export async function listHoldingsByUser(userId: string): Promise<HoldingRecord[]> {
  return getHoldingsByUserCached(userId);
}

export async function listCurrentUserHoldings() {
  const userId = await requireAuthenticatedUserId();
  return getHoldingsByUserCached(userId);
}

const getHoldingByIdForUserCached = cache(async (userId: string, holdingId: string) => {
  const [row] = await db
    .select()
    .from(holdings)
    .where(and(eq(holdings.userId, userId), eq(holdings.id, holdingId)))
    .limit(1);

  if (!row) {
    return null;
  }

  return mapHoldingRowToRecord(row);
});

export async function getHoldingByIdForUser(userId: string, holdingId: string) {
  return getHoldingByIdForUserCached(userId, holdingId);
}

export async function getCurrentUserHoldingById(holdingId: string) {
  const userId = await requireAuthenticatedUserId();
  return getHoldingByIdForUserCached(userId, holdingId);
}

export async function createHoldingForUser(
  userId: string,
  input: CreateHoldingInput,
): Promise<HoldingRecord> {
  const parsed = createHoldingSchema.parse(input);

  const [row] = await db
    .insert(holdings)
    .values({
      userId,
      assetName: parsed.assetName,
      symbol: normalizeSymbol(parsed.symbol),
      category: parsed.category,
      quantity: toStoredDecimalString(parsed.quantity),
      averageBuyPrice: toStoredDecimalString(parsed.averageBuyPrice),
      currentPrice: toStoredDecimalString(parsed.currentPrice),
      purchaseDate: parsed.purchaseDate,
      notes: normalizeOptionalText(parsed.notes),
    })
    .returning();

  await syncPortfolioSnapshotForUser(userId);

  return mapHoldingRowToRecord(row);
}

export async function createHoldingForCurrentUser(input: CreateHoldingInput) {
  const userId = await requireAuthenticatedUserId();
  return createHoldingForUser(userId, input);
}

export async function updateHoldingForUser(
  userId: string,
  holdingId: string,
  input: UpdateHoldingInput,
): Promise<HoldingRecord | null> {
  const parsed = updateHoldingSchema.parse(input);

  const updateData: Partial<typeof holdings.$inferInsert> & { updatedAt: Date } = {
    updatedAt: new Date(),
  };

  if (parsed.assetName !== undefined) {
    updateData.assetName = parsed.assetName;
  }

  if (parsed.symbol !== undefined) {
    updateData.symbol = normalizeSymbol(parsed.symbol);
  }

  if (parsed.category !== undefined) {
    updateData.category = parsed.category;
  }

  if (parsed.quantity !== undefined) {
    updateData.quantity = toStoredDecimalString(parsed.quantity);
  }

  if (parsed.averageBuyPrice !== undefined) {
    updateData.averageBuyPrice = toStoredDecimalString(parsed.averageBuyPrice);
  }

  if (parsed.currentPrice !== undefined) {
    updateData.currentPrice = toStoredDecimalString(parsed.currentPrice);
  }

  if (parsed.purchaseDate !== undefined) {
    updateData.purchaseDate = parsed.purchaseDate;
  }

  if (parsed.notes !== undefined) {
    updateData.notes = normalizeOptionalText(parsed.notes);
  }

  const [row] = await db
    .update(holdings)
    .set(updateData)
    .where(and(eq(holdings.userId, userId), eq(holdings.id, holdingId)))
    .returning();

  if (!row) {
    return null;
  }

  await syncPortfolioSnapshotForUser(userId);

  return mapHoldingRowToRecord(row);
}

export async function updateHoldingForCurrentUser(
  holdingId: string,
  input: UpdateHoldingInput,
) {
  const userId = await requireAuthenticatedUserId();
  return updateHoldingForUser(userId, holdingId, input);
}

export async function deleteHoldingForUser(userId: string, holdingId: string) {
  const [row] = await db
    .delete(holdings)
    .where(and(eq(holdings.userId, userId), eq(holdings.id, holdingId)))
    .returning({ id: holdings.id });

  if (!row) {
    return false;
  }

  await syncPortfolioSnapshotForUser(userId);

  return true;
}

export async function deleteHoldingForCurrentUser(holdingId: string) {
  const userId = await requireAuthenticatedUserId();
  return deleteHoldingForUser(userId, holdingId);
}

const getWatchlistByUserCached = cache(async (userId: string): Promise<WatchlistItemRecord[]> => {
  const rows = await db
    .select()
    .from(watchlistItems)
    .where(eq(watchlistItems.userId, userId))
    .orderBy(desc(watchlistItems.updatedAt), desc(watchlistItems.createdAt));

  return mapWatchlistRows(rows);
});

export async function listWatchlistByUser(userId: string): Promise<WatchlistItemRecord[]> {
  return getWatchlistByUserCached(userId);
}

export async function listCurrentUserWatchlist() {
  const userId = await requireAuthenticatedUserId();
  return getWatchlistByUserCached(userId);
}

const getWatchlistItemByIdForUserCached = cache(
  async (userId: string, watchlistItemId: string) => {
    const [row] = await db
      .select()
      .from(watchlistItems)
      .where(and(eq(watchlistItems.userId, userId), eq(watchlistItems.id, watchlistItemId)))
      .limit(1);

    if (!row) {
      return null;
    }

    return mapWatchlistRowToRecord(row);
  },
);

export async function getWatchlistItemByIdForUser(userId: string, watchlistItemId: string) {
  return getWatchlistItemByIdForUserCached(userId, watchlistItemId);
}

export async function getCurrentUserWatchlistItemById(watchlistItemId: string) {
  const userId = await requireAuthenticatedUserId();
  return getWatchlistItemByIdForUserCached(userId, watchlistItemId);
}

const getWatchlistItemBySymbolForUserCached = cache(
  async (userId: string, symbol: string) => {
    const [row] = await db
      .select()
      .from(watchlistItems)
      .where(and(eq(watchlistItems.userId, userId), eq(watchlistItems.symbol, symbol)))
      .limit(1);

    if (!row) {
      return null;
    }

    return mapWatchlistRowToRecord(row);
  },
);

export async function getWatchlistItemBySymbolForUser(userId: string, symbol: string) {
  return getWatchlistItemBySymbolForUserCached(userId, symbol);
}

export async function createWatchlistItemForUser(
  userId: string,
  input: CreateWatchlistItemInput,
): Promise<WatchlistItemRecord> {
  const parsed = createWatchlistItemSchema.parse(input);
  const normalized = normalizeWatchlistInput(parsed);

  const existing = await getWatchlistItemBySymbolForUserCached(userId, normalized.symbol);

  if (existing) {
    throw new Error(WATCHLIST_DUPLICATE_SYMBOL_MESSAGE);
  }

  try {
    const [row] = await db
      .insert(watchlistItems)
      .values({
        userId,
        assetName: normalized.assetName,
        symbol: normalized.symbol,
        category: normalized.category,
        targetPrice: normalized.targetPrice,
        currentPrice: normalized.currentPrice,
        notes: normalized.notes,
      })
      .returning();

    return mapWatchlistRowToRecord(row);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error(WATCHLIST_DUPLICATE_SYMBOL_MESSAGE);
    }

    throw error;
  }
}

export async function createWatchlistItemForCurrentUser(input: CreateWatchlistItemInput) {
  const userId = await requireAuthenticatedUserId();
  return createWatchlistItemForUser(userId, input);
}

export async function updateWatchlistItemForUser(
  userId: string,
  watchlistItemId: string,
  input: UpdateWatchlistItemInput,
): Promise<WatchlistItemRecord | null> {
  const parsed = updateWatchlistItemSchema.parse(input);
  const normalized = normalizeWatchlistInput({
    assetName: parsed.assetName ?? "",
    symbol: parsed.symbol ?? "",
    category: parsed.category ?? "other",
    targetPrice: parsed.targetPrice,
    currentPrice: parsed.currentPrice,
    notes: parsed.notes,
  });

  const updateData: Partial<typeof watchlistItems.$inferInsert> & { updatedAt: Date } = {
    updatedAt: new Date(),
  };

  if (parsed.assetName !== undefined) {
    updateData.assetName = normalized.assetName;
  }

  if (parsed.symbol !== undefined) {
    const existing = await getWatchlistItemBySymbolForUserCached(userId, normalized.symbol);
    if (existing && existing.id !== watchlistItemId) {
      throw new Error(WATCHLIST_DUPLICATE_SYMBOL_MESSAGE);
    }
    updateData.symbol = normalized.symbol;
  }

  if (parsed.category !== undefined) {
    updateData.category = normalized.category;
  }

  if (parsed.targetPrice !== undefined) {
    updateData.targetPrice = normalized.targetPrice;
  }

  if (parsed.currentPrice !== undefined) {
    updateData.currentPrice = normalized.currentPrice;
  }

  if (parsed.notes !== undefined) {
    updateData.notes = normalized.notes;
  }

  try {
    const [row] = await db
      .update(watchlistItems)
      .set(updateData)
      .where(and(eq(watchlistItems.userId, userId), eq(watchlistItems.id, watchlistItemId)))
      .returning();

    if (!row) {
      return null;
    }

    return mapWatchlistRowToRecord(row);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error(WATCHLIST_DUPLICATE_SYMBOL_MESSAGE);
    }

    throw error;
  }
}

export async function updateWatchlistItemForCurrentUser(
  watchlistItemId: string,
  input: UpdateWatchlistItemInput,
) {
  const userId = await requireAuthenticatedUserId();
  return updateWatchlistItemForUser(userId, watchlistItemId, input);
}

export async function deleteWatchlistItemForUser(userId: string, watchlistItemId: string) {
  const [row] = await db
    .delete(watchlistItems)
    .where(and(eq(watchlistItems.userId, userId), eq(watchlistItems.id, watchlistItemId)))
    .returning({ id: watchlistItems.id });

  return Boolean(row);
}

export async function deleteWatchlistItemForCurrentUser(watchlistItemId: string) {
  const userId = await requireAuthenticatedUserId();
  return deleteWatchlistItemForUser(userId, watchlistItemId);
}

const getUserSettingsByUserCached = cache(
  async (userId: string): Promise<UserSettingsRecord> => {
    try {
      const [row] = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, userId))
        .limit(1);

      return mapUserSettingsRowToRecord(row);
    } catch (error) {
      if (isMissingUserSettingsStorage(error)) {
        return defaultUserSettings;
      }

      throw error;
    }
  },
);

export async function getUserSettingsByUser(userId: string) {
  return getUserSettingsByUserCached(userId);
}

export async function getCurrentUserSettings() {
  const userId = await requireAuthenticatedUserId();
  return getUserSettingsByUserCached(userId);
}

export async function upsertUserSettingsForUser(
  userId: string,
  input: UserSettingsInput,
): Promise<UserSettingsRecord> {
  const normalized = normalizeUserSettingsInput(input);

  try {
    const [row] = await db
      .insert(userSettings)
      .values({
        userId,
        portfolioName: normalized.portfolioName,
        defaultCurrency: normalized.defaultCurrency,
        riskPreference: normalized.riskPreference,
        dashboardView: normalized.dashboardView,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: {
          portfolioName: normalized.portfolioName,
          defaultCurrency: normalized.defaultCurrency,
          riskPreference: normalized.riskPreference,
          dashboardView: normalized.dashboardView,
          updatedAt: new Date(),
        },
      })
      .returning();

    return mapUserSettingsRowToRecord(row);
  } catch (error) {
    if (isMissingUserSettingsStorage(error)) {
      throw new Error("Settings storage is not migrated yet. Run npm run db:migrate.");
    }

    throw error;
  }
}

export async function upsertCurrentUserSettings(input: UserSettingsInput) {
  const userId = await requireAuthenticatedUserId();
  return upsertUserSettingsForUser(userId, input);
}

export async function upsertPortfolioSnapshotForUser(
  userId: string,
  input: PortfolioSnapshotInput,
) {
  return upsertPortfolioSnapshotForUserInternal(userId, input);
}

const getPortfolioSnapshotsByUserCached = cache(
  async (
    userId: string,
    limit: number,
  ) => {
    const rows = await db
      .select()
      .from(portfolioSnapshots)
      .where(eq(portfolioSnapshots.userId, userId))
      .orderBy(asc(portfolioSnapshots.date))
      .limit(limit);

    return rows;
  },
);

export async function getPortfolioSnapshotsByUser(
  userId: string,
  options?: {
    limit?: number;
  },
) {
  return getPortfolioSnapshotsByUserCached(userId, options?.limit ?? 180);
}

export async function getCurrentUserPortfolioSnapshots(options?: {
  limit?: number;
}) {
  const userId = await requireAuthenticatedUserId();
  return getPortfolioSnapshotsByUserCached(userId, options?.limit ?? 180);
}

const getDashboardSummaryDataByUserCached = cache(
  async (
    userId: string,
  ): Promise<{
    summary: PortfolioSummaryData;
    allocation: AllocationPoint[];
  }> => {
    const userHoldings = await getHoldingsByUserCached(userId);

    return {
      summary: calculatePortfolioSummary(userHoldings),
      allocation: calculateAllocationByCategory(userHoldings),
    };
  },
);

export async function getDashboardSummaryDataByUser(userId: string) {
  return getDashboardSummaryDataByUserCached(userId);
}

export async function getCurrentUserDashboardSummaryData() {
  const userId = await requireAuthenticatedUserId();
  return getDashboardSummaryDataByUserCached(userId);
}

const getHoldingsTableDataByUserCached = cache(
  async (
    userId: string,
  ): Promise<{
    holdings: HoldingRecord[];
    summary: PortfolioSummaryData;
  }> => {
    const userHoldings = await getHoldingsByUserCached(userId);

    return {
      holdings: userHoldings,
      summary: calculatePortfolioSummary(userHoldings),
    };
  },
);

export async function getHoldingsTableDataByUser(userId: string) {
  return getHoldingsTableDataByUserCached(userId);
}

export async function getCurrentUserHoldingsTableData() {
  const userId = await requireAuthenticatedUserId();
  return getHoldingsTableDataByUserCached(userId);
}

type AnalyticsChartData = {
  summary: PortfolioSummaryData;
  allocation: AllocationPoint[];
  performanceHistory: PerformanceHistoryPoint[];
};

type AnalyticsChartDataWithHoldings = AnalyticsChartData & {
  holdings: HoldingRecord[];
};

const getAnalyticsChartDataWithHoldingsByUserCached = cache(
  async (userId: string): Promise<AnalyticsChartDataWithHoldings> => {
    const [userHoldings, snapshots] = await Promise.all([
      getHoldingsByUserCached(userId),
      getPortfolioSnapshotsByUserCached(userId, 180),
    ]);

    const summary = calculatePortfolioSummary(userHoldings);
    const allocation = calculateAllocationByCategory(userHoldings);

    return {
      holdings: userHoldings,
      summary,
      allocation,
      performanceHistory: buildPerformanceHistory({
        snapshots,
        holdings: userHoldings,
      }),
    };
  },
);

const getAnalyticsChartDataByUserCached = cache(
  async (userId: string): Promise<AnalyticsChartData> => {
    const analytics = await getAnalyticsChartDataWithHoldingsByUserCached(userId);

    return {
      summary: analytics.summary,
      allocation: analytics.allocation,
      performanceHistory: analytics.performanceHistory,
    };
  },
);

export async function getAnalyticsChartDataByUser(userId: string) {
  return getAnalyticsChartDataByUserCached(userId);
}

export async function getCurrentUserAnalyticsChartData() {
  const userId = await requireAuthenticatedUserId();
  return getAnalyticsChartDataByUserCached(userId);
}

export async function getAnalyticsChartDataWithHoldingsByUser(userId: string) {
  return getAnalyticsChartDataWithHoldingsByUserCached(userId);
}

export async function getCurrentUserAnalyticsChartDataWithHoldings() {
  const userId = await requireAuthenticatedUserId();
  return getAnalyticsChartDataWithHoldingsByUserCached(userId);
}
