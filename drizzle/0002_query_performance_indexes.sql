CREATE INDEX IF NOT EXISTS "holdings_user_id_idx"
  ON "holdings" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "holdings_user_purchase_created_idx"
  ON "holdings" USING btree ("user_id","purchase_date","created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "watchlist_items_user_updated_created_idx"
  ON "watchlist_items" USING btree ("user_id","updated_at","created_at");
