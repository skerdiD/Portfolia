import {
  ArrowUpRight,
  BadgeDollarSign,
  ChartNoAxesCombined,
  PieChart,
  Wallet2,
} from "lucide-react";
import { AllocationChart } from "@/components/dashboard/allocation-chart";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const performanceData = [
  { label: "Feb 22", value: 63900 },
  { label: "Feb 24", value: 64620 },
  { label: "Feb 26", value: 65110 },
  { label: "Feb 28", value: 65750 },
  { label: "Mar 02", value: 66410 },
  { label: "Mar 04", value: 66980 },
  { label: "Mar 06", value: 67250 },
  { label: "Mar 08", value: 68120 },
  { label: "Mar 10", value: 68650 },
  { label: "Mar 12", value: 69180 },
  { label: "Mar 14", value: 69640 },
  { label: "Mar 16", value: 70110 },
  { label: "Mar 18", value: 70620 },
  { label: "Mar 20", value: 71840 },
  { label: "Mar 23", value: 71525 },
];

const allocationData = [
  { name: "Stocks", value: 20900, color: "#2563eb" },
  { name: "Cryptocurrency", value: 40000, color: "#7c3aed" },
  { name: "ETF", value: 10625, color: "#ef4444" },
];

const movers = [
  { name: "Bitcoin", ticker: "BTC", change: "+15.56%", value: "$26,000" },
  { name: "Apple Inc.", ticker: "AAPL", change: "+16.67%", value: "$8,750" },
  { name: "Vanguard S&P 500 ETF", ticker: "VOO", change: "+9.54%", value: "$10,625" },
];

const activity = [
  { title: "Holding added", description: "Bitcoin position synced into portfolio." },
  { title: "Allocation updated", description: "Crypto weighting increased above 50%." },
  { title: "Performance milestone", description: "Portfolio crossed the $70k value mark." },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Portfolio overview"
        title="Your investment dashboard"
        description="A polished command center for portfolio value, allocation, and performance trends."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs font-medium"
            >
              Demo preview
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium"
            >
              Last 30 days
            </Badge>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Invested"
          value="$63,900.00"
          icon={Wallet2}
          tone="primary"
          detail="Capital deployed across all holdings"
        />
        <StatCard
          title="Current Value"
          value="$71,525.00"
          icon={BadgeDollarSign}
          tone="success"
          detail="Live portfolio value snapshot"
        />
        <StatCard
          title="Total P&L"
          value="$7,625.00"
          icon={ArrowUpRight}
          tone="success"
          detail="Unrealized portfolio gain"
          trend={{ label: "+11.93%", positive: true }}
        />
        <StatCard
          title="Total Return"
          value="11.93%"
          icon={ChartNoAxesCombined}
          tone="primary"
          detail="Net performance from invested capital"
          trend={{ label: "+1.24% this week", positive: true }}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <Card className="surface rounded-[1.75rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <div>
              <CardTitle className="text-2xl font-semibold text-slate-950">
                Portfolio performance
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Smooth value trend designed for a premium financial product feel.
              </p>
            </div>
            <Badge variant="outline" className="rounded-full bg-white/80 px-3 py-1">
              30D trend
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <PerformanceChart data={performanceData} />
          </CardContent>
        </Card>

        <Card className="surface rounded-[1.75rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <div>
              <CardTitle className="text-2xl font-semibold text-slate-950">
                Asset allocation
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Category split across current portfolio value.
              </p>
            </div>
            <PieChart className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent className="pt-6">
            <AllocationChart data={allocationData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="surface rounded-[1.75rem]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-950">
              Top movers
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Highest impact holdings in the current portfolio.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {movers.map((item) => (
              <div
                key={item.ticker}
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4"
              >
                <div>
                  <div className="font-medium text-slate-950">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.ticker}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-950">{item.value}</div>
                  <div className="text-sm font-medium text-emerald-600">
                    {item.change}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="surface rounded-[1.75rem]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-950">
              Recent portfolio activity
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Placeholder event stream for upcoming backend integrations.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.map((item, index) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />
                  {index !== activity.length - 1 ? (
                    <div className="mt-2 h-full w-px bg-slate-200" />
                  ) : null}
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4">
                  <div className="font-medium text-slate-950">{item.title}</div>
                  <div className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}