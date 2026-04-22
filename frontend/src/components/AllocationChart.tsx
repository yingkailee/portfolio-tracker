import { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Fund, Allocations, FundPerformance } from '../types';

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2'];

interface AllocationChartProps {
  funds: Fund[];
  allocations: Allocations;
}

interface YieldData {
  cagr5yr: number;
  cagr10yr: number;
  cagr15yr: number;
}

async function fetchAllCagrs(allocations: Allocations): Promise<YieldData> {
  const tickers = Object.keys(allocations);
  if (tickers.length === 0) return { cagr5yr: 0, cagr10yr: 0, cagr15yr: 0 };

  const performancePromises = tickers.map(async (ticker) => {
    try {
      const res = await fetch(`http://localhost:8080/api/fund-performance/${ticker}`);
      if (!res.ok) return { ticker, cagr5: 0, cagr10: 0, cagr15: 0 };
      const perf: FundPerformance = await res.json();
      return { 
        ticker, 
        cagr5: perf.cagr5yr || 0, 
        cagr10: perf.cagr10yr || 0, 
        cagr15: perf.cagr15yr || 0 
      };
    } catch {
      return { ticker, cagr5: 0, cagr10: 0, cagr15: 0 };
    }
  });

  const performances = await Promise.all(performancePromises);
  
  const cagr5yr = performances.reduce((sum, { ticker, cagr5 }) => {
    const weight = allocations[ticker] || 0;
    return sum + (weight * cagr5);
  }, 0);
  
  const cagr10yr = performances.reduce((sum, { ticker, cagr10 }) => {
    const weight = allocations[ticker] || 0;
    return sum + (weight * cagr10);
  }, 0);
  
  const cagr15yr = performances.reduce((sum, { ticker, cagr15 }) => {
    const weight = allocations[ticker] || 0;
    return sum + (weight * cagr15);
  }, 0);

  return { cagr5yr, cagr10yr, cagr15yr };
}

export default function AllocationChart({ funds, allocations }: AllocationChartProps) {
  const [yields, setYields] = useState<YieldData>({ cagr5yr: 0, cagr10yr: 0, cagr15yr: 0 });
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allocationsJson = JSON.stringify(allocations);

  useEffect(() => {
    const tickers = Object.keys(allocations);
    if (tickers.length === 0) {
      setYields({ cagr5yr: 0, cagr10yr: 0, cagr15yr: 0 });
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      fetchAllCagrs(allocations).then(y => {
        setYields(y);
        setLoading(false);
      });
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [funds, allocationsJson]);

  const selectedTickers = Object.keys(allocations);
  const selectedFunds = funds.filter(f => selectedTickers.includes(f.ticker));

  const pieData = selectedFunds.map(f => ({
    name: f.ticker,
    value: Math.round((allocations[f.ticker] || 0) * 100),
  })).filter(d => d.value > 0);

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
      <div className="flex-gap" style={{ marginTop: 10 }}>
        {pieData.map((item, i) => (
          <div key={item.name} style={{ color: COLORS[i % COLORS.length] }}>{item.name}: {item.value}%</div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <div><strong>Portfolio CAGR Yield:</strong></div>
        {loading ? (
          <div style={{ color: '#666' }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 5 }}>
            <div>5-Year: <strong>{(yields.cagr5yr * 100).toFixed(2)}%</strong></div>
            <div>10-Year: <strong>{(yields.cagr10yr * 100).toFixed(2)}%</strong></div>
            <div>15-Year: <strong>{(yields.cagr15yr * 100).toFixed(2)}%</strong></div>
          </div>
        )}
      </div>
    </div>
  );
}
