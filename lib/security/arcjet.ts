import "server-only";

import arcjet, {
  detectBot,
  request as arcjetRequest,
  shield,
  slidingWindow,
} from "@arcjet/next";

const arcjetKey = process.env.ARCJET_KEY;

const baseRules = [
  shield({
    mode: "LIVE",
  }),
  detectBot({
    mode: "LIVE",
    allow: [
      "CATEGORY:SEARCH_ENGINE",
      "CATEGORY:MONITOR",
      "CATEGORY:PREVIEW",
    ],
  }),
];

const mutationRules = [
  ...baseRules,
  slidingWindow({
    mode: "LIVE",
    interval: 60,
    max: 20,
  }),
];

const pageRules = [
  ...baseRules,
  slidingWindow({
    mode: "LIVE",
    interval: 60,
    max: 120,
  }),
];

const mutationProtection = arcjetKey
  ? arcjet({
      key: arcjetKey,
      rules: mutationRules,
    })
  : null;

const pageProtection = arcjetKey
  ? arcjet({
      key: arcjetKey,
      rules: pageRules,
    })
  : null;

export type ProtectionResult =
  | { allowed: true }
  | {
      allowed: false;
      status: 403 | 429;
      message: string;
    };

function mapDecisionToResult(decision: Awaited<ReturnType<NonNullable<typeof mutationProtection>["protect"]>>): ProtectionResult {
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

export async function protectMutationRequest(): Promise<ProtectionResult> {
  if (!mutationProtection) {
    return { allowed: true };
  }

  const req = await arcjetRequest();
  const decision = await mutationProtection.protect(req);
  return mapDecisionToResult(decision);
}

export async function protectPageRequest(): Promise<ProtectionResult> {
  if (!pageProtection) {
    return { allowed: true };
  }

  const req = await arcjetRequest();
  const decision = await pageProtection.protect(req);
  return mapDecisionToResult(decision);
}