import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import './GallerySection.css';

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

  return (
    <section className="gallery-section section" id="gallery">
      <div className="container">
        <div className="gallery-section__header">
          <div>
            <div className="section-label">Campus Life</div>
            <h2 className="section-title">Where Learning Meets a Life Well-Lived</h2>
          </div>
          <p className="section-desc" style={{ maxWidth: 360 }}>
            A glimpse into the vibrant campus community, events, and facilities that make Orbit Education truly special.
          </p>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner"></div> Loading gallery...</div>
        ) : images.length === 0 ? (
          <div className="news-section__empty">Gallery coming soon.</div>
        ) : (
          <div className="gallery-section__grid">
            {images.map((img, i) => (
              <div
                key={img.id}
                className={`gallery-item gallery-item--${i % 5 === 0 ? 'wide' : i % 7 === 0 ? 'tall' : 'normal'}`}
                onClick={() => setLightbox(img)}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <img src={img.image_url} alt={img.title || 'Campus'} className="gallery-item__img" />
                <div className="gallery-item__overlay">
                  {img.title && <span className="gallery-item__title">{img.title}</span>}
                  <span className="gallery-item__zoom">🔍</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox__inner" onClick={e => e.stopPropagation()}>
            <button className="lightbox__close" onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox.image_url} alt={lightbox.title} className="lightbox__img" />
            {lightbox.title && <div className="lightbox__caption">{lightbox.title}</div>}
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
