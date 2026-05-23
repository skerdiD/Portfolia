CREATE TYPE "display_currency" AS ENUM ('USD', 'EUR', 'GBP');
--> statement-breakpoint
CREATE TYPE "risk_preference" AS ENUM ('conservative', 'balanced', 'aggressive');
--> statement-breakpoint
CREATE TYPE "dashboard_view" AS ENUM ('standard', 'compact');
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"portfolio_name" text DEFAULT 'My Portfolio' NOT NULL,
	"default_currency" "display_currency" DEFAULT 'USD' NOT NULL,
	"risk_preference" "risk_preference" DEFAULT 'balanced' NOT NULL,
	"dashboard_view" "dashboard_view" DEFAULT 'standard' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_settings_user_id_unique" ON "user_settings" USING btree ("user_id");
