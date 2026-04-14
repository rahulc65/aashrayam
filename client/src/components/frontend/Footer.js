import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">⬡</div>
              <div>
                <div className="footer__logo-name">Orbit Education</div>
                <div className="footer__logo-tag">A Safe Place to Learn</div>
              </div>
            </div>
            <p className="footer__desc">
              Empowering students with world-class education, mentorship, and career guidance since 2005. Building futures, one student at a time.
            </p>
            <div className="footer__socials">
              <a href="#" aria-label="Facebook" className="footer__social">f</a>
              <a href="#" aria-label="Twitter" className="footer__social">𝕏</a>
              <a href="#" aria-label="Instagram" className="footer__social">📷</a>
              <a href="#" aria-label="LinkedIn" className="footer__social">in</a>
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__list">
              {['Home','About','Programmes','Events','News','Contact'].map(l => (
                <li key={l}><Link to={`/${l.toLowerCase()}`} className="footer__link">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Programmes</h4>
            <ul className="footer__list">
              {['Business & Management','Psychology','Banking & Finance','Artificial Intelligence','Hospitality','Healthcare'].map(p => (
                <li key={p}><Link to="/programs" className="footer__link">{p}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Contact Info</h4>
            <ul className="footer__contact-list">
              <li>
                <span className="footer__contact-icon">📍</span>
                <span>123 Education Ave, Knowledge City, State 400001</span>
              </li>
              <li>
                <span className="footer__contact-icon">📞</span>
                <span>+1 (800) 123-4567</span>
              </li>
              <li>
                <span className="footer__contact-icon">✉️</span>
                <span>admissions@orbitedu.com</span>
              </li>
              <li>
                <span className="footer__contact-icon">🕒</span>
                <span>Mon – Fri: 9:00 AM – 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} Orbit Education. All rights reserved.</p>
          <div className="footer__bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <Link to="/admin/login">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
