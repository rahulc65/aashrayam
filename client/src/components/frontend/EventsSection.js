import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import './EventsSection.css';

const formatDate = (d) => {
  const date = new Date(d);
  return {
    day: date.toLocaleDateString('en-US', { day: '2-digit' }),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    year: date.getFullYear(),
  };
};

const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconPin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    api.getEvents().then(data => {
      setEvents(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(events.map(e => e.category).filter(Boolean))];
  const filtered = activeFilter === 'All' ? events : events.filter(e => e.category === activeFilter);
  const featured = filtered.find(e => e.is_featured);
  const regular = filtered.filter(e => !e.is_featured).slice(0, 5);

  return (
    <section className="events-section section" id="events">
      <div className="container">
        <div className="events-section__header">
          <div>
            <div className="section-label">Upcoming Events</div>
            <h2 className="section-title">What's Happening at Aashrayam</h2>
          </div>
          <div className="events-section__filters">
            {categories.map(c => (
              <button key={c}
                className={`news-section__filter ${activeFilter === c ? 'news-section__filter--active' : ''}`}
                onClick={() => setActiveFilter(c)}>{c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner"></div> Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="news-section__empty">No upcoming events. Check back soon!</div>
        ) : (
          <div className="events-section__layout">
            <div className="events-section__list">
              {regular.map((ev, i) => {
                const d = formatDate(ev.event_date);
                return (
                  <div className="event-row" key={ev.id} style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="event-row__date">
                      <div className="event-row__day">{d.day}</div>
                      <div className="event-row__month">{d.month}</div>
                    </div>
                    <div className="event-row__body">
                      {ev.category && <span className="badge badge-teal">{ev.category}</span>}
                      <h3 className="event-row__title">{ev.title}</h3>
                      <div className="event-row__meta">
                        {ev.event_time && (
                          <span><IconClock /> {ev.event_time}</span>
                        )}
                        {ev.location && (
                          <span><IconPin /> {ev.location}</span>
                        )}
                      </div>
                    </div>
                    <div className="event-row__arrow"><IconArrow /></div>
                  </div>
                );
              })}
            </div>

            {featured && (
              <div className="events-section__featured">
                <div className="event-featured">
                  {featured.image_url && (
                    <img src={featured.image_url} alt={featured.title} className="event-featured__img" />
                  )}
                  <div className="event-featured__overlay">
                    <div className="event-featured__tag">Featured Event</div>
                    <h3 className="event-featured__title">{featured.title}</h3>
                    {featured.description && (
                      <p className="event-featured__desc">{featured.description.substring(0, 120)}...</p>
                    )}
                    <div className="event-featured__info">
                      {featured.event_date && (
                        <span>
                          <IconCalendar />
                          {new Date(featured.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      )}
                      {featured.location && (
                        <span><IconPin /> {featured.location}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;