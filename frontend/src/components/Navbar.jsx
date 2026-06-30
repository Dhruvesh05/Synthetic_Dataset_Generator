import { useState, useEffect } from "react";
import "./../styles/global.css";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`navbar-glow ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <nav className="navbar">
        <div className="navbar-left">
          <span className="logo" onClick={() => scrollToSection('home')}>
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0f766e" />
                  <stop offset="100%" stopColor="#115e59" />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="14" stroke="url(#logoGradient)" strokeWidth="2.5" fill="#ffffff" />
              <rect x="10.5" y="10.5" width="11" height="11" rx="3" fill="url(#logoGradient)" />
            </svg>
            <span className="logo-text">
              SynGen AI
            </span>
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="navbar-center">
          <a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
            Home
          </a>
          <a href="#features" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
            Features
          </a>
          <a href="#upload" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('upload'); }}>
            Upload
          </a>
          <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
            Why Us
          </a>
          <a href="#analytics" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('analytics'); }}>
            Results
          </a>
        </div>
        
        <div className="navbar-right">
          <button className="navbar-cta" onClick={() => scrollToSection('upload')}>
            Start Now
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>
      )}
      
      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <a href="#home" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
          Home
        </a>
        <a href="#features" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
          Features
        </a>
        <a href="#upload" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); scrollToSection('upload'); }}>
          Upload
        </a>
        <a href="#about" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
          Why Us
        </a>
        <a href="#analytics" className="mobile-menu-link" onClick={(e) => { e.preventDefault(); scrollToSection('analytics'); }}>
          Results
        </a>
      </div>
    </div>
  );
}

export default Navbar;

