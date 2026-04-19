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

export default function AuthForm({ title, buttonText, buttonColor, linkTo, onSubmit, loading, error }: AuthFormProps) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{title}</h1>
        <form onSubmit={onSubmit}>
          <div>
            <label className="auth-label">Username</label>
            <input name="username" required minLength={3} className="auth-input" />
          </div>
          <div>
            <label className="auth-label">Password</label>
            <input name="password" type="password" required minLength={4} className="auth-input" />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" disabled={loading} className="auth-submit" style={{ background: buttonColor }}>
            {loading ? 'Please wait...' : buttonText}
          </button>
        </form>
        {linkTo && (
          <div className="auth-link">
            {linkTo.label} <Link to={linkTo.href} className="link">{linkTo.text}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
