import { Link } from 'react-router-dom';

interface AuthFormProps {
  title: string;
  buttonText: string;
  buttonColor: string;
  linkTo?: { label: string; href: string; text: string };
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
  error: string;
}

const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 5, fontSize: 16 };
const labelStyle = { display: 'block', marginBottom: 5 };

export default function AuthForm({ title, buttonText, buttonColor, linkTo, onSubmit, loading, error }: AuthFormProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{ background: 'white', padding: 40, borderRadius: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: 350 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 30, fontSize: 24 }}>{title}</h1>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Username</label>
            <input name="username" required minLength={3} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Password</label>
            <input name="password" type="password" required minLength={4} style={inputStyle} />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 15 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: buttonColor, color: 'white', border: 'none', borderRadius: 5, fontSize: 16, cursor: 'pointer' }}>
            {loading ? 'Please wait...' : buttonText}
          </button>
        </form>
        {linkTo && (
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            {linkTo.label} <Link to={linkTo.href} style={{ color: '#2563eb' }}>{linkTo.text}</Link>
          </div>
        )}
      </div>
    </div>
  );
}