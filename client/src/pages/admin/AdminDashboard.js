import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminDashboard.css';

const IconNews = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="12" y2="18" />
  </svg>
);

const IconEvents = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const IconGallery = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const IconTestimonials = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    <line x1="9" y1="10" x2="15" y2="10" />
    <line x1="9" y1="14" x2="13" y2="14" />
  </svg>
);

const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const StatCard = ({ icon, label, value, to, color }) => (
  <Link to={to} className="stat-card" style={{ '--accent-color': color }}>
    <div className="stat-card__icon" style={{ background: color + '18', color }}>{icon}</div>
    <div className="stat-card__val">{value ?? '—'}</div>
    <div className="stat-card__label">{label}</div>
    <div className="stat-card__arrow"><IconArrow /></div>
  </Link>
);

const AdminDashboard = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.getAllNews(),
      api.getAllEvents(),
      api.getAllPrograms(),
      api.getAllGallery(),
      api.getAllTestimonials(),
    ]).then(([news, events, programs, gallery, testimonials]) => {
      setCounts({
        news: news.value?.length ?? 0,
        events: events.value?.length ?? 0,
        programs: programs.value?.length ?? 0,
        gallery: gallery.value?.length ?? 0,
        testimonials: testimonials.value?.length ?? 0,
      });
      setLoading(false);
    });
  }, []);

  const stats = [
    { icon: <IconNews />, label: 'News & Notices', key: 'news', to: '/admin/news', color: '#2D7D6F' },
    { icon: <IconEvents />, label: 'Events', key: 'events', to: '/admin/events', color: '#7c3aed' },
    { icon: <IconPrograms />, label: 'Programmes', key: 'programs', to: '/admin/programs', color: '#0284c7' },
    { icon: <IconGallery />, label: 'Gallery Images', key: 'gallery', to: '/admin/gallery', color: '#d97706' },
    { icon: <IconTestimonials />, label: 'Testimonials', key: 'testimonials', to: '/admin/testimonials', color: '#dc2626' },
  ];

  const quickLinks = [
    { to: '/admin/news', label: 'Add News', icon: <IconPlus /> },
    { to: '/admin/events', label: 'Add Event', icon: <IconEvents /> },
    { to: '/admin/programs', label: 'Add Programme', icon: <IconPrograms /> },
    { to: '/admin/gallery', label: 'Add Gallery Image', icon: <IconGallery /> },
    { to: '/', label: 'View Website', icon: <IconGlobe /> },
  ];

  const tips = [
    { step: '01', text: 'Add your programmes in the Programmes section' },
    { step: '02', text: 'Upload gallery images to showcase campus life' },
    { step: '03', text: 'Post news & announcements for students' },
    { step: '04', text: 'Add upcoming events to keep students informed' },
    { step: '05', text: 'Collect and add student testimonials for credibility' },
  ];

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="admin-dashboard__welcome">
          <h2 className="admin-dashboard__title">Dashboard Overview</h2>
          <p className="admin-dashboard__sub">Manage all your website content from one place.</p>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner"></div> Loading stats...</div>
        ) : (
          <div className="admin-dashboard__stats">
            {stats.map(s => (
              <StatCard key={s.key} icon={s.icon} label={s.label}
                value={counts[s.key]} to={s.to} color={s.color} />
            ))}
          </div>
        )}

        <div className="admin-dashboard__bottom">
          <div className="admin-dashboard__quicklinks">
            <h3 className="admin-dashboard__section-title">Quick Actions</h3>
            <div className="admin-dashboard__ql-grid">
              {quickLinks.map(l => (
                <Link key={l.to} to={l.to} className="admin-ql-btn">
                  <span className="admin-ql-btn__icon">{l.icon}</span>
                  <span>{l.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="admin-dashboard__tips">
            <h3 className="admin-dashboard__section-title">Getting Started</h3>
            <div className="admin-dashboard__tip-list">
              {tips.map((tip, i) => (
                <div key={i} className="admin-dashboard__tip">
                  <span className="admin-dashboard__tip-step">{tip.step}</span>
                  <span>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;