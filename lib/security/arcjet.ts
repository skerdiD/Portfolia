import "server-only";

import arcjet, {
  detectBot,
  request as arcjetRequest,
  shield,
  slidingWindow,
} from "@arcjet/next";
import {
  mapDecisionToResult,
  type ProtectionResult,
} from "@/lib/security/protection-result";

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

export type { ProtectionResult };

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
