import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CalculationResponse, Portfolio } from '../types';
import { calculateProjection, fetchPortfolios, getStoredPortfolios, storePortfolio, getUserId, DEFAULT_ALLOCATIONS } from '../api';
import { calculatePortfolioYield, type CagrPeriod } from '../utils/calculations';
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
  <div className="slider-container">
    <label className="label-block">{label}: {format(value)}</label>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} className="range-input" />
  </div>
);

export default function Calculator() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [manualYield, setManualYield] = useState(false);
  const [capital, setCapital] = useState(100000);
  const [savings, setSavings] = useState(20000);
  const [years, setYears] = useState(20);
  const [yield_, setYield] = useState(10.5);
  const [cagrPeriod, setCagrPeriod] = useState<CagrPeriod>(15);
  const [result, setResult] = useState<CalculationResponse | null>(null);
  const [yieldLoading, setYieldLoading] = useState(false);

  useEffect(() => {
    const loggedIn = isLoggedIn();
    if (loggedIn) {
      fetchPortfolios(getUserId()!).then(p => {
        setPortfolios(p);
        loadSavedPortfolio(p);
      });
    } else {
      let stored = getStoredPortfolios();
      if (stored.length === 0) {
        const newP = storePortfolio('My Portfolio', DEFAULT_ALLOCATIONS);
        stored = [newP];
      }
      setPortfolios(stored);
      loadSavedPortfolio(stored);
    }

    function loadSavedPortfolio(p: Portfolio[]) {
      if (p.length) {
        const savedId = localStorage.getItem('selectedPortfolioId');
        const target = savedId ? p.find(x => String(x.id) === savedId) : null;
        if (target) loadPortfolio(target);
        else loadPortfolio(p[0]);
      }
    }
  }, []);

  const loadPortfolio = async (p: Portfolio) => {
    setSelectedPortfolio(p);
    const allocs = JSON.parse(p.allocations);
    setManualYield(false);
    setYieldLoading(true);
    const y = await calculatePortfolioYield(allocs, cagrPeriod);
    setYield(y * 100);
    setYieldLoading(false);
    localStorage.setItem('selectedPortfolioId', p.id.toString());
  };

  useEffect(() => {
    if (selectedPortfolio && !manualYield) {
      loadPortfolio(selectedPortfolio);
    }
  }, [cagrPeriod]);

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
          onSelect={p => loadPortfolio(portfolios.find(x => x.id === p.id)!)}
          placeholder="-- select --"
          manualOption={{ id: 'manual', label: '-- manual --' }}
          onManual={() => { setManualYield(true); setSelectedPortfolio(null); }}
        />
        {selectedPortfolio && <span style={{ marginLeft: 10, color: '#666' }}>
          (yield: {yieldLoading ? '...' : `${yield_.toFixed(2)}%`})
        </span>}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>CAGR Period: </label>
        <select
          value={cagrPeriod}
          onChange={e => setCagrPeriod(Number(e.target.value) as CagrPeriod)}
          className="input"
          style={{ width: 'auto' }}
        >
          <option value={5}>5-Year</option>
          <option value={10}>10-Year</option>
          <option value={15}>15-Year</option>
        </select>
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
            <span className="result-label">Final Net Worth: </span>
            <strong style={{ color: '#16a34a', fontSize: '24px' }}>{fmt(result.finalNetWorth)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
