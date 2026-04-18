import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { CalculationResponse, Portfolio, Fund } from '../types';
import { calculateProjection, fetchPortfolios, fetchFunds } from '../api';
import { calculatePortfolioYield } from '../utils/calculations';

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
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

      <div style={{ marginBottom: 20, position: 'relative' }}>
        <label>Portfolio: </label>
        <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
          <div onClick={() => setShowDropdown(!showDropdown)} style={{ cursor: 'pointer', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 5, minWidth: 150, background: 'white' }}>
            {manualYield ? '-- manual --' : selectedPortfolio?.name || '-- select --'} ▾
          </div>
          {showDropdown && (
            <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #ccc', borderRadius: 5, minWidth: 200, maxHeight: 200, overflowY: 'auto', zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <div style={{ padding: 8 }}>
                <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '4px 8px', marginBottom: 8 }} />
              </div>
              <div onClick={() => { setManualYield(true); setSelectedPortfolio(null); setShowDropdown(false); setSearch(''); }} style={{ padding: '8px 12px', cursor: 'pointer', background: manualYield ? '#e5e7eb' : 'white' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = manualYield ? '#e5e7eb' : 'white'}>
                -- manual --
              </div>
              {portfolios.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
                <div key={p.id} onClick={() => { loadPortfolio(p, funds); setShowDropdown(false); setSearch(''); }} style={{ padding: '8px 12px', cursor: 'pointer', background: p.id === selectedPortfolio?.id ? '#e5e7eb' : 'white' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = p.id === selectedPortfolio?.id ? '#e5e7eb' : 'white'}>
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>
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