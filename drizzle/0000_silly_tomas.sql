CREATE TABLE "holdings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"asset_name" text NOT NULL,
	"symbol" text NOT NULL,
	"category" text NOT NULL,
	"quantity" numeric(12, 4) NOT NULL,
	"avg_buy_price" numeric(12, 2) NOT NULL,
	"current_price" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
