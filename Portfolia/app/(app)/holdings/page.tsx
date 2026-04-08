import { protectPageRequest } from "@/lib/security/arcjet";
import { getCurrentUserHoldingsTableData } from "@/lib/db/queries";
import { HoldingsPageClient } from "@/components/holdings/holdings-page-client";
import { e2eMockHoldings, getE2EAnalyticsData } from "@/lib/testing/e2e-mocks";

export default async function HoldingsPage() {
  if (process.env.E2E_TEST_MODE === "1") {
    const analytics = getE2EAnalyticsData();

    return (
      <HoldingsPageClient
        initialData={{
          holdings: e2eMockHoldings,
          summary: analytics.summary,
        }}
      />
    );
  }

  const protection = await protectPageRequest();

  if (!protection.allowed) {
    throw new Error(protection.message);
  }

  const data = await getCurrentUserHoldingsTableData();

  return <HoldingsPageClient initialData={data} />;
}
