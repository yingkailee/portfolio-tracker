export interface Fund {
  id: number;
  ticker: string;
  name: string;
  averageAnnualYield: number;
  description: string;
  weight: number;
}

export interface CalculationRequest {
  initialCapital: number;
  yearlySavings: number;
  timeHorizonYears: number;
  portfolioYield: number;
}

export interface CalculationResponse {
  initialCapital: number;
  yearlySavings: number;
  timeHorizonYears: number;
  portfolioYield: number;
  finalNetWorth: number;
  additionalInvestments: number;
  totalGrowth: number;
}

export type Allocations = Record<string, number>;

export interface Portfolio {
  id: number | string;
  name: string;
  allocations: string;
  user?: { id: number; name: string };
  userId?: number;
}

export interface FundPerformance {
  id: number;
  ticker: string;
  cagr5yr: number;
  cagr10yr: number;
  cagr15yr: number;
  monthlyReturns?: string;
  vol5yr: number;
  vol10yr: number;
  vol15yr: number;
  dataStartDate: string;
  dataEndDate: string;
  calculatedAt: string;
  expiresAt: string;
}
