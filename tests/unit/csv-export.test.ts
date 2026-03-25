import { buildHoldingsCsvRows, toCsvContent } from "@/lib/portfolio/csv-export";
import { holdingFixtures } from "@/tests/unit/fixtures";

describe("holdings csv export", () => {
  it("builds a csv header and rows for holdings", () => {
    const rows = buildHoldingsCsvRows(holdingFixtures.slice(0, 1));

    expect(rows[0]).toEqual([
      "Asset Name",
      "Ticker",
      "Category",
      "Quantity",
      "Average Buy Price",
      "Current Price",
      "Invested Amount",
      "Current Value",
      "Gain/Loss",
      "Return %",
      "Notes",
    ]);
    expect(rows[1][0]).toBe("Apple Inc.");
    expect(rows[1][1]).toBe("AAPL");
    expect(rows[1][2]).toBe("STOCK");
  });

  it("escapes values for excel-friendly csv output", () => {
    const rows = [
      ["Notes"],
      ['He said "buy", then hold'],
    ];

    const csv = toCsvContent(rows);
    expect(csv).toContain("\"He said \"\"buy\"\", then hold\"");
  });
});
