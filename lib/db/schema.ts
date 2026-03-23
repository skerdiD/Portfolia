import { pgTable, text, timestamp, uuid, numeric } from "drizzle-orm/pg-core";

export const holdings = pgTable("holdings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  assetName: text("asset_name").notNull(),
  symbol: text("symbol").notNull(),
  category: text("category").notNull(),
  quantity: numeric("quantity", { precision: 12, scale: 4 }).notNull(),
  avgBuyPrice: numeric("avg_buy_price", { precision: 12, scale: 2 }).notNull(),
  currentPrice: numeric("current_price", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
