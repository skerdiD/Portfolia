import type { HoldingRecord } from "@/lib/portfolio/calculations";

function escapeCsvValue(value: string) {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

function formatDecimal(value: number, digits: number) {
  return Number.isFinite(value) ? value.toFixed(digits) : "";
}

export function buildHoldingsCsvRows(holdings: HoldingRecord[]) {
  const headers = [
    "Asset Name",
    "Ticker",
    "Category",
    "Quantity",
    "Average Buy Price",
    "Current Price",
    "Invested Amount",
    "Current Value",
    "Gain/Loss",
    "Return %",
    "Notes",
  ];

  const rows = holdings.map((holding) => [
    holding.assetName,
    holding.symbol,
    holding.category.toUpperCase(),
    formatDecimal(holding.quantity, 8),
    formatDecimal(holding.averageBuyPrice, 2),
    formatDecimal(holding.currentPrice, 2),
    formatDecimal(holding.investedAmount, 2),
    formatDecimal(holding.currentValue, 2),
    formatDecimal(holding.gainLoss, 2),
    formatDecimal(holding.returnPercentage, 2),
    holding.notes ?? "",
  ]);

  return [headers, ...rows];
}

export function toCsvContent(rows: string[][]) {
  return rows 
    .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
    .join("\n");
}
