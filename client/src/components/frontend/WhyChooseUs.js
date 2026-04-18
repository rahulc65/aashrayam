import './WhyChooseUs.css';

const reasons = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Career-Aligned Curriculum',
    desc: 'Our programmes are developed in partnership with industry leaders to ensure every module is relevant, practical, and job-ready from day one.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Strong Mentoring & Counselling',
    desc: 'Every student receives personal guidance. Our faculty — including retired government professors — know students by name.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Safe & Disciplined Campus',
    desc: 'A structured environment parents trust — calm, secure, and designed to support focused learning and character development.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
    title: 'A Calm Green Campus',
    desc: 'Nestled in Aashrayam Orchard, Kollengode — a natural setting that promotes wellbeing, focus, and belonging.',
  },
];

const WhyChooseUs = () => (
  <section className="why section">
    <div className="container why__inner">
      <div className="why__left">
        <div className="section-label">Why Choose Us</div>
        <h2 className="section-title">More Than a Degree.<br />A Direction.</h2>
        <p className="section-desc">
          Choosing the right college is one of the most important decisions of your life. At Aashrayam, we've built every aspect of our institution around your success.
        </p>
        <div className="why__img-wrap">
          <img
            src="https://res.cloudinary.com/dpqgpqdwk/image/upload/v1776413116/DSCF2006_j9emnq.webp"
            alt="Students collaborating"
            className="why__img"
          />
          <div className="why__img-overlay">
            <div className="why__overlay-stat">
              <div className="why__overlay-num">15+</div>
              <div className="why__overlay-label">Years of Excellence</div>
            </div>
          </div>
        </div>
      </div>

      <div className="why__right">
        {reasons.map((r, i) => (
          <div className="why__card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="why__card-icon">{r.icon}</div>
            <div className="why__card-body">
              <h3 className="why__card-title">{r.title}</h3>
              <p className="why__card-desc">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
