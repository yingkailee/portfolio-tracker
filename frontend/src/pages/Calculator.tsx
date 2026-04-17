import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CalculationResponse } from '../types';
import { calculateProjection } from '../api';

export default function Calculator() {
  const [initialCapital, setInitialCapital] = useState(100000);
  const [yearlySavings, setYearlySavings] = useState(20000);
  const [timeHorizonYears, setTimeHorizonYears] = useState(20);
  const [portfolioYield, setPortfolioYield] = useState(10.5);
  const [result, setResult] = useState<CalculationResponse | null>(null);

  useEffect(() => {
    const savedYield = localStorage.getItem('portfolioYield');
    if (savedYield) {
      setPortfolioYield(parseFloat(savedYield));
    } else {
      setPortfolioYield(10.5);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        const res = await calculateProjection({
          initialCapital,
          yearlySavings,
          timeHorizonYears,
          portfolioYield,
        });
        setResult(res);
      } catch (err) {
        console.error('Calculation failed:', err);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [initialCapital, yearlySavings, timeHorizonYears, portfolioYield]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Calculator</h1>
        <Link to="/portfolio" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          ← Portfolio
        </Link>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Initial Capital: {formatCurrency(initialCapital)}
          </label>
          <input
            type="range"
            min="0"
            max="1000000"
            step="10000"
            value={initialCapital}
            onChange={(e) => setInitialCapital(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Yearly Savings: {formatCurrency(yearlySavings)}
          </label>
          <input
            type="range"
            min="0"
            max="200000"
            step="1000"
            value={yearlySavings}
            onChange={(e) => setYearlySavings(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Time Horizon: {timeHorizonYears} years
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={timeHorizonYears}
            onChange={(e) => setTimeHorizonYears(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Portfolio Yield: {portfolioYield.toFixed(2)}%
          </label>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={portfolioYield}
            onChange={(e) => setPortfolioYield(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {result && (
        <div style={{
          background: '#f3f4f6',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '20px'
        }}>
          <h2 style={{ marginBottom: '15px' }}>Results</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Final Net Worth:</span>
              <strong style={{ fontSize: '24px', color: '#16a34a' }}>
                {formatCurrency(result.finalNetWorth)}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Initial Capital:</span>
              <span>{formatCurrency(result.initialCapital)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Additional Investments:</span>
              <span>{formatCurrency(result.additionalInvestments)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2563eb' }}>
              <span>Total Growth:</span>
              <strong>{formatCurrency(result.totalGrowth)}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
