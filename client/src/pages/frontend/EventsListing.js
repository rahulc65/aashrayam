import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import './EventsListing.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
const formatTime = (time) => time || '';

const EventsListing = () => {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    api.getEvents().then(data => {
      setAllEvents(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(allEvents.map(e => e.category).filter(Boolean))];

  // Filter by category and search
  const filtered = allEvents.filter(item => {
    const matchCategory = activeFilter === 'All' || item.category === activeFilter;
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                       (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()));
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

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/uploads')) return `${API_URL}${imageUrl}`;
    return imageUrl;
  };

  return (
    <section className="events-listing section">
      <div className="container">
        {/* Header */}
        <div className="events-listing__header">
          <div>
            <div className="section-label">Calendar & Activities</div>
            <h1 className="events-listing__title">Events & Activities</h1>
            <p className="section-desc">Discover upcoming campus events, seminars, workshops, and activities that enrich your educational experience.</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="events-listing__controls">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search events..."
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
            <div className="events-listing__filters">
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
          <div className="loader"><div className="spinner"></div> Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="events-listing__empty">
            <div className="empty-icon">📅</div>
            <h3>No events found</h3>
            <p>{searchTerm ? 'Try adjusting your search terms.' : 'Check back soon for upcoming events!'}</p>
          </div>
        ) : (
          <>
            <div className="events-listing__grid">
              {paginatedItems.map((item, idx) => (
                <article
                  className="event-card-large"
                  key={item.id}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {getImageUrl(item.image_url) && (
                    <div className="event-card-large__img-wrap">
                      <img 
                        src={getImageUrl(item.image_url)} 
                        alt={item.title} 
                        className="event-card-large__img" 
                      />
                      <div className="event-card-large__overlay" onClick={() => navigate(`/events/${item.id}`)}>
                        <button className="overlay-btn">View Details</button>
                      </div>
                    </div>
                  )}
                  <div className="event-card-large__body">
                    <div className="event-card-large__meta">
                      {item.category && (
                        <span className="badge" style={{ background: '#2D7D6F20', color: '#2D7D6F' }}>
                          {item.category}
                        </span>
                      )}
                      <span className="event-card-large__date">{formatDate(item.event_date)}</span>
                    </div>
                    <h3 className="event-card-large__title">{item.title}</h3>
                    {item.location && (
                      <p className="event-card-large__location">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.location}
                      </p>
                    )}
                    {item.description && <p className="event-card-large__excerpt">{item.description.substring(0, 120)}...</p>}
                    <button
                      className="read-more-link"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(`/events/${item.id}`);
                      }}
                    >
                      View Details
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
                  className="pagination-btn"
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
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

export default EventsListing;
