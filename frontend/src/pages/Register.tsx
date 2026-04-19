import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem('credentials')) {
    window.location.href = '/portfolio';
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const credentials = btoa(`${username}:${password}`);
        localStorage.setItem('credentials', credentials);
        window.location.href = '/portfolio';
      } else {
        const data = await res.json();
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{ background: 'white', padding: 40, borderRadius: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: 350 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 30, fontSize: 24 }}>Register</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>Username</label>
            <input name="username" required minLength={3} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 5, fontSize: 16 }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>Password</label>
            <input name="password" type="password" required minLength={4} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 5, fontSize: 16 }} />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 15 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: '#16a34a', color: 'white', border: 'none', borderRadius: 5, fontSize: 16, cursor: 'pointer' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb' }}>Login</Link>
        </div>
      </div>
    </div>
  );
}