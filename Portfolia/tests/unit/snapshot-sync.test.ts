import { describe, expect, it } from "vitest";
import { holdingFixtures } from "./fixtures";
import {
  buildSnapshotInputFromHoldings,
  getSnapshotDate,
} from "@/lib/portfolio/snapshot-sync";

describe("snapshot sync helpers", () => {
  it("formats snapshot date in ISO day format", () => {
    expect(getSnapshotDate(new Date("2026-03-25T18:44:12.000Z"))).toBe("2026-03-25");
  });

  it("builds snapshot input totals from holdings", () => {
    expect(buildSnapshotInputFromHoldings(holdingFixtures, "2026-03-25")).toEqual({
      date: "2026-03-25",
      totalValue: 6560,
      investedAmount: 6800,
    });
  });

  it("builds zero-value snapshot input for empty holdings", () => {
    expect(buildSnapshotInputFromHoldings([], "2026-03-25")).toEqual({
      date: "2026-03-25",
      totalValue: 0,
      investedAmount: 0,
    });
  });
});
