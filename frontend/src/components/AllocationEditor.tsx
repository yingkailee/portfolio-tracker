import { useState } from 'react';
import type { Fund, Allocations, Portfolio } from '../types';
import Dropdown from './Dropdown';
import { validateAllocations } from '../utils/calculations';

interface AllocationEditorProps {
  funds: Fund[];
  portfolios: Portfolio[];
  allocations: Allocations;
  selectedTickers: string[];
  selectedId: number | string | null;
  name: string;
  onAllocationsChange: (a: Allocations) => void;
  onSelectedTickersChange: (t: string[]) => void;
  onNameChange: (n: string) => void;
  onPortfolioSelect: (p: Portfolio) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onDeleteAll: () => void;
  error: string;
  savedMsg: string;
}

export default function AllocationEditor({
  funds,
  portfolios,
  allocations,
  selectedTickers,
  selectedId,
  name,
  onAllocationsChange,
  onSelectedTickersChange,
  onNameChange,
  onPortfolioSelect,
  onCreate,
  onUpdate,
  onDeleteAll,
  error,
  savedMsg,
}: AllocationEditorProps) {
  const [showPicker, setShowPicker] = useState(false);

  const selectedFunds = funds.filter(f => selectedTickers.includes(f.ticker));
  const hasFunds = selectedTickers.length > 0;
  const isValid = hasFunds && validateAllocations(allocations);
  const availableFunds = funds.filter(f => !selectedTickers.includes(f.ticker));

  const handleAllocationChange = (ticker: string, value: number) => {
    onAllocationsChange({ ...allocations, [ticker]: value / 100 });
  };

  const addFund = (ticker: string) => {
    if (!selectedTickers.includes(ticker)) {
      onSelectedTickersChange([...selectedTickers, ticker]);
      onAllocationsChange({ ...allocations, [ticker]: 0 });
    }
    setShowPicker(false);
  };

  const removeFund = (ticker: string) => {
    if (selectedTickers.length === 1) return;
    const newTickers = selectedTickers.filter(t => t !== ticker);
    const newAllocs = { ...allocations };
    delete newAllocs[ticker];
    onSelectedTickersChange(newTickers);
    onAllocationsChange(newAllocs);
  };

  return (
    <div style={{ flex: 1 }}>
      <input
        placeholder="Portfolio name"
        value={name}
        onChange={e => onNameChange(e.target.value)}
        className="input"
      />

      {portfolios.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <label>Portfolio: </label>
          <Dropdown
            items={portfolios.map(p => ({ id: p.id, label: p.name }))}
            selectedId={selectedId}
            onSelect={p => {
              const portfolio = portfolios.find(x => x.id === p.id);
              if (portfolio) onPortfolioSelect(portfolio);
            }}
            placeholder="-- select --"
          />
        </div>
      )}

      <div className="alloc-list">
        {selectedFunds.map(fund => (
          <div key={fund.ticker} className="alloc-item">
            <div className="alloc-header">
              <span>
                <strong>{fund.ticker}</strong> - {fund.name}
                <button
                  onClick={() => removeFund(fund.ticker)}
                  disabled={selectedTickers.length === 1}
                  className="alloc-btn-remove"
                  style={{ background: selectedTickers.length === 1 ? '#ccc' : undefined }}
                >
                  ×
                </button>
              </span>
              <span>{Math.round((allocations[fund.ticker] || 0) * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round((allocations[fund.ticker] || 0) * 100)}
              onChange={e => handleAllocationChange(fund.ticker, +e.target.value)}
              className="range-input"
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10, position: 'relative' }}>
        <button onClick={() => setShowPicker(!showPicker)} className="picker-btn-add">
          + Add Fund
        </button>
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
        <button
          onClick={onCreate}
          disabled={!isValid || !name}
          className="btn btn-green"
          style={{ background: isValid && name ? '#16a34a' : undefined }}
        >
          {savedMsg === 'Saved!' ? 'Saved!' : 'Save New Portfolio'}
        </button>
        <button
          onClick={onUpdate}
          disabled={!selectedId || !isValid}
          className="btn"
          style={{ background: selectedId && isValid ? '#2563eb' : undefined }}
        >
          {savedMsg === 'Updated!' ? 'Updated!' : 'Update Portfolio'}
        </button>
        <button
          onClick={onDeleteAll}
          disabled={portfolios.length === 0}
          className="btn btn-red"
          style={{ background: portfolios.length > 0 ? '#dc2626' : undefined }}
        >
          Delete All
        </button>
      </div>
      {error && <div className="action-error">{error}</div>}
    </div>
  );
}