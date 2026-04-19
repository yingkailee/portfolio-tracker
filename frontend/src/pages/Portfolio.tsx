import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Fund, Allocations, Portfolio } from '../types';
import { fetchFunds, fetchPortfolios, createPortfolio, savePortfolio, deleteAllPortfolios, getStoredPortfolios, storePortfolio, deleteAllStoredPortfolios, getUserId, DEFAULT_ALLOCATIONS } from '../api';
import AuthButton from '../components/AuthButton';
import AllocationEditor from '../components/AllocationEditor';
import AllocationChart from '../components/AllocationChart';

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export default function Portfolio() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [allocations, setAllocations] = useState<Allocations>(DEFAULT_ALLOCATIONS);
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['VOO', 'BND']);
  const [name, setName] = useState('My Portfolio');
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

  const handleCreate = () => {
    setError('');
    if (!name) { setError('Enter a name'); return; }
    if (portfolios.some(p => p.name === name)) { setError('A portfolio with this name already exists'); return; }
    const loggedIn = isLoggedIn();
    if (loggedIn) {
      createPortfolio(name, allocations, getUserId()!).then(newPortfolio => {
        setSavedMsg('Saved!');
        fetchPortfolios(getUserId()!).then(p => { setPortfolios(p); setSelectedId(Number(newPortfolio.id)); });
      }).catch(() => setError('Failed to save'));
    } else {
      const newP = storePortfolio(name, allocations);
      setSavedMsg('Saved!');
      setPortfolios(getStoredPortfolios());
      setSelectedId(Number(newP.id));
    }
  };

  const handleUpdate = () => {
    if (!selectedId) return;
    setError('');
    const loggedIn = isLoggedIn();
    if (loggedIn) {
      savePortfolio(selectedId as number, name, allocations).then(() => {
        setSavedMsg('Updated!');
        fetchPortfolios(getUserId()!).then(p => setPortfolios(p));
      }).catch(() => setError('Failed to update'));
    } else {
      storePortfolio(name, allocations, selectedId);
      setSavedMsg('Updated!');
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
          fetchPortfolios(getUserId()!).then(p => { setPortfolios(p); loadPortfolio(newP); });
        });
      }).catch(() => setError('Failed to delete'));
    } else {
      deleteAllStoredPortfolios();
      const newP = storePortfolio('My Portfolio', DEFAULT_ALLOCATIONS);
      setPortfolios([newP]);
      loadPortfolio(newP);
    }
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

      <div className="flex-gap-lg">
        <AllocationEditor
          funds={funds}
          portfolios={portfolios}
          allocations={allocations}
          selectedTickers={selectedTickers}
          selectedId={selectedId}
          name={name}
          onAllocationsChange={setAllocations}
          onSelectedTickersChange={setSelectedTickers}
          onNameChange={setName}
          onPortfolioSelect={loadPortfolio}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDeleteAll={handleDeleteAll}
          error={error}
          savedMsg={savedMsg}
        />
        <AllocationChart funds={funds} allocations={allocations} />
      </div>
    </div>
  );
}