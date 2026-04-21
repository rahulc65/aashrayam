import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import './NewsListing.css';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const NewsListing = () => {
  const navigate = useNavigate();
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    api.getNews().then(data => {
      setAllNews(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(allNews.map(n => n.category).filter(Boolean))];

  // Filter by category and search
  const filtered = allNews.filter(item => {
    const matchCategory = activeFilter === 'All' || item.category === activeFilter;
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (item.excerpt && item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  const handleFilterChange = (category) => {
    setActiveFilter(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <section className="news-listing section">
      <div className="container">
        {/* Header */}
        <div className="news-listing__header">
          <div>
            <div className="section-label">Complete Repository</div>
            <h1 className="news-listing__title">News & Announcements</h1>
            <p className="section-desc">Stay informed with the latest updates, notices, and announcements from our institution.</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="news-listing__controls">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search announcements..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="filter-wrapper">
            <div className="filter-label">Filter by:</div>
            <div className="news-listing__filters">
              {categories.map(c => (
                <button
                  key={c}
                  className={`filter-btn ${activeFilter === c ? 'filter-btn--active' : ''}`}
                  onClick={() => handleFilterChange(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Status */}
        {searchTerm && (
          <div className="search-status">
            Found <strong>{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''} for "<strong>{searchTerm}</strong>"
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="loader"><div className="spinner"></div> Loading announcements...</div>
        ) : filtered.length === 0 ? (
          <div className="news-listing__empty">
            <div className="empty-icon">📋</div>
            <h3>No announcements found</h3>
            <p>{searchTerm ? 'Try adjusting your search terms.' : 'Check back soon for updates!'}</p>
          </div>
        ) : (
          <>
            <div className="news-listing__grid">
              {paginatedItems.map((item, idx) => (
                <article
                  className="news-card-large"
                  key={item.id}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {item.image_url && (
                    <div className="news-card-large__img-wrap">
                      <img src={item.image_url} alt={item.title} className="news-card-large__img" />
                      <div className="news-card-large__overlay" onClick={() => navigate(`/news/${item.id}`)}>
                        <button className="overlay-btn">View Details</button>
                      </div>
                    </div>
                  )}
                  <div className="news-card-large__body">
                    <div className="news-card-large__meta">
                      {item.badge_text && (
                        <span className="badge" style={{ background: (item.badge_color || '#2D7D6F') + '20', color: item.badge_color || '#2D7D6F' }}>
                          {item.badge_text}
                        </span>
                      )}
                      <span className="news-card-large__date">{formatDate(item.created_at)}</span>
                    </div>
                    <h3 className="news-card-large__title">{item.title}</h3>
                    {item.excerpt && <p className="news-card-large__excerpt">{item.excerpt}</p>}
                    <button
                      className="read-more-link"
                      onClick={() => { 
                      window.scrollTo(0, 0);
                      navigate(`/news/${item.id}`)}}
                      >
                      Read Full Article
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination__btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ← Previous
                </button>
                <div className="pagination__info">
                  Page <span>{currentPage}</span> of <span>{totalPages}</span>
                </div>
                <button
                  className="pagination__btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default NewsListing;
