import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import './ProgramsSection.css';

const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const IconDefault = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

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

        {/* ── Header — untouched ── */}
        <div className="programs-section__header">
          <div className="section-label">Our Programmes</div>
          <h2 className="section-title">Programmes Designed for<br />Real-World Readiness</h2>
          <p className="section-desc">
            Every programme at Aashrayam is designed with industry input, ensuring graduates
            are equipped with skills employers actually need.
          </p>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner"></div> Loading programmes...</div>
        ) : programs.length === 0 ? (
          <div className="news-section__empty">No programmes listed yet.</div>
        ) : (
          <div className="programs-section__grid">
            {programs.map((prog, i) => (
              <div
                className={`program-card${i === 0 ? ' program-card--featured' : ''}${prog.is_proposed ? ' program-card--proposed' : ''}`}
                key={prog.id}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {prog.is_proposed && (
                  <div className="program-card__proposed-badge">Proposed</div>
                )}

                <div className="program-card__icon-wrap">
                  <IconDefault />
                </div>

                {prog.subtitle && (
                  <div className="program-card__code">{prog.subtitle}</div>
                )}

                <h3 className="program-card__title">{prog.title}</h3>

                {prog.description && (
                  <p className="program-card__desc">{prog.description}</p>
                )}

                <div className="program-card__footer">
                  {prog.duration && (
                    <span className="program-card__tag">
                      <IconClock /> {prog.duration}
                    </span>
                  )}
                  <div className="program-card__arrow">
                    <IconArrow />
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

export default ProgramsSection;