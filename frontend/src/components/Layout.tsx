import { Link, useLocation } from 'react-router-dom';
import AuthButton from './AuthButton';

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 24px',
  borderBottom: '1px solid #ddd',
  background: '#fafafa',
};

const navCenterStyle = {
  position: 'absolute' as const,
  left: '50%',
  transform: 'translateX(-50%)',
};

const linksStyle = {
  display: 'flex',
  gap: '12px',
};

const linkStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '8px 16px',
  textDecoration: 'none',
  borderRadius: 5,
  background: isActive ? '#333' : '#eee',
  color: isActive ? '#fff' : '#333',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const path = location.pathname;

  const isPortfolios = path === '/portfolios';
  const isPortfolio = path === '/portfolio';
  const isCalculator = path === '/calculator';

  return (
    <>
      <nav style={{ ...navStyle, position: 'relative' }}>
        <div style={{ width: 80 }} />
        <div style={{ ...linksStyle, ...navCenterStyle }}>
          <Link to="/portfolios" style={linkStyle(isPortfolios)}>
            Portfolios
          </Link>
          <Link to="/portfolio" style={linkStyle(isPortfolio)}>
            Allocation
          </Link>
          <Link to="/calculator" style={linkStyle(isCalculator)}>
            Calculator
          </Link>
        </div>
        <AuthButton />
      </nav>
      {children}
    </>
  );
}