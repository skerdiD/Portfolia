import { protectPageRequest } from "@/lib/security/arcjet";
import { getCurrentUserAnalyticsChartData, listCurrentUserHoldings } from "@/lib/db/queries";
import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";

export default async function DashboardPage() {
  const protection = await protectPageRequest();

  if (!protection.allowed) {
    throw new Error(protection.message);
  }

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