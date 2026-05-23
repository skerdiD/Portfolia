import { protectPageRequest } from "@/lib/security/arcjet";
import {
  getCurrentUserHoldingsTableData,
  getCurrentUserSettings,
} from "@/lib/db/queries";
import { HoldingsPageClient } from "@/components/holdings/holdings-page-client";
import { e2eMockHoldings, getE2EAnalyticsData } from "@/lib/testing/e2e-mocks";
import { defaultUserSettings } from "@/lib/settings/preferences";

export default async function HoldingsPage() {
  if (process.env.E2E_TEST_MODE === "1") {
    const analytics = getE2EAnalyticsData();

    return (
      <HoldingsPageClient
        initialData={{
          holdings: e2eMockHoldings,
          summary: analytics.summary,
        }}
        displayCurrency={defaultUserSettings.defaultCurrency}
      />
    );
  }

  const protection = await protectPageRequest();

  if (!protection.allowed) {
    throw new Error(protection.message);
  }

  const [data, settings] = await Promise.all([
    getCurrentUserHoldingsTableData(),
    getCurrentUserSettings(),
  ]);

  return (
    <HoldingsPageClient
      initialData={data}
      displayCurrency={settings.defaultCurrency}
    />
  );
}
