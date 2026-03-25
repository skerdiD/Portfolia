import { protectPageRequest } from "@/lib/security/arcjet";
import { listCurrentUserWatchlist } from "@/lib/db/queries";
import { WatchlistPageClient } from "@/components/watchlist/watchlist-page-client";
import { e2eMockWatchlistItems } from "@/lib/testing/e2e-mocks";

export default async function WatchlistPage() {
  if (process.env.E2E_TEST_MODE === "1") {
    return <WatchlistPageClient initialItems={e2eMockWatchlistItems} />;
  }

  const protection = await protectPageRequest();

  if (!protection.allowed) {
    throw new Error(protection.message);
  }

  const items = await listCurrentUserWatchlist();

  return <WatchlistPageClient initialItems={items} />;
}
