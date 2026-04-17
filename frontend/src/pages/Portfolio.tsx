import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Fund, Allocations, Portfolio } from '../types';
import { fetchFunds, fetchPortfolios, createPortfolio, savePortfolio, calculatePortfolioYield, validateAllocations } from '../api';

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2'];
const USER_ID = 1;

export default function Portfolio() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [allocations, setAllocations] = useState<Allocations>({});
  const [name, setName] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([fetchFunds(), fetchPortfolios(USER_ID)]).then(([f, p]) => {
      setFunds(f);
      setPortfolios(p);
      if (p.length) { setSelectedId(p[0].id); loadPortfolio(p[0]); }
    });
  }, []);

  const loadPortfolio = (p: Portfolio) => {
    setAllocations(JSON.parse(p.allocations));
    setName(p.name);
    setSelectedId(p.id);
    setSaved(false);
  };

  const handleAllocationChange = (ticker: string, value: number) => {
    setAllocations(prev => ({ ...prev, [ticker]: value / 100 }));
  };

  const portfolioYield = calculatePortfolioYield(funds, allocations);
  const isValid = validateAllocations(allocations);

  const pieData = funds.filter(f => allocations[f.ticker] > 0).map(f => ({
    name: f.ticker,
    value: Math.round(allocations[f.ticker] * 100),
  }));

  const handleSave = async () => {
    if (!isValid) { setError('Allocations must add up to 100%'); return; }
    if (!name) { setError('Enter a name'); return; }
    const duplicate = portfolios.find(p => p.name === name && p.id !== selectedId);
    if (duplicate) { setError('A portfolio with this name already exists'); return; }
    try {
      if (selectedId) {
        await savePortfolio(selectedId, name, allocations);
      } else {
        await createPortfolio(name, allocations, USER_ID);
      }
      setSaved(true);
      setError('');
      fetchPortfolios(USER_ID).then(p => { setPortfolios(p); setSelectedId(p.find(x => x.name === name)?.id || null); });
    } catch { setError('Failed to save'); }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Portfolio Allocation</h1>
        <Link to="/calculator" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: 5 }}>Go to Calculator →</Link>
      </div>

      {portfolios.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <label>Saved: </label>
          <select onChange={e => loadPortfolio(portfolios.find(p => p.id === +e.target.value)!)} value={portfolios.find(p => p.name === name)?.id || ''}>
            <option value="">-- select --</option>
            {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      )}

      <div style={{ display: 'flex', gap: 60, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <input placeholder="Portfolio name" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: 15, padding: 8, width: '100%' }} />
          {funds.map(fund => (
            <div key={fund.ticker} style={{ marginBottom: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span><strong>{fund.ticker}</strong> - {fund.name}</span>
                <span>{Math.round((allocations[fund.ticker] || 0) * 100)}%</span>
              </div>
              <input type="range" min={0} max={100} value={Math.round((allocations[fund.ticker] || 0) * 100)} onChange={e => handleAllocationChange(fund.ticker, +e.target.value)} style={{ width: '100%' }} />
            </div>
          ))}
          <button onClick={handleSave} disabled={!isValid || !name} style={{ marginTop: 20, padding: '10px 20px', background: isValid && name ? '#16a34a' : '#ccc', color: 'white', border: 'none', borderRadius: 5, cursor: isValid && name ? 'pointer' : 'not-allowed' }}>
            {saved ? 'Saved!' : 'Save Portfolio'}
          </button>
          {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        </div>

        <div style={{ width: 350 }}>
          <h3>Allocation</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} isAnimationActive={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ textAlign: 'center', color: '#666' }}>No allocation</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
            {pieData.map((item, i) => (
              <div key={item.name} style={{ color: COLORS[i % COLORS.length] }}>{item.name}: {item.value}%</div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 10 }}>Yield: <strong>{portfolioYield.toFixed(2)}%</strong></p>
        </div>
      </div>
    </div>
  );
}