import { mapDecisionToResult } from "@/lib/security/protection-result";

describe("auth/protection helper logic", () => {
  it("returns allowed when decision is not denied", () => {
    const result = mapDecisionToResult({
      isDenied: () => false,
      reason: {
        isRateLimit: () => false,
      },
    });

    expect(result).toEqual({ allowed: true });
  });

  it("maps rate-limit denial to 429", () => {
    const result = mapDecisionToResult({
      isDenied: () => true,
      reason: {
        isRateLimit: () => true,
      },
    });

    expect(result).toEqual({
      allowed: false,
      status: 429,
      message: "Too many requests. Please wait a moment and try again.",
    });
  });

  it("maps non-rate-limit denial to 403", () => {
    const result = mapDecisionToResult({
      isDenied: () => true,
      reason: {
        isRateLimit: () => false,
      },
    });

    expect(result).toEqual({
      allowed: false,
      status: 403,
      message: "This request was blocked for security reasons.",
    });
  });
});
