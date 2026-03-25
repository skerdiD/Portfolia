"use client";

import Link from "next/link";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PerformanceHistoryPoint } from "@/lib/portfolio/calculations";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/portfolio/formatters";
import { cn } from "@/lib/utils";

type AdvancedPerformanceChartProps = {
  data: PerformanceHistoryPoint[];
};

const axisDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

function formatAxisDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  return axisDateFormatter.format(date);
}

export function AdvancedPerformanceChart({
  data,
}: AdvancedPerformanceChartProps) {
  const hasInsufficientHistory = data.length > 0 && data.length < 2;

  return (
    <Card className="surface rounded-[1.75rem]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-slate-950">
          Advanced performance view
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Portfolio value and invested capital plotted together for better trend visibility.
        </p>
      </CardHeader>

      <CardContent>
        {data.length > 0 && !hasInsufficientHistory ? (
          <>
            <div className="mb-5 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Latest Value
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-950">
                  {formatCurrency(data[data.length - 1].totalValue)}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Latest Return
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-950">
                  {formatPercentage(data[data.length - 1].returnPercentage)}
                </div>
              </div>
            </div>

            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsAreaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.24} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    stroke="#e2e8f0"
                    strokeDasharray="4 5"
                  />

                  <XAxis
                    dataKey="date"
                    tickFormatter={formatAxisDate}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={24}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={82}
                    tickFormatter={(value) => `$${Math.round(Number(value ?? 0) / 1000)}k`}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />

                  <Tooltip
                    cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
                    contentStyle={{
                      borderRadius: 18,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 16px 40px -22px rgba(15, 23, 42, 0.28)",
                      background: "rgba(255,255,255,0.98)",
                      padding: "12px 14px",
                    }}
                    labelFormatter={(label) => formatAxisDate(String(label ?? ""))}
                    formatter={(value, name) => {
                      const numericValue =
                        typeof value === "number" ? value : Number(value ?? 0);
                      const metricName = String(name ?? "");

                      if (metricName === "gainLoss") {
                        return [formatCurrency(numericValue), "Gain / Loss"];
                      }

                      if (metricName === "investedAmount") {
                        return [formatCurrency(numericValue), "Invested Capital"];
                      }

                      return [formatCurrency(numericValue), "Portfolio Value"];
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="totalValue"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#analyticsAreaFill)"
                  />

                  <Line
                    type="monotone"
                    dataKey="investedAmount"
                    stroke="#94a3b8"
                    strokeWidth={2.25}
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="gainLoss"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : hasInsufficientHistory ? (
          <div className="flex h-[380px] flex-col items-center justify-center rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 px-6 text-center">
            <div className="text-base font-semibold text-slate-900">
              More history needed for trend analysis
            </div>
            <div className="mt-1 max-w-md text-sm text-slate-500">
              We found one portfolio snapshot in this scope. Add more holdings or let
              additional snapshots accumulate to unlock meaningful trend lines.
            </div>
            <Link
              href="/holdings"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
            >
              Add more holdings
            </Link>
          </div>
        ) : (
          <div className="flex h-[380px] items-center justify-center rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70">
            <div className="text-center">
              <div className="text-base font-semibold text-slate-900">
                No analytics history yet
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Historical performance will appear as portfolio data accumulates.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
