import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import './NewsDetail.css';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const allNews = await api.getNews();
        
        const currentNews = allNews.find(item => item.id === parseInt(id));
        
        if (!currentNews) {
          setTimeout(() => navigate('/news'), 2000);
          return;
        }
        
        setNews(currentNews);
        
        const related = allNews
          .filter(item => 
            item.category === currentNews.category && 
            item.id !== currentNews.id
          )
          .slice(0, 3);
        
        setRelatedNews(related);
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="news-detail">
        <div className="loader">
          <div className="spinner"></div>
          Loading...
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="news-detail">
        <div className="loader">News item not found</div>
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

  return (
    <div className="news-detail">
      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '24px' }}>
        <button className="back-btn" onClick={() => navigate('/news')}>
          ← Back to Announcements
        </button>

        <div className="news-detail__article">
          {/* Header */}
          <div className="news-detail__header">
            <div className="news-detail__meta-top">
              <span className="news-detail__date">
                {formatDate(news.created_at)}
              </span>
              <span className="news-detail__category">{news.category}</span>
            </div>
            <h1 className="news-detail__title">{news.title}</h1>
            {news.excerpt && (
              <p className="news-detail__excerpt">{news.excerpt}</p>
            )}
          </div>

          {/* Featured Image */}
          {news.image_url && (
            <div className="news-detail__image-wrapper">
              <img 
                src={news.image_url} 
                alt={news.title}
                className="news-detail__image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
              <div className="image-overlay"></div>
            </div>
          )}

          {/* Content */}
          <div className="news-detail__content">
            <div className="news-content">
              {news.content ? news.content : <div className="news-content-empty">No content available</div>}
            </div>
          </div>

          {/* Footer Meta */}
          <div className="news-detail__footer">
            <div className="meta-item">
              <span className="meta-label">Published</span>
              <span className="meta-value">{formatDate(news.created_at)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{news.category}</span>
            </div>
            {news.updated_at && news.updated_at !== news.created_at && (
              <div className="meta-item">
                <span className="meta-label">Last Updated</span>
                <span className="meta-value">{formatDate(news.updated_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="news-detail__cta">
          <div className="cta-content">
            <h3>Have questions?</h3>
            <p>Get in touch with us for more information about this announcement</p>
          </div>
        </div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="news-detail__related">
            <h2 className="related-title">Related Announcements</h2>
            <div className="related-grid">
              {relatedNews.map((item, index) => (
                <div 
                  key={item.id} 
                  className="related-card"
                  onClick={() => navigate(`/news/${item.id}`)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.image_url && (
                    <div className="related-card__img-wrap">
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="related-card__img"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x160?text=No+Image';
                        }}
                      />
                    </div>
                  )}
                  <div className="related-card__body">
                    <h3 className="related-card__title">{item.title}</h3>
                    <div className="related-card__footer">
                      <span className="related-card__date">
                        {formatDate(item.created_at)}
                      </span>
                      <span className="related-card__arrow">→</span>
                    </div>
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

export default NewsDetail;
