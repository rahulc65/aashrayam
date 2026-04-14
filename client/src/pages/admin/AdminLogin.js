import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AdminLogin.css';

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
          <div className="admin-login__logo-icon">⬡</div>
          <div>
            <div className="admin-login__logo-name">Orbit Education</div>
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

        <div className="admin-login__setup-hint">
          First time? Visit <code>/health</code> on your API, then use the SQL setup from the README to create your admin account.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
