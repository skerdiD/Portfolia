import {
  date,
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

export type AssetCategory = (typeof assetCategoryEnum.enumValues)[number];

export const holdings = pgTable("holdings", {
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
});

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
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userSymbolUnique: uniqueIndex("watchlist_items_user_symbol_unique").on(
      table.userId,
      table.symbol,
    ),
  }),
);

export type Holding = typeof holdings.$inferSelect;
export type NewHolding = typeof holdings.$inferInsert;
export type PortfolioSnapshot = typeof portfolioSnapshots.$inferSelect;
export type NewPortfolioSnapshot = typeof portfolioSnapshots.$inferInsert;
export type WatchlistItem = typeof watchlistItems.$inferSelect;
export type NewWatchlistItem = typeof watchlistItems.$inferInsert;
