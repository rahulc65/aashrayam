import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const AashrayamLogo = () => (
  <svg className="navbar__logo-svg" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    {/* Top diamond (graduation cap top) */}
    <polygon points="40,4 62,18 40,32 18,18" fill="currentColor"/>
    {/* Book / open pages inside cap */}
    <path d="M29,20 Q40,28 40,28 Q40,28 51,20 L51,30 Q40,38 40,38 Q40,38 29,30 Z" fill="white" opacity="0.85"/>
    {/* Middle wide diamond */}
    <polygon points="40,36 68,50 40,64 12,50" fill="currentColor" opacity="0.7"/>
    {/* Bottom left small diamond */}
    <polygon points="22,62 34,68 22,74 10,68" fill="currentColor" opacity="0.45"/>
    {/* Bottom right small diamond */}
    <polygon points="58,62 70,68 58,74 46,68" fill="currentColor" opacity="0.45"/>
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/programs', label: 'Programmes' },
    { to: '/events', label: 'Events' },
    { to: '/news', label: 'News' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <AashrayamLogo />
          <div>
            <div className="navbar__logo-name">Aashrayam</div>
            <div className="navbar__logo-tag">College of Arts & Science</div>
          </div>
        </Link>
        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`navbar__link ${location.pathname === l.to ? 'navbar__link--active' : ''}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="navbar__cta-mobile">
            <Link to="/contact" className="btn btn-primary btn-sm">Apply Now</Link>
          </li>
        </ul>
        <div className="navbar__actions">
          <Link to="/contact" className="btn btn-primary btn-sm">Apply Now</Link>
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className={menuOpen ? 'open' : ''}></span>
            <span className={menuOpen ? 'open' : ''}></span>
            <span className={menuOpen ? 'open' : ''}></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
