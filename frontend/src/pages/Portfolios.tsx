import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { Portfolio } from '../types';
import { fetchPortfolios, getStoredPortfolios, getUserId } from '../api';
import { isLoggedIn } from '../utils/auth';
import { calculatePortfolioYield } from '../utils/calculations';
import AuthButton from '../components/AuthButton';

type SortField = 'name' | 'cagr5' | 'cagr10' | 'cagr15';
type SortDirection = 'asc' | 'desc';

interface PortfolioWithCagr extends Portfolio {
  cagr5: number;
  cagr10: number;
  cagr15: number;
}

export default function Portfolios() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<PortfolioWithCagr[]>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = isLoggedIn();
    setLoading(true);

    const loadPortfolios = async (p: Portfolio[]) => {
      const withCagr: PortfolioWithCagr[] = await Promise.all(
        p.map(async (portfolio) => {
          let cagr5 = 0, cagr10 = 0, cagr15 = 0;
          try {
            const allocs = JSON.parse(portfolio.allocations);
            cagr5 = await calculatePortfolioYield(allocs, 5);
            cagr10 = await calculatePortfolioYield(allocs, 10);
            cagr15 = await calculatePortfolioYield(allocs, 15);
          } catch {
            // use default cagr
          }
          return { ...portfolio, cagr5, cagr10, cagr15 };
        })
      );
      setPortfolios(withCagr);
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
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [portfolios, sortField, sortDirection]);

  const handleRowClick = (portfolio: PortfolioWithCagr) => {
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
            <tr>
              <th
                onClick={() => handleSort('name')}
                style={{ cursor: 'pointer', textAlign: 'left' }}
              >
                Name{getSortIndicator('name')}
              </th>
              <th
                onClick={() => handleSort('cagr5')}
                style={{ cursor: 'pointer', textAlign: 'right' }}
              >
                CAGR 5yr{getSortIndicator('cagr5')}
              </th>
              <th
                onClick={() => handleSort('cagr10')}
                style={{ cursor: 'pointer', textAlign: 'right' }}
              >
                CAGR 10yr{getSortIndicator('cagr10')}
              </th>
              <th
                onClick={() => handleSort('cagr15')}
                style={{ cursor: 'pointer', textAlign: 'right' }}
              >
                CAGR 15yr{getSortIndicator('cagr15')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPortfolios.map((portfolio) => (
              <tr
                key={portfolio.id}
                onClick={() => handleRowClick(portfolio)}
                style={{ cursor: 'pointer' }}
              >
                <td>{portfolio.name}</td>
                <td style={{ textAlign: 'right' }}>{portfolio.cagr5.toFixed(2)}%</td>
                <td style={{ textAlign: 'right' }}>{portfolio.cagr10.toFixed(2)}%</td>
                <td style={{ textAlign: 'right' }}>{portfolio.cagr15.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}