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

const IconUsers = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const IconDollar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

const ProgramsSection = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);

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
          <div className="programs-grid-section" onMouseLeave={() => setFeaturedIndex(0)}>
            {programs.map((prog, i) => (
              <div
                className={`program-card${featuredIndex === i ? ' program-card--featured' : ''}${prog.is_proposed ? ' program-card--proposed' : ''}`}
                key={prog.id}
                style={{ animationDelay: `${i * 0.08}s` }}
                onMouseEnter={() => setFeaturedIndex(i)}
              >
                {prog.is_proposed && (
                  <div className="program-card__proposed-badge">Proposed</div>
                )}

                {/* Program Index Number */}
                <div className='program-head'>

                <div className="program-card__number">
                  {String(i + 1).padStart(2, '0')}
                </div>

               {/* Tags Section */}
                {prog.tags && prog.tags.length > 0 && (
                  <div className="program-card__tags">
                    {prog.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} className="program-card__tag-pill">{tag}</span>
                    ))}
                  </div>
                )}

                </div>

                <h3 className="program-card__title">{prog.title}</h3>

                {prog.description && (
                  <p className="program-card__desc">{prog.description}</p>
                )}

                {/* Fees Section */}
                {(prog.normal_fee || prog.addon_fee) && (
                  <div className="program-card__fees">
                    {prog.normal_fee && (
                      <div className="program-card__fee-item">
                        <span className="program-card__fee-label">Normal Fee</span>
                        <span className="program-card__fee-value">{prog.normal_fee}</span>
                      </div>
                    )}
                    {prog.addon_fee && (
                      <div className="program-card__fee-item">
                        <span className="program-card__fee-label">Add-on Fee</span>
                        <span className="program-card__fee-value">{prog.addon_fee}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Add-on Courses Section */}
                {prog.addon_courses && prog.addon_courses.length > 0 && (
                  <div className="program-card__addons">
                    <div className="program-card__addon-title">Add-on Courses:</div>
                    <ul className="program-card__addon-list">
                      {prog.addon_courses.map((course, courseIdx) => (
                        <li key={courseIdx}>{course}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer Info */}
                <div className="program-card__footer">
                  <div className="program-card__footer-items">
                    {prog.duration && (
                      <span className="program-card__footer-item">
                        <IconClock /> {prog.duration}
                      </span>
                    )}
                    {prog.seats && (
                      <span className="program-card__footer-item">
                        <IconUsers /> {prog.seats} seats
                      </span>
                    )}
                  </div>
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
