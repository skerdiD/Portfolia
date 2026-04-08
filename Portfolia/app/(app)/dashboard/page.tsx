import { protectPageRequest } from "@/lib/security/arcjet";
import { getCurrentUserAnalyticsChartData, listCurrentUserHoldings } from "@/lib/db/queries";
import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";
import { e2eMockHoldings, getE2EAnalyticsData } from "@/lib/testing/e2e-mocks";

export default async function DashboardPage() {
  if (process.env.E2E_TEST_MODE === "1") {
    const analytics = getE2EAnalyticsData();

    return (
      <DashboardPageClient
        holdings={e2eMockHoldings}
        summary={analytics.summary}
        allocation={analytics.allocation}
        performanceHistory={analytics.performanceHistory}
      />
    );
  }

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
