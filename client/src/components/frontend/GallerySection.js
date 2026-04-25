import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import './GallerySection.css';

// ── FIX: resolve relative /uploads/ paths to the full backend URL ──────────
const SERVER_URL = (process.env.REACT_APP_API_URL || 'http://localhost:4000/api').replace('/api', '');
const resolveImg = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return `${SERVER_URL}${url}`;
  return url;
};

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconZoom = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const placeholderIcons = [
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
];

const GallerySection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.getGallery().then(data => {
      setImages(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const displayItems = images.length > 0 ? images.slice(0, 5) : [];

  return (
    <section className="gallery-section section" id="gallery">
      <div className="container">

        <div className="gallery-section__header">
          <div>
            <div className="section-label">Campus Life</div>
            <h2 className="section-title">Where Learning Meets a Life Well-Lived</h2>
          </div>
          <p className="section-desc" style={{ maxWidth: 500 }}>
            A glimpse into the vibrant campus community, events, and facilities
            that make Aashrayam truly special.
          </p>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner"></div> Loading gallery...</div>
        ) : (
          <div className="gallery-section__grid">
            {displayItems.map((img, i) => {
              const src = resolveImg(img.image_url);
              return (
                <div
                  key={img.id}
                  className={`gallery-item${i === 0 ? ' gallery-item--featured' : ''}`}
                  onClick={() => setLightbox(img)}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  {src ? (
                    <img src={src} alt={img.title || 'Campus'} className="gallery-item__img" />
                  ) : (
                    <div className="gallery-item__placeholder">
                      <div className="gallery-item__placeholder-icon">
                        {placeholderIcons[i % placeholderIcons.length]}
                      </div>
                      <p className="gallery-item__placeholder-label">{img.title || 'Campus'}</p>
                    </div>
                  )}
                  <div className="gallery-item__overlay">
                    <div className="gallery-item__zoom"><IconZoom /></div>
                  </div>
                  {img.title && (
                    <div className="gallery-item__label">{img.title}</div>
                  )}
                </div>
              );
            })}

            {Array.from({ length: Math.max(0, 5 - displayItems.length) }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className={`gallery-item gallery-item--empty${i + displayItems.length === 0 ? ' gallery-item--featured' : ''}`}
                style={{ animationDelay: `${(i + displayItems.length) * 0.07}s` }}
              >
                <div className="gallery-item__placeholder">
                  <div className="gallery-item__placeholder-icon">
                    {placeholderIcons[(i + displayItems.length) % placeholderIcons.length]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="gallery-section__cta">
            <Link to="/gallery" className="btn btn-primary">
              View Full Gallery
            </Link>
          </div>
        )}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox__inner" onClick={e => e.stopPropagation()}>
            <button className="lightbox__close" onClick={() => setLightbox(null)}>
              <IconClose />
            </button>
            <img src={resolveImg(lightbox.image_url)} alt={lightbox.title} className="lightbox__img" />
            {lightbox.title && <div className="lightbox__caption">{lightbox.title}</div>}
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;