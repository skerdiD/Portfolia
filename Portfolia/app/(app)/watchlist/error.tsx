"use client";

import { RouteErrorState } from "@/components/shared/route-error-state";

export default function WatchlistError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Watchlist could not be loaded"
      description="We hit a problem while loading your watchlist workspace. Try again to refresh your tracked assets."
      reset={reset}
    />
  );
}
