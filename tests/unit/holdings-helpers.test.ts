import {
  filterHoldingsByQueryAndCategory,
  paginateItems,
  sortHoldingsByCurrentValueDesc,
} from "@/lib/portfolio/holdings-helpers";
import { holdingFixtures } from "@/tests/unit/fixtures";

describe("holdings filtering, sorting, pagination helpers", () => {
  it("filters by query and category", () => {
    const filtered = filterHoldingsByQueryAndCategory({
      holdings: holdingFixtures,
      query: "bit",
      category: "crypto",
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].symbol).toBe("BTC");
  });

  it("sorts holdings by current value descending", () => {
    const sorted = sortHoldingsByCurrentValueDesc(holdingFixtures);
    expect(sorted.map((item) => item.symbol)).toEqual(["BTC", "AAPL", "VOO"]);
  });

  it("paginates generic items", () => {
    const page = paginateItems([1, 2, 3, 4, 5], 2, 2);
    expect(page).toEqual({
      items: [3, 4],
      page: 2,
      pageSize: 2,
      totalItems: 5,
      totalPages: 3,
    });
  });
});
