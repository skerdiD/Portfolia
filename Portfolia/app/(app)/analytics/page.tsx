import { protectPageRequest } from "@/lib/security/arcjet";
import { getCurrentUserAnalyticsChartData, listCurrentUserHoldings } from "@/lib/db/queries";
import { AnalyticsPageClient } from "./analytics-page-client";
import { e2eMockHoldings, getE2EAnalyticsData } from "@/lib/testing/e2e-mocks";

export default async function AnalyticsPage() {
  if (process.env.E2E_TEST_MODE === "1") {
    const analytics = getE2EAnalyticsData();

    return (
      <AnalyticsPageClient
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
