import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { setUserId } from '../api';

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
        const data = await res.json();
        const credentials = btoa(`${username}:${password}`);
        localStorage.setItem('credentials', credentials);
        setUserId(data.userId);
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
    <AuthForm
      title="Register"
      buttonText="Create Account"
      buttonColor="#16a34a"
      linkTo={{ label: 'Already have an account? ', href: '/login', text: 'Login' }}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}