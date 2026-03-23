"use client";

import { RouteErrorState } from "@/components/shared/route-error-state";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Dashboard analytics could not be loaded"
      description="Your portfolio summary or charts failed to render correctly. Try again to reload the dashboard."
      reset={reset}
    />
  );
}