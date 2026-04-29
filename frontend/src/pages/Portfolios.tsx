import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { Portfolio } from '../types';
import { fetchPortfolios, getStoredPortfolios, getUserId } from '../api';
import { isLoggedIn } from '../utils/auth';
import { calculatePortfolioYield, calculatePortfolioVolatility, calculatePortfolioSharpe } from '../utils/calculations';
import AuthButton from '../components/AuthButton';

type SortField = 'name' | 'cagr5' | 'cagr10' | 'cagr15' | 'vol5' | 'vol10' | 'vol15' | 'sharpe5' | 'sharpe10' | 'sharpe15';
type SortDirection = 'asc' | 'desc';

interface PortfolioWithMetrics extends Portfolio {
  cagr5: number;
  cagr10: number;
  cagr15: number;
  vol5: number;
  vol10: number;
  vol15: number;
  sharpe5: number;
  sharpe10: number;
  sharpe15: number;
}

export default function Portfolios() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<PortfolioWithMetrics[]>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = isLoggedIn();
    setLoading(true);

    const loadPortfolios = async (p: Portfolio[]) => {
      const withMetrics: PortfolioWithMetrics[] = await Promise.all(
        p.map(async (portfolio) => {
          let cagr5 = 0, cagr10 = 0, cagr15 = 0;
          let vol5 = 0, vol10 = 0, vol15 = 0;
          let sharpe5 = 0, sharpe10 = 0, sharpe15 = 0;
          try {
            const allocs = JSON.parse(portfolio.allocations);
            cagr5 = await calculatePortfolioYield(allocs, 5);
            cagr10 = await calculatePortfolioYield(allocs, 10);
            cagr15 = await calculatePortfolioYield(allocs, 15);
            vol5 = await calculatePortfolioVolatility(allocs, 5);
            vol10 = await calculatePortfolioVolatility(allocs, 10);
            vol15 = await calculatePortfolioVolatility(allocs, 15);
            sharpe5 = await calculatePortfolioSharpe(allocs, 5);
            sharpe10 = await calculatePortfolioSharpe(allocs, 10);
            sharpe15 = await calculatePortfolioSharpe(allocs, 15);
          } catch {
            // use default values
          }
          return { ...portfolio, cagr5, cagr10, cagr15, vol5, vol10, vol15, sharpe5, sharpe10, sharpe15 };
        })
      );
      setPortfolios(withMetrics);
      setLoading(false);
    };

    if (loggedIn) {
      fetchPortfolios(getUserId()!)
        .then(loadPortfolios)
        .catch(() => setLoading(false));
    } else {
      loadPortfolios(getStoredPortfolios());
    }
  }, []);

  const sortedPortfolios = useMemo(() => {
    return [...portfolios].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortField === 'cagr5') {
        cmp = a.cagr5 - b.cagr5;
      } else if (sortField === 'cagr10') {
        cmp = a.cagr10 - b.cagr10;
      } else if (sortField === 'cagr15') {
        cmp = a.cagr15 - b.cagr15;
      } else if (sortField === 'vol5') {
        cmp = a.vol5 - b.vol5;
      } else if (sortField === 'vol10') {
        cmp = a.vol10 - b.vol10;
      } else if (sortField === 'vol15') {
        cmp = a.vol15 - b.vol15;
      } else if (sortField === 'sharpe5') {
        cmp = a.sharpe5 - b.sharpe5;
      } else if (sortField === 'sharpe10') {
        cmp = a.sharpe10 - b.sharpe10;
      } else if (sortField === 'sharpe15') {
        cmp = a.sharpe15 - b.sharpe15;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [portfolios, sortField, sortDirection]);

  const handleRowClick = (portfolio: PortfolioWithMetrics) => {
    localStorage.setItem('selectedPortfolioId', String(portfolio.id));
    navigate('/portfolio');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return '';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="container">
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <div className="flex-gap">
          <h1>Portfolios</h1>
        </div>
        <div className="flex-gap">
          <Link to="/portfolio" className="btn">Allocation →</Link>
          <Link to="/calculator" className="btn">Calculator →</Link>
          <AuthButton />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 20 }}>Loading...</div>
      ) : (
        <table className="table" style={{ width: '100%' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
              <th
                onClick={() => handleSort('name')}
                style={{ cursor: 'pointer', textAlign: 'left', padding: '12px 8px', borderRight: '1px solid #ddd' }}
              >
                Name{getSortIndicator('name')}
              </th>
              <th
                onClick={() => handleSort('cagr5')}
                style={{ cursor: 'pointer', textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd' }}
              >
                CAGR 5yr{getSortIndicator('cagr5')}
              </th>
              <th
                onClick={() => handleSort('cagr10')}
                style={{ cursor: 'pointer', textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd' }}
              >
                CAGR 10yr{getSortIndicator('cagr10')}
              </th>
              <th
                onClick={() => handleSort('cagr15')}
                style={{ cursor: 'pointer', textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd' }}
              >
                CAGR 15yr{getSortIndicator('cagr15')}
              </th>
              <th
                onClick={() => handleSort('vol5')}
                style={{ cursor: 'pointer', textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd' }}
              >
                Vol 5yr{getSortIndicator('vol5')}
              </th>
              <th
                onClick={() => handleSort('vol10')}
                style={{ cursor: 'pointer', textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd' }}
              >
                Vol 10yr{getSortIndicator('vol10')}
              </th>
              <th
                onClick={() => handleSort('vol15')}
                style={{ cursor: 'pointer', textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd' }}
              >
                Vol 15yr{getSortIndicator('vol15')}
              </th>
              <th
                onClick={() => handleSort('sharpe5')}
                style={{ cursor: 'pointer', textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd' }}
              >
                Sharpe 5yr{getSortIndicator('sharpe5')}
              </th>
              <th
                onClick={() => handleSort('sharpe10')}
                style={{ cursor: 'pointer', textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd' }}
              >
                Sharpe 10yr{getSortIndicator('sharpe10')}
              </th>
              <th
                onClick={() => handleSort('sharpe15')}
                style={{ cursor: 'pointer', textAlign: 'right', padding: '12px 8px' }}
              >
                Sharpe 15yr{getSortIndicator('sharpe15')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPortfolios.map((portfolio) => (
              <tr
                key={portfolio.id}
                onClick={() => handleRowClick(portfolio)}
                style={{ cursor: 'pointer', borderBottom: '1px solid #eee', background: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <td style={{ padding: '12px 8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ccc' }}>{portfolio.name}</td>
                <td style={{ textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ccc' }}>{portfolio.cagr5.toFixed(2)}%</td>
                <td style={{ textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ccc' }}>{portfolio.cagr10.toFixed(2)}%</td>
                <td style={{ textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ccc' }}>{portfolio.cagr15.toFixed(2)}%</td>
                <td style={{ textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ccc' }}>{portfolio.vol5.toFixed(2)}%</td>
                <td style={{ textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ccc' }}>{portfolio.vol10.toFixed(2)}%</td>
                <td style={{ textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ccc' }}>{portfolio.vol15.toFixed(2)}%</td>
                <td style={{ textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ccc' }}>{portfolio.sharpe5.toFixed(2)}</td>
                <td style={{ textAlign: 'right', padding: '12px 8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ccc' }}>{portfolio.sharpe10.toFixed(2)}</td>
                <td style={{ textAlign: 'right', padding: '12px 8px' }}>{portfolio.sharpe15.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}