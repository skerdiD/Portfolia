CREATE TABLE "watchlist_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"asset_name" text NOT NULL,
	"symbol" text NOT NULL,
	"category" "asset_category" NOT NULL,
	"target_price" numeric(20, 8),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "watchlist_items_user_symbol_unique" ON "watchlist_items" USING btree ("user_id","symbol");
