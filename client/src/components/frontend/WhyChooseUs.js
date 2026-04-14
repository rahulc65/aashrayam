import './WhyChooseUs.css';

const reasons = [
  {
    icon: '🗂️',
    title: 'Career-Aligned Curriculum',
    desc: 'Our programmes are developed in partnership with industry leaders to ensure every module is relevant, practical, and job-ready from day one.',
  },
  {
    icon: '🧭',
    title: 'Strong Mentoring & Counselling',
    desc: 'Every student has access to dedicated academic advisors and career coaches who provide personalised guidance throughout their educational journey.',
  },
  {
    icon: '🤝',
    title: 'Safe & Supportive Campus',
    desc: 'We foster an inclusive, respectful community with 24/7 student support services, wellbeing resources, and a vibrant campus life.',
  },
  {
    icon: '🌐',
    title: 'A Truly Global Campus',
    desc: 'With students and faculty from over 40 countries, Orbit Education offers a multicultural environment that prepares you for a global career.',
  },
];

const WhyChooseUs = () => (
  <section className="why section">
    <div className="container why__inner">
      <div className="why__left">
        <div className="section-label">Why Choose Us</div>
        <h2 className="section-title">More Than a Degree.<br />A Direction.</h2>
        <p className="section-desc">
          Choosing the right college is one of the most important decisions of your life. At Orbit Education, we've built every aspect of our institution around your success.
        </p>
        <div className="why__img-wrap">
          <img
            src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=500&q=80"
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
