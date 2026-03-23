"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";

type AllocationPoint = {
  name: string;
  value: number;
  color: string;
};

export function AllocationChart({ data }: { data: AllocationPoint[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={78}
              outerRadius={118}
              paddingAngle={2}
              stroke="#ffffff"
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                boxShadow: "0 12px 35px -20px rgba(15, 23, 42, 0.3)",
                background: "rgba(255,255,255,0.96)",
              }}
              formatter={(value) => {
                const numericValue = typeof value === "number" ? value : Number(value ?? 0);
                return [`$${numericValue.toLocaleString()}`, "Value"];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {data.map((item) => {
          const percentage = ((item.value / total) * 100).toFixed(1);

          return (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-800">{item.name}</span>
              </div>

              <div className="text-right">
                <div className="font-semibold text-slate-950">
                  ${item.value.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
