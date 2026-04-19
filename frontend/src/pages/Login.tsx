import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { setUserId } from '../api';

export default function Login() {
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

    try {
      const credentials = btoa(`${username}:${password}`);

      const res = await fetch('http://localhost:8080/api/me', {
        headers: { 'Authorization': `Basic ${credentials}` },
      });

      if (res.ok) {
        localStorage.setItem('credentials', credentials);
        const data = await res.json();
        setUserId(data.userId);
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
    <AuthForm
      title="Login"
      buttonText="Login"
      buttonColor="#2563eb"
      linkTo={{ label: "Don't have an account? ", href: '/register', text: 'Register' }}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}