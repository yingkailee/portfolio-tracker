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
