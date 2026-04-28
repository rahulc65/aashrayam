import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import './GalleryFull.css';

const SERVER_URL = (process.env.REACT_APP_API_URL || 'http://localhost:4000/api').replace('/api', '');
const resolveImg = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return SERVER_URL + url;
  return url;
};

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

const GalleryFull = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getGallery().then(data => {
      const imagesList = Array.isArray(data) ? data : [];
      setImages(imagesList);
      const uniqueCategories = ['All', ...new Set(imagesList.map(img => img.category || 'Campus Life'))];
      setCategories(uniqueCategories);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredImages = activeFilter === 'All'
    ? images
    : images.filter(img => img.category === activeFilter);

  return (
    <div className="gallery-full">
      <div className="gallery-full__header">
        <div className="container">
          <h1 className="gallery-full__title">Campus Gallery</h1>
          <p className="gallery-full__subtitle">
            Explore the vibrant life and facilities at Aashrayam
          </p>
        </div>
      </div>

      <div className="container">
        {categories.length > 1 && (
          <div className="gallery-full__filters">
            <div className="gallery-full__filter-label">Filter by Category:</div>
            <div className="gallery-full__filter-tabs">
              {categories.map(category => (
                <button
                  key={category}
                  className={`gallery-full__filter-btn${activeFilter === category ? ' gallery-full__filter-btn--active' : ''}`}
                  onClick={() => setActiveFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="loader"><div className="spinner"></div> Loading gallery...</div>
        ) : filteredImages.length === 0 ? (
          <div className="gallery-full__empty">No images in this category yet.</div>
        ) : (
          <div className="gallery-full__grid">
            {filteredImages.map((img, i) => {
              const src = resolveImg(img.image_url);
              return (
                <div
                  key={img.id}
                  className="gallery-full__item"
                  onClick={() => setLightbox(img)}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="gallery-full__item-inner">
                    {src ? (
                      <img src={src} alt={img.title || 'Gallery'} className="gallery-full__img" />
                    ) : (
                      <div className="gallery-full__placeholder">
                        <IconZoom />
                      </div>
                    )}
                    <div className="gallery-full__overlay">
                      <div className="gallery-full__zoom"><IconZoom /></div>
                    </div>
                  </div>
                  {img.title && (
                    <div className="gallery-full__caption">{img.title}</div>
                  )}
                </div>
              );
            })}
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
    </div>
  );
};

export default GalleryFull;