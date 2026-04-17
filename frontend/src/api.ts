import type { Fund, Allocations, CalculationResponse } from './types';

const API_BASE = 'http://localhost:8080/api';

export async function fetchFunds(): Promise<Fund[]> {
  const res = await fetch(`${API_BASE}/funds`);
  return res.json();
}

export async function calculateProjection(request: {
  initialCapital: number;
  yearlySavings: number;
  timeHorizonYears: number;
  portfolioYield: number;
}): Promise<CalculationResponse> {
  const res = await fetch(`${API_BASE}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return res.json();
}

export async function calculateFromAllocation(
  initialCapital: number,
  yearlySavings: number,
  timeHorizonYears: number,
  allocations: Allocations
): Promise<CalculationResponse> {
  const params = new URLSearchParams({
    initialCapital: initialCapital.toString(),
    yearlySavings: yearlySavings.toString(),
    timeHorizonYears: timeHorizonYears.toString(),
  });

  const res = await fetch(`${API_BASE}/calculate-from-allocation?${params}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(allocations),
  });
  return res.json();
}

export function calculatePortfolioYield(funds: Fund[], allocations: Allocations): number {
  return funds.reduce((sum, fund) => {
    const weight = allocations[fund.ticker] || 0;
    return sum + (weight * fund.averageAnnualYield);
  }, 0);
}

export function validateAllocations(allocations: Allocations): boolean {
  const total = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  return Math.abs(total - 1) < 0.001;
}
