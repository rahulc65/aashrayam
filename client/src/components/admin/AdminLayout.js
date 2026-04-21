import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AdminLayout.css';

const AashrayamLogo = () => (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <polygon points="40,4 62,18 40,32 18,18" fill="currentColor" />
    <path d="M29,20 Q40,28 40,28 Q40,28 51,20 L51,30 Q40,38 40,38 Q40,38 29,30 Z" fill="white" opacity="0.85" />
    <polygon points="40,36 68,50 40,64 12,50" fill="currentColor" opacity="0.7" />
    <polygon points="22,62 34,68 22,74 10,68" fill="currentColor" opacity="0.45" />
    <polygon points="58,62 70,68 58,74 46,68" fill="currentColor" opacity="0.45" />
  </svg>
);

const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconNews = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="12" y2="18" />
  </svg>
);

const IconEvents = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="8" y1="14" x2="8.01" y2="14" />
    <line x1="12" y1="14" x2="12.01" y2="14" />
    <line x1="16" y1="14" x2="16.01" y2="14" />
  </svg>
);

const IconPrograms = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const IconGallery = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const IconTestimonials = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    <line x1="9" y1="10" x2="15" y2="10" />
    <line x1="9" y1="14" x2="13" y2="14" />
  </svg>
);

const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconCollapse = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconExpand = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const navItems = [
  { to: '/admin/dashboard', icon: <IconDashboard />, label: 'Dashboard' },
  { to: '/admin/news', icon: <IconNews />, label: 'News & Notices' },
  { to: '/admin/events', icon: <IconEvents />, label: 'Events' },
  { to: '/admin/programs', icon: <IconPrograms />, label: 'Programmes' },
  { to: '/admin/gallery', icon: <IconGallery />, label: 'Gallery' },
  { to: '/admin/testimonials', icon: <IconTestimonials />, label: 'Testimonials' },
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
            <div className="admin-login__logo-icon">
              <AashrayamLogo />
            </div>
            {!collapsed && (
              <div className="admin-sidebar__logo-text">
                <div className="admin-sidebar__logo-name">Aashrayam</div>
                <div className="admin-sidebar__logo-tag">Admin Panel</div>
              </div>
            )}
          </div>
          <button className="admin-sidebar__toggle" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <IconExpand /> : <IconCollapse />}
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-sidebar__link ${location.pathname === item.to ? 'admin-sidebar__link--active' : ''}`}
            >
              <span className="admin-sidebar__link-icon">{item.icon}</span>
              {!collapsed && <span className="admin-sidebar__link-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" target="_blank" className="admin-sidebar__view-site">
            <span><IconGlobe /></span>
            {!collapsed && <span>View Website</span>}
          </Link>
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <span><IconLogout /></span>
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