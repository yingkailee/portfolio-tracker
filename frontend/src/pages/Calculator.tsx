import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Line } from 'recharts';
import type { CalculationResponse, Portfolio } from '../types';
import { calculateProjection, fetchPortfolios, getStoredPortfolios, storePortfolio, getUserId, DEFAULT_ALLOCATIONS } from '../api';
import { calculatePortfolioYield, type CagrPeriod } from '../utils/calculations';
import Dropdown from '../components/Dropdown';
import AuthButton from '../components/AuthButton';

const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
const fmtCompact = (v: number) => {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
};

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
  const [sliderTouched, setSliderTouched] = useState(false);
  const [capital, setCapital] = useState(100000);
  const [savings, setSavings] = useState(20000);
  const [years, setYears] = useState(20);
  const [yield_, setYield] = useState(10.5);
  const [cagrPeriod, setCagrPeriod] = useState<CagrPeriod>(15);
  const [result, setResult] = useState<CalculationResponse | null>(null);
  const [yieldLoading, setYieldLoading] = useState(false);

  const growthData = useMemo(() => {
    if (!result) return [];
    const data = [];
    let netWorth = capital;
    const yearlySavingsAmount = savings;
    const rate = yield_ / 100;

    for (let year = 0; year <= years; year++) {
      data.push({
        year,
        netWorth: Math.round(netWorth),
        contributions: Math.round(capital + yearlySavingsAmount * year),
        growth: Math.round(netWorth - capital - yearlySavingsAmount * year),
      });
      netWorth = netWorth * (1 + rate) + yearlySavingsAmount;
    }
    return data;
  }, [capital, savings, years, yield_, result]);

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
    setSliderTouched(false);
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

  const handleYieldChange = (v: number) => {
    setSliderTouched(true);
    setYield(v);
  };

  useEffect(() => {
    const id = setTimeout(() => calculateProjection({ initialCapital: capital, yearlySavings: savings, timeHorizonYears: years, portfolioYield: yield_ }).then(setResult), 300);
    return () => clearTimeout(id);
  }, [capital, savings, years, yield_]);

  return (
    <div className="container">
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
          onManual={() => { setManualYield(true); setSliderTouched(false); setSelectedPortfolio(null); }}
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
      <Slider 
            label={(sliderTouched || manualYield) ? "Yield" : "Portfolio Yield"} 
            value={yield_} 
            onChange={handleYieldChange} 
            min={0} 
            max={20} 
            step={0.5} 
            format={v => `${v.toFixed(2)}%`} 
          />

      {result && (
        <div className="alert-result">
          <div style={{ display: 'flex', gap: 40 }}>
            <div style={{ flex: 1 }}>
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

            <div style={{ flex: 1.5 }}>
              {growthData.length > 0 && (
                <div>
                  <h3 className="section-header">Growth Over Time</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={growthData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis 
                        dataKey="year" 
                        tickFormatter={(v) => `Y${v}`}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis 
                        tickFormatter={fmtCompact}
                        tick={{ fontSize: 11 }}
                        width={50}
                      />
                      <Tooltip 
                        formatter={(value) => fmt(value as number)}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="netWorth" 
                        stroke="#16a34a" 
                        fillOpacity={1} 
                        fill="url(#colorNetWorth)" 
                        name="Net Worth"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="contributions" 
                        stroke="#2563eb" 
                        strokeDasharray="5 5" 
                        dot={false}
                        name="Contributions"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
