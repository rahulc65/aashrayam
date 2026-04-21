import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import './AdminLogin.css';

const AashrayamLogo = () => (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <polygon points="40,4 62,18 40,32 18,18" fill="currentColor"/>
    <path d="M29,20 Q40,28 40,28 Q40,28 51,20 L51,30 Q40,38 40,38 Q40,38 29,30 Z" fill="white" opacity="0.85"/>
    <polygon points="40,36 68,50 40,64 12,50" fill="currentColor" opacity="0.7"/>
    <polygon points="22,62 34,68 22,74 10,68" fill="currentColor" opacity="0.45"/>
    <polygon points="58,62 70,68 58,74 46,68" fill="currentColor" opacity="0.45"/>
  </svg>
);

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate('/admin/dashboard');
    else setError(result.error || 'Login failed. Check your credentials.');
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">
          <div className="admin-login__logo-icon">
            <AashrayamLogo />
          </div>
          <div>
            <div className="admin-login__logo-name">Aashrayam</div>
            <div className="admin-login__logo-tag">Admin Panel</div>
          </div>
        </div>

        <h1 className="admin-login__title">Welcome Back</h1>
        <p className="admin-login__sub">Sign in to manage your website content</p>

        {error && <div className="admin-login__error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="admin@orbitedu.com" required
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" required
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary admin-login__btn" disabled={loading}>
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
