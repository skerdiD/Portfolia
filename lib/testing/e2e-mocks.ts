import type {
  AllocationPoint,
  HoldingRecord,
  PerformanceHistoryPoint,
  PortfolioSummaryData,
} from "@/lib/portfolio/calculations";
import {
  buildPerformanceHistory,
  calculateAllocationByCategory,
  calculatePortfolioSummary,
} from "@/lib/portfolio/calculations";

const baseDate = new Date("2026-01-15T12:00:00.000Z");

export const e2eMockHoldings: HoldingRecord[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    userId: "e2e-user",
    assetName: "Apple Inc.",
    symbol: "AAPL",
    category: "stock",
    quantity: 10,
    averageBuyPrice: 150,
    currentPrice: 190,
    purchaseDate: "2026-01-01",
    notes: null,
    createdAt: baseDate,
    updatedAt: baseDate,
    investedAmount: 1500,
    currentValue: 1900,
    gainLoss: 400,
    returnPercentage: 26.67,
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    userId: "e2e-user",
    assetName: "Bitcoin",
    symbol: "BTC",
    category: "crypto",
    quantity: 0.2,
    averageBuyPrice: 40000,
    currentPrice: 50000,
    purchaseDate: "2026-01-05",
    notes: null,
    createdAt: new Date("2026-01-16T12:00:00.000Z"),
    updatedAt: new Date("2026-01-17T12:00:00.000Z"),
    investedAmount: 8000,
    currentValue: 10000,
    gainLoss: 2000,
    returnPercentage: 25,
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    userId: "e2e-user",
    assetName: "Vanguard S&P 500 ETF",
    symbol: "VOO",
    category: "etf",
    quantity: 5,
    averageBuyPrice: 420,
    currentPrice: 430,
    purchaseDate: "2026-01-10",
    notes: null,
    createdAt: new Date("2026-01-18T12:00:00.000Z"),
    updatedAt: new Date("2026-01-18T12:00:00.000Z"),
    investedAmount: 2100,
    currentValue: 2150,
    gainLoss: 50,
    returnPercentage: 2.38,
  },
];

type E2EAnalyticsData = {
  summary: PortfolioSummaryData;
  allocation: AllocationPoint[];
  performanceHistory: PerformanceHistoryPoint[];
};

export function getE2EAnalyticsData(): E2EAnalyticsData {
  const summary = calculatePortfolioSummary(e2eMockHoldings);
  const allocation = calculateAllocationByCategory(e2eMockHoldings);
  const performanceHistory = buildPerformanceHistory({
    snapshots: [],
    holdings: e2eMockHoldings,
  });

  return {
    summary,
    allocation,
    performanceHistory,
  };
}
