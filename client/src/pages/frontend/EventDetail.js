import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import './EventDetail.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const allEvents = await api.getEvents();
        
        const currentEvent = allEvents.find(item => item.id === parseInt(id));
        
        if (!currentEvent) {
          setTimeout(() => navigate('/events'), 2000);
          return;
        }
        
        setEvent(currentEvent);
        
        const related = allEvents
          .filter(item => 
            item.category === currentEvent.category && 
            item.id !== currentEvent.id
          )
          .slice(0, 3);
        
        setRelatedEvents(related);
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="event-detail">
        <div className="loader">
          <div className="spinner"></div>
          Loading...
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail">
        <div className="loader">Event not found</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/uploads')) return `${API_URL}${imageUrl}`;
    return imageUrl;
  };

  return (
    <div className="event-detail">
      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '24px' }}>
        <button className="back-btn" onClick={() => navigate('/events')}>
          ← Back to Events
        </button>

        <div className="event-detail__article">  
          {/* Header */}
          <div className="event-detail__header">
            <div className="event-detail__meta-top">
              <span className="event-detail__date">
                {formatDate(event.event_date)}
              </span>
              {event.category && (
                <span className="event-detail__category">{event.category}</span>
              )}
            </div>
            <h1 className="event-detail__title">{event.title}</h1>
          </div>

          {/* Featured Image */}
          {getImageUrl(event.image_url) && (
            <div className="event-detail__image-wrapper">
              <img 
                src={getImageUrl(event.image_url)} 
                alt={event.title}
                className="event-detail__image" 
              />
            </div>
          )}

          {/* Event Info */}
          <div className="event-detail__info">
            {event.event_time && (
              <div className="event-info-box">
                <span className="info-label">🕐 Time:</span>
                <span className="info-value">{event.event_time}</span>
              </div>
            )}
            {event.location && (
              <div className="event-info-box">
                <span className="info-label">📍 Location:</span>
                <span className="info-value">{event.location}</span>
              </div>
            )}
          </div>

          {/* Content */}
          {event.description && (
            <div className="event-detail__content">
              {event.description.split('\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          )}

          {/* Back Button */}
          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
            <button
              className="back-btn"
              onClick={() => {
                window.scrollTo(0, 0);
                navigate('/events');
              }}
            >
              ← Back to All Events
            </button>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="event-detail__related">
            <h2>Related Events</h2>
            <div className="related-events-grid">
              {relatedEvents.map(e => (
                <div
                  key={e.id}
                  className="related-event-card"
                  onClick={() => {
                    window.scrollTo(0, 0);
                    navigate(`/events/${e.id}`);
                  }}
                >
                  {getImageUrl(e.image_url) && (
                    <img 
                      src={getImageUrl(e.image_url)}
                      alt={e.title}
                      className="related-event-card__img"
                    />
                  )}
                  <div className="related-event-card__content">
                    <div className="related-event-card__date">
                      {formatDate(e.event_date)}
                    </div>
                    <h3 className="related-event-card__title">{e.title}</h3>
                    {e.location && (
                      <p className="related-event-card__location">{e.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
