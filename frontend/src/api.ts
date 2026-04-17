import type { Fund, Allocations, CalculationResponse, Portfolio } from './types';

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

export async function fetchPortfolios(userId: number): Promise<Portfolio[]> {
  const res = await fetch(`${API_BASE}/portfolios?userId=${userId}`);
  return res.json();
}

export async function createPortfolio(name: string, allocations: Allocations, userId: number): Promise<Portfolio> {
  const res = await fetch(`${API_BASE}/portfolios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, allocations: JSON.stringify(allocations), userId }),
  });
  return res.json();
}

export async function savePortfolio(id: number, name: string, allocations: Allocations): Promise<Portfolio> {
  const res = await fetch(`${API_BASE}/portfolios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, allocations: JSON.stringify(allocations) }),
  });
  return res.json();
}

export async function deletePortfolio(id: number): Promise<void> {
  await fetch(`${API_BASE}/portfolios/${id}`, { method: 'DELETE' });
}

export async function deleteAllPortfolios(userId: number): Promise<void> {
  const portfolios = await fetchPortfolios(userId);
  await Promise.all(portfolios.map(p => fetch(`${API_BASE}/portfolios/${p.id}`, { method: 'DELETE' })));
}
