import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Fund, Allocations, Portfolio } from '../types';
import { fetchFunds, fetchPortfolios, createPortfolio, savePortfolio, deleteAllPortfolios, getStoredPortfolios, storePortfolio, deleteAllStoredPortfolios, getUserId, DEFAULT_ALLOCATIONS } from '../api';
import { isLoggedIn } from '../utils/auth';
import AuthButton from '../components/AuthButton';
import AllocationEditor from '../components/AllocationEditor';
import AllocationChart from '../components/AllocationChart';
import FundPerformanceDisplay from '../components/FundPerformanceDisplay';

export default function Portfolio() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [allocations, setAllocations] = useState<Allocations>(DEFAULT_ALLOCATIONS);
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['VOO', 'BND']);
  const [name, setName] = useState('My Portfolio');
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [error, setError] = useState('');
  const [savedMsg, setSavedMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = isLoggedIn();
    setLoading(true);
    fetchFunds()
      .then((f) => {
        setFunds(f);
        if (loggedIn) {
          fetchPortfolios(getUserId()!).then(p => {
            setPortfolios(p);
            loadSavedPortfolio(p);
          }).catch(() => {
            setError('Failed to load portfolios');
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
      })
      .catch((err) => {
        console.error('Failed to fetch funds:', err);
        setError('Failed to connect to server');
      })
      .finally(() => {
        setLoading(false);
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

  const totalAllocation = Object.values(allocations).reduce((sum, v) => sum + v, 0);
  const isValidAllocation = Math.abs(totalAllocation - 1) < 0.001;

  useEffect(() => {
    setSavedMsg('');
  }, [allocations]);

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
        <div className="flex-gap">
          <Link to="/portfolios" className="btn">← Portfolios</Link>
          <h1>Portfolio Allocation</h1>
        </div>
        <div className="flex-gap">
          <Link to="/calculator" className="btn">Go to Calculator →</Link>
          <AuthButton />
        </div>
      </div>

      {loading ? (
        <div className="container" style={{ textAlign: 'center', padding: 50 }}>
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="alert alert-red">
          {error}
          <button onClick={() => window.location.reload()} style={{ marginLeft: 10 }}>Retry</button>
        </div>
      ) : funds.length === 0 ? (
        <div className="alert alert-red">
          No funds loaded from server. Check API connection.
        </div>
      ) : (
        <>
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
              isValidAllocation={isValidAllocation}
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

          <div style={{ marginTop: 20 }}>
            <FundPerformanceDisplay />
          </div>
        </>
      )}
    </div>
  );
}