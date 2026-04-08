"use client";

import { RouteErrorState } from "@/components/shared/route-error-state";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Something went wrong in your workspace"
      description="We could not load this protected view correctly. Try again to refresh the portfolio workspace."
      reset={reset}
    />
  );
}