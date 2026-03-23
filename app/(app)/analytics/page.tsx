import { getCurrentUserAnalyticsChartData, listCurrentUserHoldings } from "@/lib/db/queries";
import { AnalyticsPageClient } from "./analytics-page-client";

export default async function AnalyticsPage() {
  const [analytics, holdings] = await Promise.all([
    getCurrentUserAnalyticsChartData(),
    listCurrentUserHoldings(),
  ]);

  return (
    <AnalyticsPageClient
      holdings={holdings}
      summary={analytics.summary}
      allocation={analytics.allocation}
      performanceHistory={analytics.performanceHistory}
    />
  );
}
