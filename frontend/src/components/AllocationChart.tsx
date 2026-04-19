import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Fund, Allocations } from '../types';
import { calculatePortfolioYield } from '../utils/calculations';

const COLORS = ['#ec4899', '#f9a8d4', '#db2777', '#be185d', '#9d174d', '#831843'];

interface AllocationChartProps {
  funds: Fund[];
  allocations: Allocations;
}

export default function AllocationChart({ funds, allocations }: AllocationChartProps) {
  const selectedTickers = Object.keys(allocations);
  const selectedFunds = funds.filter(f => selectedTickers.includes(f.ticker));

  const pieData = selectedFunds.map(f => ({
    name: f.ticker,
    value: Math.round((allocations[f.ticker] || 0) * 100),
  })).filter(d => d.value > 0);

  const portfolioYield = calculatePortfolioYield(funds, allocations);

  return (
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
      <p style={{ textAlign: 'center', marginTop: 10, color: '#f9a8d4' }}>Yield: <strong style={{ color: '#ec4899' }}>{portfolioYield.toFixed(2)}%</strong></p>
      <div className="flex-gap" style={{ marginTop: 10 }}>
        {pieData.map((item, i) => (
          <div key={item.name} style={{ color: COLORS[i % COLORS.length] }}>{item.name}: {item.value}%</div>
        ))}
      </div>
    </div>
  );
}