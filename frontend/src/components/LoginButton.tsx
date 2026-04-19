import { Link } from 'react-router-dom';
import { logout } from '../api';

function isLoggedIn() {
  return !!localStorage.getItem('credentials');
}

export default function LoginButton() {
  const loggedIn = isLoggedIn();

  if (loggedIn) {
    return (
      <button
        onClick={() => { logout(); window.location.href = '/portfolio'; }}
        style={{ padding: '10px 20px', background: '#666', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
      >
        Logout
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <Link to="/login" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: 5 }}>
        Login
      </Link>
      <Link to="/register" style={{ padding: '10px 20px', background: '#16a34a', color: 'white', textDecoration: 'none', borderRadius: 5 }}>
        Register
      </Link>
    </div>
  );
}