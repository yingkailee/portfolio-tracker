import type { Fund, Allocations } from '../types';

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