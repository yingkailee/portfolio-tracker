import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CalculationResponse, Portfolio, Fund } from '../types';
import { calculateProjection, fetchPortfolios, fetchFunds, calculatePortfolioYield } from '../api';

const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
const USER_ID = 1;

const Slider = ({ label, value, onChange, min, max, step, format }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; format: (v: number) => string;
}) => (
  <div style={{ marginBottom: 15 }}>
    <label style={{ display: 'block', marginBottom: 5 }}>{label}: {format(value)}</label>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} style={{ width: '100%' }} />
  </div>
);

export default function Calculator() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [manualYield, setManualYield] = useState(false);
  const [capital, setCapital] = useState(100000);
  const [savings, setSavings] = useState(20000);
  const [years, setYears] = useState(20);
  const [yield_, setYield] = useState(10.5);
  const [result, setResult] = useState<CalculationResponse | null>(null);

  useEffect(() => {
    Promise.all([fetchPortfolios(USER_ID), fetchFunds()]).then(([p, f]) => {
      setPortfolios(p);
      setFunds(f);
      const savedId = localStorage.getItem('selectedPortfolioId');
      const target = savedId ? p.find(x => x.id === +savedId) : null;
      if (target) loadPortfolio(target, f);
      else if (p.length) loadPortfolio(p[0], f);
    });
  }, []);

  const loadPortfolio = (p: Portfolio, f: Fund[]) => {
    setSelectedPortfolio(p);
    const allocs = JSON.parse(p.allocations);
    setSelectedPortfolio(p);
    setManualYield(false);
    const y = calculatePortfolioYield(f, allocs);
    setYield(y);
    localStorage.setItem('selectedPortfolioId', p.id.toString());
  };

  useEffect(() => {
    const id = setTimeout(() => calculateProjection({ initialCapital: capital, yearlySavings: savings, timeHorizonYears: years, portfolioYield: yield_ }).then(setResult), 300);
    return () => clearTimeout(id);
  }, [capital, savings, years, yield_]);

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Calculator</h1>
        <Link to="/portfolio" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: 5 }}>← Portfolio</Link>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Portfolio: </label>
        <select value={manualYield ? '' : selectedPortfolio?.id || ''} onChange={e => {
          if (!e.target.value) { setManualYield(true); setSelectedPortfolio(null); return; }
          const p = portfolios.find(p => p.id === +e.target.value);
          if (p) loadPortfolio(p, funds);
        }}>
          <option value="">-- manual --</option>
          {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {selectedPortfolio && <span style={{ marginLeft: 10, color: '#666' }}>(yield: {yield_.toFixed(2)}%)</span>}
      </div>

      <Slider label="Initial Capital" value={capital} onChange={setCapital} min={0} max={1000000} step={10000} format={fmt} />
      <Slider label="Yearly Savings" value={savings} onChange={setSavings} min={0} max={200000} step={1000} format={fmt} />
      <Slider label="Time Horizon" value={years} onChange={setYears} min={1} max={50} step={1} format={v => `${v} years`} />
      <Slider label="Portfolio Yield" value={yield_} onChange={setYield} min={0} max={20} step={0.5} format={v => `${v.toFixed(2)}%`} />

      {result && (
        <div style={{ background: '#f3f4f6', padding: 20, borderRadius: 10, marginTop: 20 }}>
          <h2 style={{ marginBottom: 15 }}>Results</h2>
          {[
            ['Final Net Worth', fmt(result.finalNetWorth), '#16a34a', '24px'],
            ['Initial Capital', fmt(result.initialCapital), '', ''],
            ['Additional Investments', fmt(result.additionalInvestments), '', ''],
            ['Total Growth', fmt(result.totalGrowth), '#2563eb', ''],
          ].map(([label, value, color, size]) => (
            <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{label}:</span>
              <strong style={{ color, fontSize: size }}>{value}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}