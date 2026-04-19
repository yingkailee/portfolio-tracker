import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Fund, Allocations, Portfolio } from '../types';
import { fetchFunds, fetchPortfolios, createPortfolio, savePortfolio, deleteAllPortfolios, getStoredPortfolios, storePortfolio, deleteAllStoredPortfolios, getUserId, DEFAULT_ALLOCATIONS } from '../api';
import AuthButton from '../components/AuthButton';
import { calculatePortfolioYield, validateAllocations } from '../utils/calculations';
import Dropdown from '../components/Dropdown';

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2'];

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export default function Portfolio() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [allocations, setAllocations] = useState<Allocations>(DEFAULT_ALLOCATIONS);
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['VOO', 'BND']);
  const [showPicker, setShowPicker] = useState(false);
  const [name, setName] = useState('');
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [error, setError] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    const loggedIn = isLoggedIn();
    Promise.all([fetchFunds()]).then(([f]) => {
      setFunds(f);
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
    });

    function loadSavedPortfolio(p: Portfolio[]) {
      if (p.length) {
        const savedId = localStorage.getItem('selectedPortfolioId');
        if (savedId) {
          const target = p.find(x => String(x.id) === savedId);
          if (target) { setSelectedId(target.id); loadPortfolio(target); return; }
        }
        if (p[0]) { setSelectedId(Number(p[0].id)); loadPortfolio(p[0]); }
      }
    }
  }, []);

  const loadPortfolio = (p: Portfolio) => {
    const allocs = JSON.parse(p.allocations);
    setAllocations(allocs);
    setSelectedTickers(Object.keys(allocs));
    setName(p.name);
    setSelectedId(p.id as number);
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

  const handleCreate = () => {
    setError('');
    if (!isValid) { setError(hasFunds ? 'Allocations must add up to 100%' : 'Select at least one fund'); return; }
    if (!name) { setError('Enter a name'); return; }
    if (portfolios.some(p => p.name === name)) { setError('A portfolio with this name already exists'); return; }
    const loggedIn = isLoggedIn();
    if (loggedIn) {
      createPortfolio(name, allocations, getUserId()!).then(newPortfolio => {
        setSavedMsg('Saved!');
        setError('');
        fetchPortfolios(getUserId()!).then(p => { setPortfolios(p); setSelectedId(Number(newPortfolio.id)); });
      }).catch(() => setError('Failed to save'));
    } else {
      const newPortfolio = storePortfolio(name, allocations);
      setSavedMsg('Saved!');
      setError('');
      setPortfolios(getStoredPortfolios());
      setSelectedId(Number(newPortfolio.id));
    }
  };

  const handleUpdatePortfolio = () => {
    if (!selectedId) return;
    setError('');
    if (!isValid) { setError(hasFunds ? 'Allocations must add up to 100%' : 'Select at least one fund'); return; }
    const loggedIn = isLoggedIn();
    if (loggedIn) {
      savePortfolio(selectedId as number, name, allocations).then(() => {
        setSavedMsg('Updated!');
        setError('');
        fetchPortfolios(getUserId()!).then(p => setPortfolios(p));
      }).catch(() => setError('Failed to update'));
    } else {
      storePortfolio(name, allocations, selectedId);
      setSavedMsg('Updated!');
      setError('');
      setPortfolios(getStoredPortfolios());
    }
  };

  const handleDeleteAll = () => {
    const confirmed = window.confirm('Are you sure you want to DELETE ALL portfolios? This cannot be undone!');
    if (!confirmed) return;
    setError('');
    const loggedIn = isLoggedIn();
    if (loggedIn) {
      deleteAllPortfolios(getUserId()!).then(() => {
        createPortfolio('My Portfolio', DEFAULT_ALLOCATIONS, getUserId()!).then(newP => {
          fetchPortfolios(getUserId()!).then(p => { setPortfolios(p); resetState(); loadPortfolio(newP); });
        });
      }).catch(() => setError('Failed to delete'));
    } else {
      deleteAllStoredPortfolios();
      const defaultP = storePortfolio('My Portfolio', DEFAULT_ALLOCATIONS);
      setPortfolios([defaultP]);
      resetState();
      loadPortfolio(defaultP);
    }
  };

  const resetState = () => {
    setAllocations(DEFAULT_ALLOCATIONS);
    setSelectedTickers(Object.keys(DEFAULT_ALLOCATIONS));
    setName('My Portfolio');
    setSelectedId(null);
    setSavedMsg('');
  };

  return (
    <div className="container">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <h1>Portfolio Allocation</h1>
        <div className="flex-gap">
          <Link to="/calculator" className="btn">Go to Calculator →</Link>
          <AuthButton />
        </div>
      </div>

      {!isLoggedIn() && (
        <div className="alert alert-yellow">
          Guest mode: portfolios saved locally. <Link to="/login" className="link">Login</Link> or <Link to="/register" className="link link-green">Register</Link> to save to database.
        </div>
      )}

      {portfolios.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <label>Portfolio: </label>
          <Dropdown
            items={portfolios.map(p => ({ id: p.id, label: p.name }))}
            selectedId={selectedId}
            onSelect={p => loadPortfolio(portfolios.find(x => x.id === p.id)!) }
            placeholder="-- select --"
          />
        </div>
      )}

      <div className="flex-gap-lg">
        <div style={{ flex: 1 }}>
          <input placeholder="Portfolio name" value={name} onChange={e => handleNameChange(e.target.value)} className="input" />

          <div className="alloc-list">
            {selectedFunds.map(fund => (
              <div key={fund.ticker} className="alloc-item">
                <div className="alloc-header">
                  <span>
                    <strong>{fund.ticker}</strong> - {fund.name}
                    <button onClick={() => removeFund(fund.ticker)} disabled={selectedTickers.length === 1} className="alloc-btn-remove" style={{ background: selectedTickers.length === 1 ? '#ccc' : undefined }}>×</button>
                  </span>
                  <span>{Math.round((allocations[fund.ticker] || 0) * 100)}%</span>
                </div>
                <input type="range" min={0} max={100} value={Math.round((allocations[fund.ticker] || 0) * 100)} onChange={e => handleAllocationChange(fund.ticker, +e.target.value)} className="range-input" />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 10, position: 'relative' }}>
            <button onClick={() => setShowPicker(!showPicker)} className="picker-btn-add">+ Add Fund</button>
            {showPicker && (
              <div className="picker">
                {availableFunds.map(fund => (
                  <div key={fund.ticker} onClick={() => addFund(fund.ticker)} className="picker-item">
                    <strong>{fund.ticker}</strong> - {fund.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="action-row">
            <button onClick={handleCreate} disabled={!isValid || !name} className="btn btn-green" style={{ background: isValid && name ? '#16a34a' : undefined }}>
              {savedMsg === 'Saved!' ? 'Saved!' : 'Save New Portfolio'}
            </button>
            <button onClick={handleUpdatePortfolio} disabled={!selectedId || !isValid} className="btn" style={{ background: selectedId && isValid ? '#2563eb' : undefined }}>
              {savedMsg === 'Updated!' ? 'Updated!' : 'Update Portfolio'}
            </button>
            <button onClick={handleDeleteAll} disabled={portfolios.length === 0} className="btn btn-red" style={{ background: portfolios.length > 0 ? '#dc2626' : undefined }}>
              Delete All
            </button>
          </div>
          {error && <div className="action-error">{error}</div>}
        </div>

        <div className="chart">
          <h3 className="section-header">Allocation</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} isAnimationActive={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ textAlign: 'center', color: '#666' }}>No allocation</p>}
          <div className="flex-gap" style={{ marginTop: 10 }}>
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