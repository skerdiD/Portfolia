import { protectPageRequest } from "@/lib/security/arcjet";
import { getCurrentUserSettings, listCurrentUserWatchlist } from "@/lib/db/queries";
import { WatchlistPageClient } from "@/components/watchlist/watchlist-page-client";
import { e2eMockWatchlistItems } from "@/lib/testing/e2e-mocks";
import { defaultUserSettings } from "@/lib/settings/preferences";

export default async function WatchlistPage() {
  if (process.env.E2E_TEST_MODE === "1") {
    return (
      <WatchlistPageClient
        initialItems={e2eMockWatchlistItems}
        displayCurrency={defaultUserSettings.defaultCurrency}
      />
    );
  }

  const protection = await protectPageRequest();

  if (!protection.allowed) {
    throw new Error(protection.message);
  }

  const [items, settings] = await Promise.all([
    listCurrentUserWatchlist(),
    getCurrentUserSettings(),
  ]);

  return (
    <WatchlistPageClient
      initialItems={items}
      displayCurrency={settings.defaultCurrency}
    />
  );
}
