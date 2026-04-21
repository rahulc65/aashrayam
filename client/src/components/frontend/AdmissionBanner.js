import { Link } from 'react-router-dom';
import './AdmissionBanner.css';

const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .94h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const AdmissionBanner = () => (
  <section className="admission-banner">
    <div className="admission-banner-container">
      <div className="admission-banner__inner">
        <div className="admission-banner__left">
          <div className="admission-banner__badge">Admissions Open</div>
          <h2 className="admission-banner__title">Your Future Starts<br />With One Step.</h2>
          <p className="admission-banner__desc">
            Visit the campus. Meet our faculty. Ask your questions. We invite students and
            parents to experience Aashrayam before making a decision. We're here to guide
            you — every step of the way.
          </p>
        </div>
        <div className="admission-banner__actions">
          <Link to="/contact" className="admission-banner__btn-apply">Apply Now</Link>
          <a href="tel:8078478506" className="admission-banner__btn-call">
            <IconPhone /> Call Us
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default AdmissionBanner;