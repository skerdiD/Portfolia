import type { AllocationPoint } from "@/lib/portfolio/calculations";

function round(value: number, precision = 2) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export type CategoryPerformancePoint = AllocationPoint & {
  returnPercentage: number;
};

export function toCategoryPerformancePoint(
  item: AllocationPoint,
): CategoryPerformancePoint {
  return {
    ...item,
    returnPercentage:
      item.investedAmount > 0 ? round((item.gainLoss / item.investedAmount) * 100) : 0,
  };
}

export function findBestAndWorstCategory(allocation: AllocationPoint[]) {
  if (allocation.length === 0) {
    return {
      bestCategory: null as CategoryPerformancePoint | null,
      worstCategory: null as CategoryPerformancePoint | null,
    };
  }

  const ranked = allocation
    .map(toCategoryPerformancePoint)
    .sort((a, b) => b.returnPercentage - a.returnPercentage);

  return {
    bestCategory: ranked[0],
    worstCategory: ranked.length > 1 ? ranked[ranked.length - 1] : null,
  };
}
