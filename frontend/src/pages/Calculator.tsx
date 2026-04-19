import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CalculationResponse, Portfolio, Fund } from '../types';
import { calculateProjection, fetchPortfolios, fetchFunds, getStoredPortfolios, storePortfolio, getUserId, DEFAULT_ALLOCATIONS } from '../api';
import { calculatePortfolioYield } from '../utils/calculations';
import Dropdown from '../components/Dropdown';
import AuthButton from '../components/AuthButton';

const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v).replace('$', '$ ');

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

const Slider = ({ label, value, onChange, min, max, step, format }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; format: (v: number) => string;
}) => (
  <div className="slider-container">
    <label className="label-block">{label}: {format(value)}</label>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} className="range-input" />
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
          const newP = storePortfolio('My Portfolio', DEFAULT_ALLOCATIONS);
          stored = [newP];
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
    <div className="container-narrow">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <h1>Calculator</h1>
        <div className="flex-gap">
          <Link to="/portfolio" className="btn">← Portfolio</Link>
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
            <span className="result-label">Final Net Worth:</span>
            <strong style={{ color: '#16a34a', fontSize: '24px' }}>{fmt(result.finalNetWorth)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
