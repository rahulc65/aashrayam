import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import './NewsSection.css';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    api.getNews().then(data => {
      setNews(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(news.map(n => n.category).filter(Boolean))];
  const filtered = activeFilter === 'All' ? news : news.filter(n => n.category === activeFilter);

  return (
    <section className="news-section section" id="news">
      <div className="container">
        <div className="news-section__header">
          <div>
            <div className="section-label">Announcements & Notifications</div>
            <h2 className="section-title">Stay Updated</h2>
          </div>
          <div className="news-section__filters">
            {categories.map(c => (
              <button
                key={c}
                className={`news-section__filter ${activeFilter === c ? 'news-section__filter--active' : ''}`}
                onClick={() => setActiveFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner"></div> Loading news...</div>
        ) : filtered.length === 0 ? (
          <div className="news-section__empty">No announcements at the moment. Check back soon!</div>
        ) : (
          <div className="news-section__grid">
            {filtered.slice(0, 6).map((item, i) => (
              <article className="news-card" key={item.id} style={{ animationDelay: `${i * 0.07}s` }}>
                {item.image_url && (
                  <div className="news-card__img-wrap">
                    <img src={item.image_url} alt={item.title} className="news-card__img" />
                  </div>
                )}
                <div className="news-card__body">
                  <div className="news-card__meta">
                    {item.badge_text && (
                      <span className="badge" style={{ background: (item.badge_color || '#2D7D6F') + '20', color: item.badge_color || '#2D7D6F' }}>
                        {item.badge_text}
                      </span>
                    )}
                    <span className="news-card__date">{formatDate(item.created_at)}</span>
                  </div>
                  <h3 className="news-card__title">{item.title}</h3>
                  {item.excerpt && <p className="news-card__excerpt">{item.excerpt}</p>}
                  <span className="news-card__read">
                    <div>Read more</div>
                    <div>→</div>
                    </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
