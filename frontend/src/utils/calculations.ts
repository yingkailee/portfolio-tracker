import type { Allocations, FundPerformance } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export type CagrPeriod = 5 | 10 | 15;

export async function calculatePortfolioYield(
  allocations: Allocations,
  cagrPeriod: CagrPeriod = 15
): Promise<number> {
  const tickers = Object.keys(allocations);
  console.log('calculatePortfolioYield called with tickers:', tickers, 'allocations:', allocations);
  if (tickers.length === 0) return 0;

  const performances: { ticker: string; cagr: number }[] = [];

  for (const ticker of tickers) {
    try {
      console.log('Fetching:', `${API_BASE}/fund-performance/${ticker}`);
      const res = await fetch(`${API_BASE}/fund-performance/${ticker}`);
      console.log('Response:', res.status);
      if (res.ok) {
        const perf: FundPerformance = await res.json();
        console.log('Performance data:', ticker, perf);
        let cagr = 0;
        if (cagrPeriod === 5) cagr = perf.cagr5yr || 0;
        else if (cagrPeriod === 10) cagr = perf.cagr10yr || 0;
        else cagr = perf.cagr15yr || 0;
        performances.push({ ticker, cagr });
      }
    } catch (err) {
      console.error('Failed to fetch', ticker, err);
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('Performances:', performances);
  const result = performances.reduce((sum, { ticker, cagr }) => {
    const weight = allocations[ticker] || 0;
    console.log('Weight for', ticker, ':', weight, 'cagr:', cagr);
    return sum + (weight * cagr);
  }, 0);
  console.log('Final result:', result);
  return result;
}

export function validateAllocations(allocations: Allocations): boolean {
  const total = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  return Math.abs(total - 1) < 0.001;
}
