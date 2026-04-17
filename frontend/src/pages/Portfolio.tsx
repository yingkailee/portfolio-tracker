import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Fund, Allocations, Portfolio } from '../types';
import { fetchFunds, fetchPortfolios, createPortfolio, savePortfolio, deleteAllPortfolios, calculatePortfolioYield, validateAllocations } from '../api';

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2'];
const USER_ID = 1;

export default function Portfolio() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [allocations, setAllocations] = useState<Allocations>({ VOO: 1 });
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['VOO']);
  const [showPicker, setShowPicker] = useState(false);
  const [name, setName] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    Promise.all([fetchFunds(), fetchPortfolios(USER_ID)]).then(([f, p]) => {
      setFunds(f);
      setPortfolios(p);
      if (p.length) { setSelectedId(p[0].id); loadPortfolio(p[0]); }
    });
  }, []);

  const loadPortfolio = (p: Portfolio) => {
    const allocs = JSON.parse(p.allocations);
    setAllocations(allocs);
    setSelectedTickers(Object.keys(allocs));
    setName(p.name);
    setSelectedId(p.id);
    setSavedMsg('');
    localStorage.setItem('selectedPortfolioId', p.id.toString());
  };

  const selectedFunds = funds.filter(f => selectedTickers.includes(f.ticker));

  const handleAllocationChange = (ticker: string, value: number) => {
    setAllocations(prev => ({ ...prev, [ticker]: value / 100 }));
    setSavedMsg('');
  };

  const addFund = (ticker: string) => {
    if (!selectedTickers.includes(ticker)) {
      setSelectedTickers([...selectedTickers, ticker]);
      setAllocations(prev => ({ ...prev, [ticker]: 0 }));
    }
    setShowPicker(false);
    setSavedMsg('');
  };

  const removeFund = (ticker: string) => {
    if (selectedTickers.length === 1) return;
    const newTickers = selectedTickers.filter(t => t !== ticker);
    setSelectedTickers(newTickers);
    const newAllocs = { ...allocations };
    delete newAllocs[ticker];
    setAllocations(newAllocs);
    setSavedMsg('');
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    setSavedMsg('');
  };

  const portfolioYield = calculatePortfolioYield(funds, allocations);
  const hasFunds = selectedTickers.length > 0;
  const isValid = hasFunds && validateAllocations(allocations);

  const pieData = selectedFunds.map(f => ({
    name: f.ticker,
    value: Math.round((allocations[f.ticker] || 0) * 100),
  })).filter(d => d.value > 0);

  const availableFunds = funds.filter(f => !selectedTickers.includes(f.ticker));

  const handleSave = async () => {
    if (!isValid) { setError(hasFunds ? 'Allocations must add up to 100%' : 'Select at least one fund'); return; }
    if (!name) { setError('Enter a name'); return; }
    if (portfolios.some(p => p.name === name)) { setError('A portfolio with this name already exists'); return; }
    try {
      const newPortfolio = await createPortfolio(name, allocations, USER_ID);
      setSavedMsg('Saved!');
      setError('');
      const updated = await fetchPortfolios(USER_ID);
      setPortfolios(updated);
      setSelectedId(newPortfolio.id);
    } catch { setError('Failed to save'); }
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    if (!isValid) { setError(hasFunds ? 'Allocations must add up to 100%' : 'Select at least one fund'); return; }
    try {
      await savePortfolio(selectedId, name, allocations);
      setSavedMsg('Updated!');
      setError('');
      const updated = await fetchPortfolios(USER_ID);
      setPortfolios(updated);
    } catch { setError('Failed to update'); }
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm('Are you sure you want to DELETE ALL portfolios? This cannot be undone!');
    if (!confirmed) return;
    try {
      await deleteAllPortfolios(USER_ID);
      fetchPortfolios(USER_ID).then(p => { setPortfolios(p); setAllocations({ VOO: 1 }); setSelectedTickers(['VOO']); setName(''); setSelectedId(null); });
    } catch { setError('Failed to delete'); }
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
          <select onChange={e => loadPortfolio(portfolios.find(p => p.id === +e.target.value)!)} value={selectedId || ''}>
            <option value="">-- select --</option>
            {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      )}

      <div style={{ display: 'flex', gap: 60, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <input placeholder="Portfolio name" value={name} onChange={e => handleNameChange(e.target.value)} style={{ marginBottom: 15, padding: 8, width: '100%' }} />

          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {selectedFunds.map(fund => (
              <div key={fund.ticker} style={{ marginBottom: 15, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span>
                    <strong>{fund.ticker}</strong> - {fund.name}
                    <button onClick={() => removeFund(fund.ticker)} disabled={selectedTickers.length === 1} style={{ marginLeft: 8, padding: '2px 6px', background: selectedTickers.length === 1 ? '#ccc' : '#dc2626', color: 'white', border: 'none', borderRadius: 3, cursor: selectedTickers.length === 1 ? 'not-allowed' : 'pointer' }}>×</button>
                  </span>
                  <span>{Math.round((allocations[fund.ticker] || 0) * 100)}%</span>
                </div>
                <input type="range" min={0} max={100} value={Math.round((allocations[fund.ticker] || 0) * 100)} onChange={e => handleAllocationChange(fund.ticker, +e.target.value)} style={{ width: '100%' }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 10, position: 'relative' }}>
            <button onClick={() => setShowPicker(!showPicker)} style={{ padding: '8px 16px', background: '#666', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}>+ Add Fund</button>
            {showPicker && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #ccc', borderRadius: 5, maxHeight: 200, overflowY: 'auto', zIndex: 100, minWidth: 250, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                {availableFunds.map(fund => (
                  <div key={fund.ticker} onClick={() => addFund(fund.ticker)} style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <strong>{fund.ticker}</strong> - {fund.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleSave} disabled={!isValid || !name} style={{ marginTop: 20, marginRight: 10, padding: '10px 20px', background: isValid && name ? '#16a34a' : '#ccc', color: 'white', border: 'none', borderRadius: 5, cursor: isValid && name ? 'pointer' : 'not-allowed' }}>
            {savedMsg === 'Saved!' ? 'Saved!' : 'Save New Portfolio'}
          </button>
          {selectedId && (
            <>
              <button onClick={handleUpdate} disabled={!isValid} style={{ marginTop: 20, marginRight: 10, padding: '10px 20px', background: isValid ? '#2563eb' : '#ccc', color: 'white', border: 'none', borderRadius: 5, cursor: isValid ? 'pointer' : 'not-allowed' }}>
                {savedMsg === 'Updated!' ? 'Updated!' : 'Update Current Portfolio'}
              </button>
              <button onClick={handleDeleteAll} style={{ marginTop: 20, padding: '10px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
                Delete All Portfolios
              </button>
            </>
          )}
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