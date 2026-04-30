import type { Allocations, FundPerformance } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const fundCache = new Map<string, { data: FundPerformance; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000;

async function getFundPerformance(ticker: string): Promise<FundPerformance | null> {
  const now = Date.now();
  const cached = fundCache.get(ticker);
  if (cached && cached.expires > now) return cached.data;

  const res = await fetch(`${API_BASE}/fund-performance/${ticker}`);
  if (!res.ok) return null;
  const data: FundPerformance = await res.json();
  fundCache.set(ticker, { data, expires: now + CACHE_TTL });
  return data;
}

export type CagrPeriod = 5 | 10 | 15;

export interface PortfolioMetrics {
  cagr5: number;
  cagr10: number;
  cagr15: number;
  vol5: number;
  vol10: number;
  vol15: number;
  sharpe5: number;
  sharpe10: number;
  sharpe15: number;
}

export async function calculatePortfolioMetrics(
  allocations: Allocations,
): Promise<PortfolioMetrics> {
  const tickers = Object.keys(allocations);
  if (tickers.length === 0) {
    return { cagr5: 0, cagr10: 0, cagr15: 0, vol5: 0, vol10: 0, vol15: 0, sharpe5: 0, sharpe10: 0, sharpe15: 0 };
  }

  const perfs = await Promise.all(tickers.map(getFundPerformance));
  let cagr5 = 0, cagr10 = 0, cagr15 = 0;
  let vol5 = 0, vol10 = 0, vol15 = 0;

  tickers.forEach((ticker, i) => {
    const perf = perfs[i];
    if (!perf) return;
    const weight = allocations[ticker] || 0;
    cagr5 += weight * (perf.cagr5yr || 0);
    cagr10 += weight * (perf.cagr10yr || 0);
    cagr15 += weight * (perf.cagr15yr || 0);
    vol5 += weight * (perf.vol5yr || 0);
    vol10 += weight * (perf.vol10yr || 0);
    vol15 += weight * (perf.vol15yr || 0);
  });

  cagr5 *= 100; cagr10 *= 100; cagr15 *= 100;
  vol5 *= 100; vol10 *= 100; vol15 *= 100;

  return {
    cagr5, cagr10, cagr15, vol5, vol10, vol15,
    sharpe5: vol5 ? (cagr5 - RISK_FREE_RATE) / vol5 : 0,
    sharpe10: vol10 ? (cagr10 - RISK_FREE_RATE) / vol10 : 0,
    sharpe15: vol15 ? (cagr15 - RISK_FREE_RATE) / vol15 : 0,
  };
}

export async function calculatePortfolioYield(
  allocations: Allocations,
  cagrPeriod: CagrPeriod = 15
): Promise<number> {
  const metrics = await calculatePortfolioMetrics(allocations);
  if (cagrPeriod === 5) return metrics.cagr5;
  if (cagrPeriod === 10) return metrics.cagr10;
  return metrics.cagr15;
}

export async function calculatePortfolioVolatility(
  allocations: Allocations,
  cagrPeriod: CagrPeriod = 15
): Promise<number> {
  const metrics = await calculatePortfolioMetrics(allocations);
  if (cagrPeriod === 5) return metrics.vol5;
  if (cagrPeriod === 10) return metrics.vol10;
  return metrics.vol15;
}

export const RISK_FREE_RATE = 4;

export async function calculatePortfolioSharpe(
  allocations: Allocations,
  cagrPeriod: CagrPeriod = 15
): Promise<number> {
  const metrics = await calculatePortfolioMetrics(allocations);
  if (cagrPeriod === 5) return metrics.sharpe5;
  if (cagrPeriod === 10) return metrics.sharpe10;
  return metrics.sharpe15;
}

export function validateAllocations(allocations: Allocations): boolean {
  const total = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  return Math.abs(total - 1) < 0.001;
}