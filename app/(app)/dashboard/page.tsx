import { listCurrentUserHoldings, getCurrentUserAnalyticsChartData } from "@/lib/db/queries";
import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";

export default async function DashboardPage() {
  const [holdings, analytics] = await Promise.all([
    listCurrentUserHoldings(),
    getCurrentUserAnalyticsChartData(),
  ]);

  return (
    <DashboardPageClient
      holdings={holdings}
      summary={analytics.summary}
      allocation={analytics.allocation}
      performanceHistory={analytics.performanceHistory}
    />
  );
}