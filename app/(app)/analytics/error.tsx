"use client";

import { RouteErrorState } from "@/components/shared/route-error-state";

export default function AnalyticsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Analytics could not be loaded"
      description="We were unable to render your deeper portfolio analysis right now. Try again to reload the analytics view."
      reset={reset}
    />
  );
}