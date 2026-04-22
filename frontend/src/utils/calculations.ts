import type { Allocations, FundPerformance } from '../types';

export type CagrPeriod = 5 | 10 | 15;

export async function calculatePortfolioYield(
  allocations: Allocations,
  cagrPeriod: CagrPeriod = 15
): Promise<number> {
  const tickers = Object.keys(allocations);
  if (tickers.length === 0) return 0;

  const performancePromises = tickers.map(async (ticker) => {
    try {
      const res = await fetch(`http://localhost:8080/api/fund-performance/${ticker}`);
      if (!res.ok) return { ticker, cagr: 0 };
      const perf: FundPerformance = await res.json();
      let cagr = 0;
      if (cagrPeriod === 5) cagr = perf.cagr5yr || 0;
      else if (cagrPeriod === 10) cagr = perf.cagr10yr || 0;
      else cagr = perf.cagr15yr || 0;
      return { ticker, cagr };
    } catch {
      return { ticker, cagr: 0 };
    }
  });

  const performances = await Promise.all(performancePromises);
  
  return performances.reduce((sum, { ticker, cagr }) => {
    const weight = allocations[ticker] || 0;
    return sum + (weight * cagr);
  }, 0);
}

export function validateAllocations(allocations: Allocations): boolean {
  const total = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  return Math.abs(total - 1) < 0.001;
}
