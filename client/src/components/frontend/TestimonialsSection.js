import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import './TestimonialsSection.css';

const Stars = ({ count = 5 }) => '★'.repeat(count) + '☆'.repeat(5 - count);

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTestimonials().then(data => {
      setTestimonials(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <section className="testimonials-section section" id="testimonials">
      <div className="container">
        <div className="testimonials-section__header">
          <div className="section-label">Trusted by Students & Parents</div>
          <h2 className="section-title">What Our Community Says</h2>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner"></div> Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="news-section__empty">No testimonials yet.</div>
        ) : (
          <div className="testimonials-section__grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={t.id} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="testimonial-card__stars">{Stars(t.rating || 5)}</div>
                <p className="testimonial-card__content">"{t.content}"</p>
                <div className="testimonial-card__author">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.name} className="testimonial-card__avatar" />
                  ) : (
                    <div className="testimonial-card__avatar testimonial-card__avatar--initials">
                      {t.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    {t.role && <div className="testimonial-card__role">{t.role}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
