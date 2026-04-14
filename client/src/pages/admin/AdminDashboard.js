import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminDashboard.css';

const StatCard = ({ icon, label, value, to, color }) => (
  <Link to={to} className="stat-card" style={{ '--accent-color': color }}>
    <div className="stat-card__icon" style={{ background: color + '18' }}>{icon}</div>
    <div className="stat-card__val">{value ?? '—'}</div>
    <div className="stat-card__label">{label}</div>
    <div className="stat-card__arrow">→</div>
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
    { icon: '📰', label: 'News & Notices', key: 'news', to: '/admin/news', color: '#2D7D6F' },
    { icon: '📅', label: 'Events', key: 'events', to: '/admin/events', color: '#7c3aed' },
    { icon: '🎓', label: 'Programmes', key: 'programs', to: '/admin/programs', color: '#0284c7' },
    { icon: '🖼️', label: 'Gallery Images', key: 'gallery', to: '/admin/gallery', color: '#d97706' },
    { icon: '💬', label: 'Testimonials', key: 'testimonials', to: '/admin/testimonials', color: '#dc2626' },
  ];

  const quickLinks = [
    { to: '/admin/news', label: 'Add News', icon: '➕' },
    { to: '/admin/events', label: 'Add Event', icon: '📅' },
    { to: '/admin/programs', label: 'Add Programme', icon: '🎓' },
    { to: '/admin/gallery', label: 'Add Gallery Image', icon: '🖼️' },
    { to: '/', label: 'View Website', icon: '🌐' },
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
              {[
                { icon: '1️⃣', text: 'Add your programmes in the Programmes section' },
                { icon: '2️⃣', text: 'Upload gallery images to showcase campus life' },
                { icon: '3️⃣', text: 'Post news & announcements for students' },
                { icon: '4️⃣', text: 'Add upcoming events to keep students informed' },
                { icon: '5️⃣', text: 'Collect and add student testimonials for credibility' },
              ].map((tip, i) => (
                <div key={i} className="admin-dashboard__tip">
                  <span>{tip.icon}</span>
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
