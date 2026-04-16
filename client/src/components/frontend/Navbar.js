import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

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
          <div className="navbar__logo-icon">⬡</div>
          <div>
            <div className="navbar__logo-name">Aashrayam</div>
            <div className="navbar__logo-tag">College of Arts & Science</div>
          </div>
        </Link>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={`navbar__link ${location.pathname === l.to ? 'navbar__link--active' : ''}`}>
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
          <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
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
