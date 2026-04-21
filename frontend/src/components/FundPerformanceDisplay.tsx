import { useState, useEffect } from 'react';
import { fetchFunds, fetchFundPerformance } from '../api';
import type { Fund, FundPerformance } from '../types';

const STORAGE_KEY = 'selectedFundTicker';

export default function FundPerformanceDisplay() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string>('');
  const [performance, setPerformance] = useState<FundPerformance | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const loadFunds = async () => {
    const f = await fetchFunds();
    setFunds(f);
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && f.some(fund => fund.ticker === saved)) {
      setSelectedTicker(saved);
    } else {
      setSelectedTicker('');
    }
    setInitialized(true);
  };

  const loadPerformance = async (ticker: string) => {
    setSelectedTicker(ticker);
    if (ticker) {
      localStorage.setItem(STORAGE_KEY, ticker);
      setLoading(true);
      setPerformance(null);
      try {
        const p = await fetchFundPerformance(ticker);
        setPerformance(p);
      } catch {
        setPerformance(null);
      }
      setLoading(false);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setPerformance(null);
    }
  };

  useEffect(() => {
    loadFunds();
  }, []);

  useEffect(() => {
    if (initialized && selectedTicker) {
      loadPerformance(selectedTicker);
    }
  }, [selectedTicker]);

  const formatPercent = (value: number | null) => {
    if (value === null) return '--';
    return (value * 100).toFixed(2) + '%';
  };

  if (!initialized) {
    return <div className="card" style={{ marginTop: 20 }}>Loading...</div>;
  }

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h3 className="section-header">Fund Performance Lookup</h3>
      <div style={{ marginBottom: 15 }}>
        <label>Ticker: </label>
        <select
          value={selectedTicker}
          onChange={e => loadPerformance(e.target.value)}
          className="input"
          style={{ width: 'auto' }}
        >
          <option value="">-- Select a fund --</option>
          {funds.map(f => (
            <option key={f.ticker} value={f.ticker}>{f.ticker} - {f.name}</option>
          ))}
        </select>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : performance ? (
        <div>
          <div className="result-row">
            <span>5-Year CAGR:</span>
            <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{formatPercent(performance.cagr5yr)}</span>
          </div>
          <div className="result-row">
            <span>10-Year CAGR:</span>
            <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{formatPercent(performance.cagr10yr)}</span>
          </div>
          <div className="result-row-lg">
            <span>15-Year CAGR:</span>
            <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{formatPercent(performance.cagr15yr)}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 10 }}>
            Data: {performance.dataStartDate} to {performance.dataEndDate}
          </div>
        </div>
      ) : selectedTicker ? (
        <p>No performance data available for {selectedTicker}</p>
      ) : (
        <p>Select a fund to view performance</p>
      )}
    </div>
  );
}