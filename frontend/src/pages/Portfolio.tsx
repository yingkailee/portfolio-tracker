import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Fund, Allocations } from '../types';
import { fetchFunds, calculatePortfolioYield, validateAllocations } from '../api';

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2'];

export default function Portfolio() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [allocations, setAllocations] = useState<Allocations>({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFunds().then(setFunds);
  }, []);

  const portfolioYield = calculatePortfolioYield(funds, allocations);
  const isValid = validateAllocations(allocations);

  const handleAllocationChange = (ticker: string, value: number) => {
    setAllocations(prev => ({ ...prev, [ticker]: value / 100 }));
  };

  const pieData = funds
    .filter(f => allocations[f.ticker] > 0)
    .map(f => ({
      name: f.ticker,
      value: Math.round(allocations[f.ticker] * 100),
    }));

  const handleSave = () => {
    if (!isValid) {
      setError('Allocations must add up to 100%');
      return;
    }
    localStorage.setItem('allocations', JSON.stringify(allocations));
    localStorage.setItem('portfolioYield', portfolioYield.toString());
    setError('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Portfolio Allocation</h1>
        <Link to="/calculator" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Go to Calculator →
        </Link>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {funds.map(fund => (
            <div key={fund.ticker} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span><strong>{fund.ticker}</strong> - {fund.name}</span>
                <span>{Math.round((allocations[fund.ticker] || 0) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round((allocations[fund.ticker] || 0) * 100)}
                onChange={(e) => handleAllocationChange(fund.ticker, Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: '12px', color: '#666' }}>
                Avg Yield: {fund.averageAnnualYield}%
              </div>
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={!isValid}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: isValid ? '#16a34a' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isValid ? 'pointer' : 'not-allowed'
            }}
          >
            Save Portfolio
          </button>
        </div>

        <div style={{ width: '250px' }}>
          <h3>Allocation</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No allocation selected</p>
          )}
          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            Portfolio Yield: <strong>{portfolioYield.toFixed(2)}%</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
