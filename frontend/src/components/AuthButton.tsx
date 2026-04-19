import { Link } from 'react-router-dom';
import { logout } from '../api';

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export default function AuthButton() {
  const loggedIn = isLoggedIn();

  if (loggedIn) {
    return (
      <button
        onClick={() => { logout(); window.location.href = '/portfolio'; }}
        className="btn"
      >
        Logout
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <Link to="/login" className="btn">
        Login
      </Link>
      <Link to="/register" className="btn">
        Register
      </Link>
    </div>
  );
}