import { Link } from 'react-router-dom';
import './Footer.css';

const AashrayamLogo = () => (
  <svg className="footer__logo-svg" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <polygon points="40,4 62,18 40,32 18,18" fill="#aaaaaa"/>
    <path d="M29,20 Q40,28 40,28 Q40,28 51,20 L51,30 Q40,38 40,38 Q40,38 29,30 Z" fill="white" opacity="0.6"/>
    <polygon points="40,36 68,50 40,64 12,50" fill="#777777"/>
    <polygon points="22,62 34,68 22,74 10,68" fill="#555555"/>
    <polygon points="58,62 70,68 58,74 46,68" fill="#555555"/>
  </svg>
);

const IconFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);

const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const IconTwitter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
  </svg>
);

const IconLinkedIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Footer = () => (
  <footer className="footer">
    <div className="footer__grid">

      {/* Brand */}
      <div className="footer__brand">
        <AashrayamLogo />
        <p className="footer__desc">
          Aashrayam College of Arts & Science is built for students who want clarity,
          direction, and a meaningful start to their professional journey.
        </p>
        <div className="footer__socials">
          <a href="#" aria-label="Facebook" className="footer__social"><IconFacebook /></a>
          <a href="#" aria-label="Instagram" className="footer__social"><IconInstagram /></a>
          <a href="#" aria-label="Twitter" className="footer__social"><IconTwitter /></a>
          <a href="#" aria-label="LinkedIn" className="footer__social"><IconLinkedIn /></a>
        </div>
      </div>

      {/* College */}
      <div className="footer__col">
        <h4 className="footer__heading">College</h4>
        <ul className="footer__list">
          {[
            { label: 'About Us', to: '/about' },
            { label: 'Vision & Mission', to: '/about#mission' },
            { label: 'Management', to: '/about#management' },
            { label: 'Faculty', to: '/about#faculty' },
            { label: 'Infrastructure', to: '/about#infrastructure' },
          ].map(l => (
            <li key={l.label}><Link to={l.to} className="footer__link">{l.label}</Link></li>
          ))}
        </ul>
      </div>

      {/* Programmes */}
      <div className="footer__col">
        <h4 className="footer__heading">Programmes</h4>
        <ul className="footer__list">
          {[
            'B.Com Co-operation',
            'B.Sc Psychology',
            'B.Voc Banking',
            'B.Sc AI (Coming)',
            'Fees & Scholarships',
          ].map(p => (
            <li key={p}><Link to="/programs" className="footer__link">{p}</Link></li>
          ))}
        </ul>
      </div>

      {/* Students */}
      <div className="footer__col">
        <h4 className="footer__heading">Students</h4>
        <ul className="footer__list">
          {[
            { label: 'Student Clubs', to: '/#clubs' },
            { label: 'Events', to: '/#events' },
            { label: 'Hall of Fame', to: '/#fame' },
            { label: 'Alumni', to: '/#alumni' },
            { label: 'Gallery', to: '/#gallery' },
          ].map(l => (
            <li key={l.label}><Link to={l.to} className="footer__link">{l.label}</Link></li>
          ))}
        </ul>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="footer__bottom">
      <span>© {new Date().getFullYear()} Aashrayam College of Arts & Science. A unit of SAMARPITHAM Educational Trust.</span>
      <span>
        Affiliated with <a href="https://uoc.ac.in" target="_blank" rel="noreferrer">University of Calicut</a>
        {' · '}
        <Link to="/admin/login">Admin</Link>
      </span>
    </div>
  </footer>
);

export default Footer;