import type { CalculationResponse } from '../types';

const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

interface ResultsDisplayProps {
  result: CalculationResponse;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <div className="alert-result">
      <h2 className="section-header">Results</h2>
      <div className="result-row">
        <span>Initial Capital:</span>
        <span>{fmt(result.initialCapital)}</span>
      </div>
      <div className="result-row">
        <span>Additional Investments:</span>
        <span>{fmt(result.additionalInvestments)}</span>
      </div>
      <div className="result-row-lg">
        <span>Total Growth:</span>
        <span style={{ color: '#2563eb' }}>{fmt(result.totalGrowth)}</span>
      </div>
      <div className="result-total">
        <span className="result-label">Final Net Worth: </span>
        <strong style={{ color: '#16a34a', fontSize: '24px' }}>{fmt(result.finalNetWorth)}</strong>
      </div>
    </div>
  );
}