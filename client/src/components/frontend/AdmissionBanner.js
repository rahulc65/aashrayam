import { Link } from 'react-router-dom';
import './AdmissionBanner.css';

const AdmissionBanner = () => (
  <section className="admission-banner">
    <div className="container admission-banner__inner">
      <div className="admission-banner__left">
        <div className="admission-banner__eyebrow">Admission Info</div>
        <h2 className="admission-banner__title">Your Future Starts With One Step.</h2>
        <p className="admission-banner__desc">
          Applications for the 2026 academic year are now open. Join thousands of students who have transformed their futures at Orbit Education.
        </p>
        <Link to="/contact" className="btn btn-white">Apply Now →</Link>
      </div>
      <div className="admission-banner__right">
        <div className="admission-banner__cards">
          <div className="admission-banner__card">
            <div className="admission-banner__card-icon">📅</div>
            <div className="admission-banner__card-text">Application Deadline</div>
            <div className="admission-banner__card-val">March 31, 2026</div>
          </div>
          <div className="admission-banner__card">
            <div className="admission-banner__card-icon">🏫</div>
            <div className="admission-banner__card-text">Semester Starts</div>
            <div className="admission-banner__card-val">August 15, 2026</div>
          </div>
          <div className="admission-banner__card">
            <div className="admission-banner__card-icon">💰</div>
            <div className="admission-banner__card-text">Scholarships Available</div>
            <div className="admission-banner__card-val">Up to 80% Off</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AdmissionBanner;
