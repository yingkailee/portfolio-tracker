import type { Allocations, FundPerformance } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export type CagrPeriod = 5 | 10 | 15;

export async function calculatePortfolioYield(
  allocations: Allocations,
  cagrPeriod: CagrPeriod = 15
): Promise<number> {
  const tickers = Object.keys(allocations);
  if (tickers.length === 0) return 0;

  const performances: { ticker: string; cagr: number }[] = [];

  for (const ticker of tickers) {
    try {
      const res = await fetch(`${API_BASE}/fund-performance/${ticker}`);
      if (res.ok) {
        const perf: FundPerformance = await res.json();
        let cagr = 0;
        if (cagrPeriod === 5) cagr = perf.cagr5yr || 0;
        else if (cagrPeriod === 10) cagr = perf.cagr10yr || 0;
        else cagr = perf.cagr15yr || 0;
        performances.push({ ticker, cagr });
      }
    } catch {
      // skip failed ticker
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return performances.reduce((sum, { ticker, cagr }) => {
    const weight = allocations[ticker] || 0;
    return sum + (weight * cagr);
  }, 0) * 100;
}

export async function calculatePortfolioVolatility(
  allocations: Allocations,
  cagrPeriod: CagrPeriod = 15
): Promise<number> {
  const tickers = Object.keys(allocations);
  if (tickers.length === 0) return 0;

  const performances: { ticker: string; vol: number }[] = [];

  for (const ticker of tickers) {
    try {
      const res = await fetch(`${API_BASE}/fund-performance/${ticker}`);
      if (res.ok) {
        const perf: FundPerformance = await res.json();
        let vol = 0;
        if (cagrPeriod === 5) vol = perf.vol5yr || 0;
        else if (cagrPeriod === 10) vol = perf.vol10yr || 0;
        else vol = perf.vol15yr || 0;
        performances.push({ ticker, vol });
      }
    } catch {
      // skip failed ticker
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return performances.reduce((sum, { ticker, vol }) => {
    const weight = allocations[ticker] || 0;
    return sum + (weight * vol);
  }, 0) * 100;
}

export function validateAllocations(allocations: Allocations): boolean {
  const total = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  return Math.abs(total - 1) < 0.001;
}
