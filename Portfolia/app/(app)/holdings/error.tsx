"use client";

import { RouteErrorState } from "@/components/shared/route-error-state";

export default function HoldingsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Holdings data could not be loaded"
      description="We hit a problem while loading your holdings workspace. Try again to refresh your portfolio positions."
      reset={reset}
    />
  );
}