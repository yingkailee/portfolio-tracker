import type { Portfolio } from '../types';
import Dropdown from './Dropdown';

interface PortfolioPickerProps {
  portfolios: Portfolio[];
  selectedId: number | string | null;
  onSelect: (p: Portfolio) => void;
}

export default function PortfolioPicker({ portfolios, selectedId, onSelect }: PortfolioPickerProps) {
  if (portfolios.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <label>Portfolio: </label>
      <Dropdown
        items={portfolios.map(p => ({ id: p.id, label: p.name }))}
        selectedId={selectedId}
        onSelect={p => {
          const portfolio = portfolios.find(x => x.id === p.id);
          if (portfolio) onSelect(portfolio);
        }}
        placeholder="-- select --"
        pickerStyle={true}
      />
    </div>
  );
}