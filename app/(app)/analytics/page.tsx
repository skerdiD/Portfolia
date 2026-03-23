import {
  Activity,
  CandlestickChart,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const analyticsData = [
  { month: "Jan", value: 52200, invested: 50000, pnl: 2200 },
  { month: "Feb", value: 54780, invested: 51600, pnl: 3180 },
  { month: "Mar", value: 57120, invested: 53300, pnl: 3820 },
  { month: "Apr", value: 59650, invested: 55100, pnl: 4550 },
  { month: "May", value: 61540, invested: 56900, pnl: 4640 },
  { month: "Jun", value: 64120, invested: 59100, pnl: 5020 },
  { month: "Jul", value: 66340, invested: 61200, pnl: 5140 },
  { month: "Aug", value: 68210, invested: 62400, pnl: 5810 },
  { month: "Sep", value: 69980, invested: 63850, pnl: 6130 },
  { month: "Oct", value: 71525, invested: 63900, pnl: 7625 },
];

const insights = [
  "Cryptocurrency remains the largest concentration in the portfolio.",
  "Total portfolio value is trending upward above invested capital.",
  "Current gain profile suggests strongest momentum came from BTC and AAPL.",
];

const allocationBreakdown = [
  { label: "Crypto Exposure", value: "55.9%" },
  { label: "Stock Exposure", value: "29.2%" },
  { label: "ETF Exposure", value: "14.9%" },
  { label: "Cash Reserve", value: "0.0%" },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Portfolio analytics"
        title="Analytics and insights"
        description="A more detailed analytics surface for performance trends, allocation context, and portfolio signals."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {["1M", "3M", "6M", "YTD", "1Y"].map((label, index) => (
              <Badge
                key={label}
                variant={index === 1 ? "secondary" : "outline"}
                className="rounded-full px-3 py-1"
              >
                {label}
              </Badge>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Best Performer"
          value="+16.67%"
          icon={TrendingUp}
          tone="success"
          detail="Apple Inc. leads the current return profile"
        />
        <StatCard
          title="Largest Position"
          value="55.9%"
          icon={CandlestickChart}
          tone="primary"
          detail="Crypto remains the dominant portfolio weight"
        />
        <StatCard
          title="Monthly Net P&L"
          value="$7,625"
          icon={CircleDollarSign}
          tone="success"
          detail="Current month unrealized gain snapshot"
        />
        <StatCard
          title="Risk Surface"
          value="Moderate"
          icon={Activity}
          tone="primary"
          detail="Placeholder for future analytics scoring"
        />
      </div>

      <Card className="surface rounded-[1.75rem]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-slate-950">
            Performance vs invested capital
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Visual foundation for future portfolio-level financial analytics.
          </p>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={analyticsData} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="surface rounded-[1.75rem]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-950">
              Allocation breakdown
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Current exposure by portfolio bucket.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {allocationBreakdown.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4"
              >
                <span className="font-medium text-slate-800">{item.label}</span>
                <span className="font-semibold text-slate-950">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="surface rounded-[1.75rem]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-950">
              Portfolio insights
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Placeholder insight layer for future business logic and AI-powered analysis.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4"
              >
                <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                  {index + 1}
                </div>
                <p className="leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}