import type { Fund, Allocations, Portfolio } from '../types';
import PortfolioPicker from './PortfolioPicker';
import StockEditor from './StockEditor';

interface AllocationEditorProps {
  funds: Fund[];
  portfolios: Portfolio[];
  allocations: Allocations;
  selectedTickers: string[];
  selectedId: number | string | null;
  name: string;
  isValidAllocation: boolean;
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
  isValidAllocation,
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
  const handleCreate = () => {
    if (!name) return;
    onCreate();
  };

  const handleUpdate = () => {
    if (!selectedId) return;
    onUpdate();
  };

  return (
    <div style={{ flex: 1 }}>
      <PortfolioPicker
        portfolios={portfolios}
        selectedId={selectedId}
        onSelect={onPortfolioSelect}
      />

      <input
        placeholder="Portfolio name"
        value={name}
        onChange={e => onNameChange(e.target.value)}
        className="input"
      />

      <StockEditor
        funds={funds}
        allocations={allocations}
        selectedTickers={selectedTickers}
        onAllocationsChange={onAllocationsChange}
        onSelectedTickersChange={onSelectedTickersChange}
      />

      <div className="action-row">
        <button
          onClick={handleCreate}
          disabled={!name || !isValidAllocation}
          className="btn"
        >
          {savedMsg === 'Saved!' ? 'Saved!' : 'Save New Portfolio'}
        </button>
        <button
          onClick={handleUpdate}
          disabled={!selectedId || !isValidAllocation}
          className="btn"
        >
          {savedMsg === 'Updated!' ? 'Updated!' : 'Update Portfolio'}
        </button>
        <button
          onClick={onDeleteAll}
          disabled={portfolios.length === 0}
          className="btn btn-red"
        >
          Delete All
        </button>
      </div>
      {error && <div className="action-error">{error}</div>}
    </div>
  );
}