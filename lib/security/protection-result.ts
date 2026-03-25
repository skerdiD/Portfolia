export type ProtectionResult =
  | { allowed: true }
  | {
      allowed: false;
      status: 403 | 429;
      message: string;
    };

export type ArcjetDecisionLike = {
  isDenied: () => boolean;
  reason: {
    isRateLimit: () => boolean;
  };
};

export function mapDecisionToResult(decision: ArcjetDecisionLike): ProtectionResult {
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return {
        allowed: false,
        status: 429,
        message: "Too many requests. Please wait a moment and try again.",
      };
    }

    return {
      allowed: false,
      status: 403,
      message: "This request was blocked for security reasons.",
    };
  }

  return { allowed: true };
}
