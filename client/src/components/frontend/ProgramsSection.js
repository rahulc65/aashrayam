import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import './ProgramsSection.css';

const ProgramsSection = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPrograms().then(data => {
      setPrograms(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <section className="programs-section section" id="programs">
      <div className="container">
        <div className="programs-section__header">
          <div className="section-label">Our Programmes</div>
          <h2 className="section-title">Programmes Designed for<br />Real-World Readiness</h2>
          <p className="section-desc">
            Every programme at Orbit Education is designed with industry input, ensuring graduates are equipped with skills employers actually need.
          </p>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner"></div> Loading programmes...</div>
        ) : programs.length === 0 ? (
          <div className="news-section__empty">No programmes listed yet.</div>
        ) : (
          <div className="programs-section__grid">
            {programs.map((prog, i) => (
              <div className="program-card" key={prog.id} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="program-card__icon-wrap" style={{ background: (prog.color || '#2D7D6F') + '18' }}>
                  <span className="program-card__icon">{prog.icon || '📚'}</span>
                </div>
                <h3 className="program-card__title">{prog.title}</h3>
                {prog.duration && <div className="program-card__duration">⏱ {prog.duration}</div>}
                {prog.description && <p className="program-card__desc">{prog.description}</p>}
                {prog.features && prog.features.length > 0 && (
                  <ul className="program-card__features">
                    {prog.features.slice(0, 3).map((f, j) => (
                      <li key={j} className="program-card__feature">
                        <span style={{ color: prog.color || '#2D7D6F' }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="program-card__cta" style={{ color: prog.color || '#2D7D6F' }}>
                  Learn More →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProgramsSection;
