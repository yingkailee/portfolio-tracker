import { useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem('credentials')) {
    return <Navigate to="/portfolio" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const credentials = btoa(`${username}:${password}`);
      console.log('Testing with credentials:', credentials);
      
      const res = await fetch('http://localhost:8080/api/funds', {
        headers: { 
          'Authorization': `Basic ${credentials}`,
        },
        cache: 'no-store',
      });

      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);

      if (res.ok) {
        localStorage.setItem('credentials', credentials);
        window.location.href = '/portfolio';
      } else {
        setError('Invalid username or password');
      }
    } catch {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{ background: 'white', padding: 40, borderRadius: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: 350 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 30, fontSize: 24 }}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>Username</label>
            <input name="username" required style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 5, fontSize: 16 }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>Password</label>
            <input name="password" type="password" required style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 5, fontSize: 16 }} />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 15 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: '#2563eb', color: 'white', border: 'none', borderRadius: 5, fontSize: 16, cursor: 'pointer' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}