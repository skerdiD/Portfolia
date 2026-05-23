import {
  date,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const assetCategoryEnum = pgEnum("asset_category", [
  "stock",
  "crypto",
  "etf",
  "cash",
  "other",
]);

export const displayCurrencyEnum = pgEnum("display_currency", [
  "USD",
  "EUR",
  "GBP",
]);

export const riskPreferenceEnum = pgEnum("risk_preference", [
  "conservative",
  "balanced",
  "aggressive",
]);

export const dashboardViewEnum = pgEnum("dashboard_view", [
  "standard",
  "compact",
]);

export type AssetCategory = (typeof assetCategoryEnum.enumValues)[number];
export type DisplayCurrency = (typeof displayCurrencyEnum.enumValues)[number];
export type RiskPreference = (typeof riskPreferenceEnum.enumValues)[number];
export type DashboardView = (typeof dashboardViewEnum.enumValues)[number];

export const holdings = pgTable(
  "holdings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    assetName: text("asset_name").notNull(),
    symbol: text("symbol").notNull(),
    category: assetCategoryEnum("category").notNull(),
    quantity: numeric("quantity", { precision: 20, scale: 8 }).notNull(),
    averageBuyPrice: numeric("average_buy_price", {
      precision: 20,
      scale: 8,
    }).notNull(),
    currentPrice: numeric("current_price", { precision: 20, scale: 8 }).notNull(),
    purchaseDate: date("purchase_date").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("holdings_user_id_idx").on(table.userId),
    userPurchaseCreatedIdx: index("holdings_user_purchase_created_idx").on(
      table.userId,
      table.purchaseDate,
      table.createdAt,
    ),
  }),
);

export const portfolioSnapshots = pgTable(
  "portfolio_snapshots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    date: date("date").notNull(),
    totalValue: numeric("total_value", { precision: 20, scale: 2 }).notNull(),
    investedAmount: numeric("invested_amount", {
      precision: 20,
      scale: 2,
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userDateUnique: uniqueIndex("portfolio_snapshots_user_date_unique").on(
      table.userId,
      table.date,
    ),
  }),
);

export const watchlistItems = pgTable(
  "watchlist_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    assetName: text("asset_name").notNull(),
    symbol: text("symbol").notNull(),
    category: assetCategoryEnum("category").notNull(),
    targetPrice: numeric("target_price", { precision: 20, scale: 8 }),
    currentPrice: numeric("current_price", { precision: 20, scale: 8 }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userSymbolUnique: uniqueIndex("watchlist_items_user_symbol_unique").on(
      table.userId,
      table.symbol,
    ),
    userUpdatedCreatedIdx: index("watchlist_items_user_updated_created_idx").on(
      table.userId,
      table.updatedAt,
      table.createdAt,
    ),
  }),
);

export const userSettings = pgTable(
  "user_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    portfolioName: text("portfolio_name").default("My Portfolio").notNull(),
    defaultCurrency: displayCurrencyEnum("default_currency").default("USD").notNull(),
    riskPreference: riskPreferenceEnum("risk_preference").default("balanced").notNull(),
    dashboardView: dashboardViewEnum("dashboard_view").default("standard").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdUnique: uniqueIndex("user_settings_user_id_unique").on(table.userId),
  }),
);

export type Holding = typeof holdings.$inferSelect;
export type NewHolding = typeof holdings.$inferInsert;
export type PortfolioSnapshot = typeof portfolioSnapshots.$inferSelect;
export type NewPortfolioSnapshot = typeof portfolioSnapshots.$inferInsert;
export type WatchlistItem = typeof watchlistItems.$inferSelect;
export type NewWatchlistItem = typeof watchlistItems.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;
