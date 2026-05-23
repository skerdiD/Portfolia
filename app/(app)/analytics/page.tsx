import { protectPageRequest } from "@/lib/security/arcjet";
import {
  getCurrentUserAnalyticsChartDataWithHoldings,
  getCurrentUserSettings,
} from "@/lib/db/queries";
import { AnalyticsPageClient } from "./analytics-page-client";
import { e2eMockHoldings, getE2EAnalyticsData } from "@/lib/testing/e2e-mocks";
import { defaultUserSettings } from "@/lib/settings/preferences";

export default async function AnalyticsPage() {
  if (process.env.E2E_TEST_MODE === "1") {
    const analytics = getE2EAnalyticsData();

    return (
      <AnalyticsPageClient
        holdings={e2eMockHoldings}
        summary={analytics.summary}
        allocation={analytics.allocation}
        performanceHistory={analytics.performanceHistory}
        displayCurrency={defaultUserSettings.defaultCurrency}
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
    <AnalyticsPageClient
      holdings={analytics.holdings}
      summary={analytics.summary}
      allocation={analytics.allocation}
      performanceHistory={analytics.performanceHistory}
      displayCurrency={settings.defaultCurrency}
    />
  );
}
