import type { Fund, Allocations, CalculationResponse, Portfolio, FundPerformance } from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

function getAuthHeader(): string {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
}

export function getUserId(): number | null {
  const id = localStorage.getItem('userId');
  return id ? parseInt(id) : null;
}

export function setUserId(id: number): void {
  localStorage.setItem('userId', id.toString());
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export async function fetchFunds(): Promise<Fund[]> {
  const res = await fetch(`${API_BASE}/funds`, {
    headers: { 'Authorization': getAuthHeader() },
  });
  return res.json();
}

export async function fetchFundPerformance(ticker: string): Promise<FundPerformance | null> {
  const res = await fetch(`${API_BASE}/fund-performance/${ticker}`, {
    headers: { 'Authorization': getAuthHeader() },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function refreshFundPerformance(ticker: string): Promise<FundPerformance | null> {
  const res = await fetch(`${API_BASE}/fund-performance/${ticker}/refresh`, {
    method: 'POST',
    headers: { 'Authorization': getAuthHeader() },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchPortfolios(userId: number): Promise<Portfolio[]> {
  const res = await fetch(`${API_BASE}/portfolios?userId=${userId}`, {
    headers: { 'Authorization': getAuthHeader() },
  });
  return res.json();
}

export async function createPortfolio(name: string, allocations: Allocations, userId: number): Promise<Portfolio> {
  const res = await fetch(`${API_BASE}/portfolios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
    body: JSON.stringify({ name, allocations: JSON.stringify(allocations), userId }),
  });
  return res.json();
}

export async function savePortfolio(id: number | string, name: string, allocations: Allocations): Promise<Portfolio> {
  const res = await fetch(`${API_BASE}/portfolios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
    body: JSON.stringify({ name, allocations: JSON.stringify(allocations) }),
  });
  return res.json();
}

export async function deletePortfolio(id: number | string): Promise<void> {
  await fetch(`${API_BASE}/portfolios/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': getAuthHeader() },
  });
}

export async function deleteAllPortfolios(userId: number): Promise<void> {
  const portfolios = await fetchPortfolios(userId);
  await Promise.all(portfolios.map(p => fetch(`${API_BASE}/portfolios/${p.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': getAuthHeader() },
  })));
}

export async function calculateProjection(request: {
  initialCapital: number;
  yearlySavings: number;
  timeHorizonYears: number;
  portfolioYield: number;
}): Promise<CalculationResponse> {
  const res = await fetch(`${API_BASE}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': getAuthHeader() },
    body: JSON.stringify(request),
  });
  return res.json();
}

export function logout() {
  localStorage.removeItem('token');
}

export const DEFAULT_ALLOCATIONS: Allocations = { VOO: 0.7, BND: 0.3 };

const GUEST_PORTFOLIOS = 'guestPortfolios';

export function getStoredPortfolios(): Portfolio[] {
  const data = localStorage.getItem(GUEST_PORTFOLIOS);
  return data ? JSON.parse(data) : [];
}

export function storePortfolio(name: string, allocations: Allocations, id?: number | string): Portfolio {
  const portfolios = getStoredPortfolios();
  if (id) {
    const idx = portfolios.findIndex(p => p.id === id || String(p.id) === id);
    if (idx >= 0) {
      portfolios[idx] = { ...portfolios[idx], name, allocations: JSON.stringify(allocations) };
      saveToLocalStorage(portfolios);
      return portfolios[idx];
    }
  }
  const newId = Math.max(0, ...portfolios.map(p => p.id as number)) + 1;
  const portfolio: Portfolio = { id: newId, name, allocations: JSON.stringify(allocations), userId: 0 };
  portfolios.push(portfolio);
  saveToLocalStorage(portfolios);
  return portfolio;
}

export function deleteStoredPortfolio(id: number): void {
  const portfolios = getStoredPortfolios().filter(p => p.id !== id);
  saveToLocalStorage(portfolios);
}

export function deleteAllStoredPortfolios(): void {
  saveToLocalStorage([]);
}

function saveToLocalStorage(portfolios: Portfolio[]): void {
  localStorage.setItem(GUEST_PORTFOLIOS, JSON.stringify(portfolios));
}

export function isGuestMode(): boolean {
  return !localStorage.getItem('token');
}