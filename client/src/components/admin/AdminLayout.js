import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AdminLayout.css';

const navItems = [
  { to: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/admin/news', icon: '📰', label: 'News & Notices' },
  { to: '/admin/events', icon: '📅', label: 'Events' },
  { to: '/admin/programs', icon: '🎓', label: 'Programmes' },
  { to: '/admin/gallery', icon: '🖼️', label: 'Gallery' },
  { to: '/admin/testimonials', icon: '💬', label: 'Testimonials' },
];

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className={`admin-layout ${collapsed ? 'admin-layout--collapsed' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <div className="admin-sidebar__logo-icon">⬡</div>
            {!collapsed && <div className="admin-sidebar__logo-text">
              <div className="admin-sidebar__logo-name">Orbit</div>
              <div className="admin-sidebar__logo-tag">Admin Panel</div>
            </div>}
          </div>
          <button className="admin-sidebar__toggle" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map(item => (
            <Link key={item.to} to={item.to}
              className={`admin-sidebar__link ${location.pathname === item.to ? 'admin-sidebar__link--active' : ''}`}>
              <span className="admin-sidebar__link-icon">{item.icon}</span>
              {!collapsed && <span className="admin-sidebar__link-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" target="_blank" className="admin-sidebar__view-site">
            <span>🌐</span>
            {!collapsed && <span>View Website</span>}
          </Link>
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <span>🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__title">
            {navItems.find(n => n.to === location.pathname)?.label || 'Dashboard'}
          </div>
          <div className="admin-topbar__user">
            <div className="admin-topbar__avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="admin-topbar__name">{user?.name || 'Admin'}</div>
              <div className="admin-topbar__role">{user?.role || 'Administrator'}</div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
