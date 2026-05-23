import { protectPageRequest } from "@/lib/security/arcjet";
import {
  getCurrentUserAnalyticsChartDataWithHoldings,
  getCurrentUserSettings,
} from "@/lib/db/queries";
import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";
import { e2eMockHoldings, getE2EAnalyticsData } from "@/lib/testing/e2e-mocks";
import { defaultUserSettings } from "@/lib/settings/preferences";

export default async function DashboardPage() {
  if (process.env.E2E_TEST_MODE === "1") {
    const analytics = getE2EAnalyticsData();

    return (
      <DashboardPageClient
        holdings={e2eMockHoldings}
        summary={analytics.summary}
        allocation={analytics.allocation}
        performanceHistory={analytics.performanceHistory}
        settings={defaultUserSettings}
      />
    );
  }

  const protection = await protectPageRequest();

  if (!protection.allowed) {
    throw new Error(protection.message);
  }

  const [analytics, settings] = await Promise.all([
    getCurrentUserAnalyticsChartDataWithHoldings(),
    getCurrentUserSettings(),
  ]);

  return (
    <DashboardPageClient
      holdings={analytics.holdings}
      summary={analytics.summary}
      allocation={analytics.allocation}
      performanceHistory={analytics.performanceHistory}
      settings={settings}
    />
  );
}
