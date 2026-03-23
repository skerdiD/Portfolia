import { Filter, Plus, Search } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const holdings = [
  {
    asset: "Apple Inc.",
    ticker: "AAPL",
    category: "Stock",
    quantity: "50.0000",
    avgBuy: "$150.00",
    currentPrice: "$175.00",
    invested: "$7,500.00",
    currentValue: "$8,750.00",
    pnl: "+$1,250.00",
    returnPct: "+16.67%",
  },
  {
    asset: "Bitcoin",
    ticker: "BTC",
    category: "Cryptocurrency",
    quantity: "0.5000",
    avgBuy: "$45,000.00",
    currentPrice: "$52,000.00",
    invested: "$22,500.00",
    currentValue: "$26,000.00",
    pnl: "+$3,500.00",
    returnPct: "+15.56%",
  },
  {
    asset: "Vanguard S&P 500 ETF",
    ticker: "VOO",
    category: "ETF",
    quantity: "25.0000",
    avgBuy: "$387.00",
    currentPrice: "$425.00",
    invested: "$9,675.00",
    currentValue: "$10,625.00",
    pnl: "+$950.00",
    returnPct: "+9.54%",
  },
];

const categoryTone = {
  Stock:
    "border-blue-200 bg-blue-50 text-blue-700",
  Cryptocurrency:
    "border-violet-200 bg-violet-50 text-violet-700",
  ETF:
    "border-rose-200 bg-rose-50 text-rose-700",
};

export default function HoldingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Portfolio management"
        title="My holdings"
        description="Manage assets, review performance at position level, and prepare for portfolio CRUD integration."
        actions={
          <button className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
            <Plus className="h-4 w-4" />
            Add holding
          </button>
        }
      />

      <Card className="surface rounded-[1.75rem]">
        <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-2">
            <label
              htmlFor="search"
              className="text-sm font-medium text-slate-700"
            >
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="search"
                placeholder="Search by name or ticker..."
                className="pl-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Filters</label>
            <div className="flex flex-wrap gap-2">
              {["All", "Stocks", "Crypto", "ETFs", "Cash"].map((item, index) => (
                <button
                  key={item}
                  className={cn(
                    "inline-flex h-11 items-center rounded-2xl border px-4 text-sm font-medium transition",
                    index === 0
                      ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  {index === 0 ? <Filter className="mr-2 h-4 w-4" /> : null}
                  {item}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="surface overflow-hidden rounded-[1.75rem]">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-semibold text-slate-950">
            Holdings table
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Premium data table shell ready for live database-backed holdings.
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="hidden overflow-hidden rounded-[1.5rem] border border-slate-200/80 md:block">
            <div className="grid grid-cols-[1.7fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-slate-50/90 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <div>Asset</div>
              <div>Category</div>
              <div className="text-right">Quantity</div>
              <div className="text-right">Avg Buy</div>
              <div className="text-right">Current</div>
              <div className="text-right">Invested</div>
              <div className="text-right">Value</div>
              <div className="text-right">P&L</div>
              <div className="text-right">Return</div>
            </div>

            {holdings.map((item, index) => (
              <div
                key={item.ticker}
                className={cn(
                  "grid grid-cols-[1.7fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-5",
                  index !== holdings.length - 1 && "border-b border-slate-200/80",
                )}
              >
                <div>
                  <div className="font-semibold text-slate-950">{item.asset}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {item.ticker}
                  </div>
                </div>

                <div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full border px-3 py-1 font-medium",
                      categoryTone[item.category as keyof typeof categoryTone],
                    )}
                  >
                    {item.category}
                  </Badge>
                </div>

                <div className="text-right font-medium text-slate-800">
                  {item.quantity}
                </div>
                <div className="text-right font-medium text-slate-800">
                  {item.avgBuy}
                </div>
                <div className="text-right font-medium text-slate-800">
                  {item.currentPrice}
                </div>
                <div className="text-right font-medium text-slate-800">
                  {item.invested}
                </div>
                <div className="text-right font-semibold text-slate-950">
                  {item.currentValue}
                </div>
                <div className="text-right font-semibold text-emerald-600">
                  {item.pnl}
                </div>
                <div className="text-right font-semibold text-emerald-600">
                  {item.returnPct}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 md:hidden">
            {holdings.map((item) => (
              <div
                key={item.ticker}
                className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-950">{item.asset}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {item.ticker}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full border px-3 py-1 font-medium",
                      categoryTone[item.category as keyof typeof categoryTone],
                    )}
                  >
                    {item.category}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 px-3 py-3">
                    <div className="text-slate-500">Current Value</div>
                    <div className="mt-1 font-semibold text-slate-950">
                      {item.currentValue}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3">
                    <div className="text-slate-500">Return</div>
                    <div className="mt-1 font-semibold text-emerald-600">
                      {item.returnPct}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <EmptyState
        title="No watchlist or alerts configured yet"
        description="This reusable empty state is ready for later integrations like watchlists, custom notifications, or holding notes."
      />
    </div>
  );
}