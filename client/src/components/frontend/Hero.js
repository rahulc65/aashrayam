import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const stats = [
    { value: '20K+', label: 'Students Enrolled' },
    { value: '96%', label: 'Employment Rate' },
    { value: '200+', label: 'Industry Partners' },
  ];

  return (
    <section className="hero">
      <div className="hero__bg-shapes">
        <div className="hero__shape hero__shape--1"></div>
        <div className="hero__shape hero__shape--2"></div>
        <div className="hero__shape hero__shape--3"></div>
      </div>

      <div className="container hero__inner">
        <div className="hero__content fade-up fade-up-1">
          <div className="hero__eyebrow">
            <span className="badge badge-teal">Affiliated with University of Calicut</span>
          </div>
          <h1 className="hero__title">
            A Safe Place to Learn.<br />
            A Strong Start to the{' '}
            <span className="hero__title-accent">Future.</span>
          </h1>
          <p className="hero__desc">
            Aashrayam College is built to elevate life skills. Set on a stunning campus environment, we offer programmes that shape tomorrow's leaders across business, technology, healthcare, and the arts.
          </p>
          <div className="hero__actions">
            <Link to="/contact" className="btn btn-primary">Apply for Admission</Link>
            <Link to="/programs" className="btn btn-outline">View Programmes →</Link>
          </div>
          <div className="hero__stats">
            {stats.map(s => (
              <div key={s.label} className="hero__stat">
                <div className="hero__stat-value">{s.value}</div>
                <div className="hero__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__visual fade-up fade-up-2">
          <div className="hero__img-wrapper">
            <img
              src="https://res.cloudinary.com/dpqgpqdwk/image/upload/v1776413116/DSCF2006_j9emnq.webp"
              alt="Students on campus"
              className="hero__img"
            />
            <div className="hero__img-card">
              <div>
                <div className="hero__img-card-title">🌿 Green Campus</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
