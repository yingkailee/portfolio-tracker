import { useState, useEffect, useRef } from 'react';
import type { Fund, Allocations } from '../types';

interface StockEditorProps {
  funds: Fund[];
  allocations: Allocations;
  selectedTickers: string[];
  onAllocationsChange: (a: Allocations) => void;
  onSelectedTickersChange: (t: string[]) => void;
}

export default function StockEditor({
  funds,
  allocations,
  selectedTickers,
  onAllocationsChange,
  onSelectedTickersChange,
}: StockEditorProps) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedFunds = funds.filter(f => selectedTickers.includes(f.ticker));
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
    <div>
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

      <div style={{ marginTop: 10, position: 'relative' }} ref={pickerRef}>
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
    </div>
  );
}