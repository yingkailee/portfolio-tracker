import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CalculationResponse, Portfolio, Fund } from '../types';
import { calculateProjection, fetchPortfolios, fetchFunds, getStoredPortfolios, storePortfolio, getUserId } from '../api';
import { calculatePortfolioYield } from '../utils/calculations';
import Dropdown from '../components/Dropdown';
import AuthButton from '../components/AuthButton';

const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

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
    const loggedIn = isLoggedIn();
    Promise.all([fetchFunds()]).then(([f]) => {
      setFunds(f);
      if (loggedIn) {
        fetchPortfolios(getUserId()!).then(p => {
          setPortfolios(p);
          loadSavedPortfolio(p, f);
        });
      } else {
        let stored = getStoredPortfolios();
        if (stored.length === 0) {
          const defaultPortfolio = storePortfolio('My Portfolio', { VOO: 1 });
          stored = [defaultPortfolio];
        }
        setPortfolios(stored);
        loadSavedPortfolio(stored, f);
      }
    });

    function loadSavedPortfolio(p: Portfolio[], f: Fund[]) {
      if (p.length) {
        const savedId = localStorage.getItem('selectedPortfolioId');
        const target = savedId ? p.find(x => String(x.id) === savedId) : null;
        if (target) loadPortfolio(target, f);
        else loadPortfolio(p[0], f);
      }
    }
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
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/portfolio" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: 5 }}>← Portfolio</Link>
          <AuthButton />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Portfolio: </label>
        <Dropdown
          items={portfolios.map(p => ({ id: p.id, label: p.name }))}
          selectedId={manualYield ? 'manual' : selectedPortfolio?.id ?? null}
          onSelect={p => loadPortfolio(portfolios.find(x => x.id === p.id)!, funds)}
          placeholder="-- select --"
          manualOption={{ id: 'manual', label: '-- manual --' }}
          onManual={() => { setManualYield(true); setSelectedPortfolio(null); }}
        />
        {selectedPortfolio && <span style={{ marginLeft: 10, color: '#666' }}>(yield: {yield_.toFixed(2)}%)</span>}
      </div>

      <Slider label="Initial Capital" value={capital} onChange={setCapital} min={0} max={1000000} step={10000} format={fmt} />
      <Slider label="Yearly Savings" value={savings} onChange={setSavings} min={0} max={200000} step={1000} format={fmt} />
      <Slider label="Time Horizon" value={years} onChange={setYears} min={1} max={50} step={1} format={v => `${v} years`} />
      <Slider label="Portfolio Yield" value={yield_} onChange={setYield} min={0} max={20} step={0.5} format={v => `${v.toFixed(2)}%`} />

      {result && (
        <div style={{ background: '#f3f4f6', padding: 20, borderRadius: 10, marginTop: 20 }}>
          <h2 style={{ marginBottom: 15, borderBottom: '1px solid #ddd', paddingBottom: 10 }}>Results</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Initial Capital:</span>
            <span>{fmt(result.initialCapital)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Additional Investments:</span>
            <span>{fmt(result.additionalInvestments)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
            <span>Total Growth:</span>
            <span style={{ color: '#2563eb' }}>{fmt(result.totalGrowth)}</span>
          </div>
          <div style={{ borderTop: '1px solid #ddd', paddingTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '18px', fontWeight: 600 }}>Final Net Worth:</span>
            <strong style={{ color: '#16a34a', fontSize: '24px' }}>{fmt(result.finalNetWorth)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}