"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { AllocationPoint } from "@/lib/portfolio/calculations";
import { formatCurrency, formatPercentage } from "@/lib/portfolio/formatters";

type AllocationDonutChartProps = {
  data: AllocationPoint[];
};

const colorMap: Record<AllocationPoint["category"], string> = {
  stock: "#2563eb",
  crypto: "#7c3aed",
  etf: "#16a34a",
  cash: "#f59e0b",
  other: "#64748b",
};

const labelMap: Record<AllocationPoint["category"], string> = {
  stock: "Stocks",
  crypto: "Crypto",
  etf: "ETFs",
  cash: "Cash",
  other: "Other",
};

export function AllocationDonutChart({ data }: AllocationDonutChartProps) {
  const totalValue = useMemo(
    () => data.reduce((sum, item) => sum + item.currentValue, 0),
    [data],
  );

  if (data.length === 0 || totalValue === 0) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70">
        <div className="text-center">
          <div className="text-base font-semibold text-slate-900">No allocation yet</div>
          <div className="mt-1 text-sm text-slate-500">
            Add holdings to see allocation distribution.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={78}
              outerRadius={112}
              paddingAngle={3}
              dataKey="currentValue"
              nameKey="category"
              stroke="#ffffff"
              strokeWidth={4}
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={colorMap[entry.category]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: 18,
                border: "1px solid #e2e8f0",
                boxShadow: "0 16px 40px -22px rgba(15, 23, 42, 0.28)",
                background: "rgba(255,255,255,0.98)",
                padding: "12px 14px",
              }}
              formatter={(value) => {
                const numericValue =
                  typeof value === "number" ? value : Number(value ?? 0);
                return [formatCurrency(numericValue), "Current Value"];
              }}
              labelFormatter={(label) => {
                const key = String(label ?? "") as AllocationPoint["category"];
                return labelMap[key] ?? String(label ?? "");
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-4">
        <div className="text-sm font-medium text-slate-500">Total allocation value</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          {formatCurrency(totalValue)}
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: colorMap[item.category] }}
              />
              <div>
                <div className="font-medium text-slate-900">{labelMap[item.category]}</div>
                <div className="text-sm text-slate-500">
                  {formatCurrency(item.currentValue)}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold text-slate-950">
                {formatPercentage(item.percentage)}
              </div>
              <div
                className={`text-sm ${
                  item.gainLoss >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {item.gainLoss >= 0 ? "+" : "-"}
                {formatCurrency(Math.abs(item.gainLoss))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
