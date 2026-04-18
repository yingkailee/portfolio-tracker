import type { Fund, Allocations, CalculationResponse, Portfolio } from './types';

const API_BASE = 'http://localhost:8080/api';

export async function fetchFunds(): Promise<Fund[]> {
  const res = await fetch(`${API_BASE}/funds`);
  return res.json();
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
