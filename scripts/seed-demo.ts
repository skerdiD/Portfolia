import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import {
  holdings,
  portfolioSnapshots,
  userSettings,
  watchlistItems,
} from "@/lib/db/schema";
import {
  DEMO_USER_PASSWORD,
  getDemoUserEmail,
} from "@/lib/auth/demo-account";
import {
  getDemoUserIdByEmail,
  updateDemoUserPassword,
} from "@/lib/auth/demo-user-lookup";

dotenv.config({ path: ".env.local" });

const demoHoldings = [
  {
    assetName: "Apple Inc.",
    symbol: "AAPL",
    category: "stock" as const,
    quantity: "18.00000000",
    averageBuyPrice: "172.45000000",
    currentPrice: "198.12000000",
    purchaseDate: "2025-08-12",
    notes: "Core technology position for demo analytics.",
  },
  {
    assetName: "Vanguard S&P 500 ETF",
    symbol: "VOO",
    category: "etf" as const,
    quantity: "14.00000000",
    averageBuyPrice: "421.30000000",
    currentPrice: "489.75000000",
    purchaseDate: "2025-05-20",
    notes: "Broad market exposure.",
  },
  {
    assetName: "Microsoft Corporation",
    symbol: "MSFT",
    category: "stock" as const,
    quantity: "9.00000000",
    averageBuyPrice: "386.80000000",
    currentPrice: "429.60000000",
    purchaseDate: "2025-10-04",
    notes: "Software and cloud allocation.",
  },
  {
    assetName: "Bitcoin",
    symbol: "BTC",
    category: "crypto" as const,
    quantity: "0.18500000",
    averageBuyPrice: "64200.00000000",
    currentPrice: "70450.00000000",
    purchaseDate: "2025-03-18",
    notes: "Small digital asset allocation.",
  },
  {
    assetName: "Cash Reserve",
    symbol: "USD",
    category: "cash" as const,
    quantity: "2500.00000000",
    averageBuyPrice: "1.00000000",
    currentPrice: "1.00000000",
    purchaseDate: "2026-01-05",
    notes: "Liquidity for future opportunities.",
  },
];

const demoWatchlistItems = [
  {
    assetName: "NVIDIA Corporation",
    symbol: "NVDA",
    category: "stock" as const,
    targetPrice: "920.00000000",
    currentPrice: "875.50000000",
    notes: "Watching for a better AI infrastructure entry.",
  },
  {
    assetName: "Ethereum",
    symbol: "ETH",
    category: "crypto" as const,
    targetPrice: "3100.00000000",
    currentPrice: "3360.00000000",
    notes: "Monitor pullbacks before adding exposure.",
  },
  {
    assetName: "iShares Core MSCI EAFE ETF",
    symbol: "IEFA",
    category: "etf" as const,
    targetPrice: "72.00000000",
    currentPrice: "74.25000000",
    notes: "International diversification candidate.",
  },
];

const demoSnapshots = [
  { date: "2026-01-01", totalValue: "23650.00", investedAmount: "22500.00" },
  { date: "2026-02-01", totalValue: "24120.00", investedAmount: "22500.00" },
  { date: "2026-03-01", totalValue: "24880.00", investedAmount: "22600.00" },
  { date: "2026-04-01", totalValue: "25690.00", investedAmount: "22600.00" },
  { date: "2026-05-01", totalValue: "27240.00", investedAmount: "22750.00" },
];

async function seedDemoData() {
  const { db } = await import("@/lib/db");
  const email = getDemoUserEmail();
  const userId = await getDemoUserIdByEmail(email);

  console.log(`Seeding demo data for ${email} (${userId})...`);
  await updateDemoUserPassword(userId, DEMO_USER_PASSWORD);
  console.log("Updated Clerk demo user password.");

  await db.delete(portfolioSnapshots).where(eq(portfolioSnapshots.userId, userId));
  await db.delete(watchlistItems).where(eq(watchlistItems.userId, userId));
  await db.delete(holdings).where(eq(holdings.userId, userId));
  await db.delete(userSettings).where(eq(userSettings.userId, userId));

  await db.insert(userSettings).values({
    userId,
    portfolioName: "Demo Growth Portfolio",
    defaultCurrency: "USD",
    riskPreference: "balanced",
    dashboardView: "standard",
  });

  await db.insert(holdings).values(
    demoHoldings.map((holding) => ({
      userId,
      ...holding,
    })),
  );

  await db.insert(watchlistItems).values(
    demoWatchlistItems.map((item) => ({
      userId,
      ...item,
    })),
  );

  await db.insert(portfolioSnapshots).values(
    demoSnapshots.map((snapshot) => ({
      userId,
      ...snapshot,
    })),
  );

  console.log(
    `Seeded ${demoHoldings.length} holdings, ${demoWatchlistItems.length} watchlist items, and ${demoSnapshots.length} snapshots.`,
  );
}

seedDemoData().catch((error) => {
  console.error(error);
  process.exit(1);
});
