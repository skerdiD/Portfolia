"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PerformanceHistoryPoint } from "@/lib/portfolio/calculations";
import { formatCurrency } from "@/lib/portfolio/formatters";

type PerformanceAreaChartProps = {
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

export function PerformanceAreaChart({ data }: PerformanceAreaChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70">
        <div className="text-center">
          <div className="text-base font-semibold text-slate-900">No history yet</div>
          <div className="mt-1 text-sm text-slate-500">
            Performance data will appear once portfolio history exists.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 16, right: 16, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="portfolioAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.28} />
              <stop offset="45%" stopColor="#3b82f6" stopOpacity={0.14} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.03} />
            </linearGradient>

            <linearGradient id="investedLineFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.16} />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.02} />
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
            width={84}
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
            formatter={(value, name) => {
              const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);
              const metricName = String(name ?? "");
              return [
                formatCurrency(numericValue),
                metricName === "totalValue" ? "Portfolio Value" : "Invested Capital",
              ];
            }}
            labelFormatter={(label) => formatAxisDate(String(label ?? ""))}
          />

          <Area
            type="monotone"
            dataKey="investedAmount"
            stroke="#94a3b8"
            strokeWidth={2}
            fill="url(#investedLineFill)"
            fillOpacity={1}
          />

          <Area
            type="monotone"
            dataKey="totalValue"
            stroke="#2563eb"
            strokeWidth={3}
            fill="url(#portfolioAreaFill)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
